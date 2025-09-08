import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Play, Star, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { movieService, Movie } from '@/services/tmdb';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const [currentImageLoading, setCurrentImageLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const trendingResponse = await movieService.getTrending('week');
        // Filter for Egyptian and American movies (you can adjust this logic)
        const filteredMovies = trendingResponse.results.filter(movie => 
          movie.original_language === 'en' || movie.original_language === 'ar'
        );
        
        // Use fewer movies on mobile to improve performance
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const maxMovies = isMobile ? 5 : 10;
        const slicedMovies = filteredMovies.slice(0, maxMovies);
        
        // If not enough movies, get more popular ones
        if (slicedMovies.length < (isMobile ? 3 : 5)) {
          const popularResponse = await movieService.getPopular();
          slicedMovies.push(...popularResponse.results.slice(0, maxMovies - slicedMovies.length));
        }
        
        setMovies(slicedMovies);
        setLoading(false);
        
        // Preload images
        slicedMovies.forEach((movie, index) => {
          // Use smaller images for mobile devices
          const isMobile = window.innerWidth < 768;
          const backdropUrl = movie.backdrop_path 
            ? `https://image.tmdb.org/t/p/${isMobile ? 'w780' : 'w1280'}${movie.backdrop_path}`
            : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
          
          const posterUrl = `https://image.tmdb.org/t/p/${isMobile ? 'w342' : 'w500'}${movie.poster_path}`;
          
          // Preload backdrop with priority for first few images
          const backdropImg = new Image();
          backdropImg.onload = () => {
            setImagesLoaded(prev => new Set([...prev, movie.id]));
            if (index === 0) setCurrentImageLoading(false);
          };
          backdropImg.onerror = () => {
            if (index === 0) setCurrentImageLoading(false);
          };
          
          // Load only first image immediately on mobile, others with delay
          if (index === 0) {
            backdropImg.src = backdropUrl;
          } else if (index < (isMobile ? 2 : 3)) {
            setTimeout(() => {
              backdropImg.src = backdropUrl;
            }, index * (isMobile ? 200 : 100));
          } else {
            // Load remaining images after a longer delay on mobile
            setTimeout(() => {
              backdropImg.src = backdropUrl;
            }, index * (isMobile ? 500 : 200));
          }
          
          // Preload poster with delay on mobile
          const posterImg = new Image();
          if (isMobile && index > 0) {
            setTimeout(() => {
              posterImg.src = posterUrl;
            }, index * 300);
          } else {
            posterImg.src = posterUrl;
          }
        });
        
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  // Auto-rotate movies every 4 seconds (longer on mobile)
  useEffect(() => {
    if (movies.length === 0) return;
    
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const rotationInterval = isMobile ? 4000 : 3000; // Slower rotation on mobile
    
    const interval = setInterval(() => {
      setCurrentMovieIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % movies.length;
        const nextMovie = movies[nextIndex];
        
        // Check if next image is loaded
        if (!imagesLoaded.has(nextMovie.id)) {
          setCurrentImageLoading(true);
          // Give less time for image to load on mobile
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
          setTimeout(() => setCurrentImageLoading(false), isMobile ? 300 : 500);
        } else {
          setCurrentImageLoading(false);
        }
        
        return nextIndex;
      });
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [movies, imagesLoaded]);

  if (loading || movies.length === 0) {
    return (
      <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        <div className="text-white text-lg sm:text-xl md:text-2xl text-center px-4">Loading trending movies...</div>
      </section>
    );
  }

  const currentMovie = movies[currentMovieIndex];
  // Use smaller images for mobile devices
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const backdropUrl = currentMovie.backdrop_path 
    ? `https://image.tmdb.org/t/p/${isMobile ? 'w780' : 'w1280'}${currentMovie.backdrop_path}`
    : `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`;

  const handleImageLoad = () => {
    setCurrentImageLoading(false);
  };

  const handleImageError = () => {
    setCurrentImageLoading(false);
  };

  return (
    <section className="relative min-h-[100vh] sm:min-h-[90vh] md:min-h-[100vh] flex items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ 
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="absolute inset-0"
        >
          {/* Loading overlay */}
          {currentImageLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center z-10">
              <div className="flex items-center space-x-2 text-white">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-cinema-gold"></div>
                <span className="text-base sm:text-lg">Loading...</span>
              </div>
            </div>
          )}
          
          <motion.img
            src={backdropUrl}
            alt={currentMovie.title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              currentImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: currentImageLoading ? 0 : 1 }}
            transition={{ 
              duration: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            onLoad={handleImageLoad}
            onError={(e) => {
              // Fallback to poster if backdrop fails
              const target = e.target as HTMLImageElement;
              if (currentMovie.poster_path && !target.src.includes('poster')) {
                target.src = `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`;
              } else {
                handleImageError();
              }
            }}
            loading="eager"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          {/* Movie Info */}
          <motion.div
            key={`info-${currentMovie.id}`}
            initial={{ opacity: 0, x: -80, y: 30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -50, y: -20 }}
            transition={{ 
              duration: 1,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="space-y-4 sm:space-y-5 md:space-y-6"
          >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="space-y-3 sm:space-y-4"
              >
                <Badge variant="secondary" className="bg-cinema-gold text-black font-semibold text-xs sm:text-sm">
                  {currentMovie.original_language === 'ar' ? 'Egyptian' : 'Hollywood'} Trending
                </Badge>
                
                <motion.h1 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.7 }}
                >
                  {currentMovie.title}
                </motion.h1>
                
                <motion.div 
                  className="flex items-center gap-3 sm:gap-4 text-white/80 text-sm sm:text-base"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{currentMovie.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{new Date(currentMovie.release_date).getFullYear()}</span>
                  </div>
                </motion.div>
                
                <motion.p 
                  className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-xl line-clamp-3 sm:line-clamp-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  {currentMovie.overview}
                </motion.p>
              </motion.div>            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Button 
                size="lg" 
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-cinema-gold hover:bg-cinema-gold/90 text-black font-semibold"
                onClick={() => {
                  window.location.href = `/movie/${currentMovie.id}`;
                }}
              >
                <Play className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                Watch Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg border-white/30 text-white hover:bg-white/10"
                onClick={() => {
                  // Add to favorites in localStorage
                  const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
                  if (!favorites.includes(currentMovie.id)) {
                    const newFavorites = [...favorites, currentMovie.id];
                    localStorage.setItem('movieFavorites', JSON.stringify(newFavorites));
                    // Save movie details for favorites page
                    const savedMovies = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
                    const updatedMovies = [...savedMovies, currentMovie];
                    localStorage.setItem('favoriteMovies', JSON.stringify(updatedMovies));
                    // Optional: show toast if you have a toast system
                    if (typeof window !== 'undefined' && window.toast) {
                      window.toast({
                        title: 'Added to Favorites',
                        description: `${currentMovie.title} has been added to your favorites`,
                      });
                    }
                  }
                }}
              >
                <Star className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Add to Favorites
              </Button>
            </motion.div>
          </motion.div>

          {/* Movie Poster */}
          <motion.div
            key={`poster-${currentMovie.id}`}
            initial={{ opacity: 0, x: 80, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ 
              duration: 1,
              delay: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="flex justify-center lg:justify-end mt-8 lg:mt-0"
          >
            <div className="relative">
              <motion.img
                src={`https://image.tmdb.org/t/p/${isMobile ? 'w342' : 'w500'}${currentMovie.poster_path}`}
                alt={currentMovie.title}
                className="w-48 sm:w-60 md:w-72 lg:w-80 h-auto rounded-2xl shadow-2xl"
                initial={{ scale: 0.8, rotateY: -15 }}
                animate={{ scale: 1, rotateY: 0 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                transition={{ duration: 0.8, delay: 0.6 }}
                loading="lazy"
                onLoad={() => {
                  setImagesLoaded(prev => new Set([...prev, currentMovie.id]));
                }}
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              
              {/* Poster loading placeholder */}
              {!imagesLoaded.has(currentMovie.id) && (
                <div className="absolute inset-0 bg-gray-800 rounded-2xl animate-pulse flex items-center justify-center">
                  <div className="text-white/60">Loading...</div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Movie Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex gap-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentMovieIndex(index);
                const selectedMovie = movies[index];
                if (!imagesLoaded.has(selectedMovie.id)) {
                  setCurrentImageLoading(true);
                } else {
                  setCurrentImageLoading(false);
                }
              }}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentMovieIndex 
                  ? 'bg-cinema-gold scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;