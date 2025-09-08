import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import MovieGrid from '@/components/MovieGrid';
import { movieService, Movie } from '@/services/tmdb';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Fetch movies on component mount
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const [trendingResponse, popularResponse, topRatedResponse] = await Promise.all([
        movieService.getTrending('week'),
        movieService.getPopular(),
        movieService.getTopRated(),
      ]);

      setTrendingMovies(trendingResponse.results.slice(0, 12));
      setPopularMovies(popularResponse.results.slice(0, 12));
      setTopRatedMovies(topRatedResponse.results.slice(0, 12));
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load movies. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleFavoriteToggle = (movie: Movie) => {
    const newFavorites = favorites.includes(movie.id)
      ? favorites.filter(id => id !== movie.id)
      : [...favorites, movie.id];
    
    setFavorites(newFavorites);
    localStorage.setItem('movieFavorites', JSON.stringify(newFavorites));
    
    // Also save movie details for favorites page
    if (!favorites.includes(movie.id)) {
      const savedMovies = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
      const updatedMovies = [...savedMovies, movie];
      localStorage.setItem('favoriteMovies', JSON.stringify(updatedMovies));
    } else {
      const savedMovies = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
      const updatedMovies = savedMovies.filter((m: Movie) => m.id !== movie.id);
      localStorage.setItem('favoriteMovies', JSON.stringify(updatedMovies));
    }

    toast({
      title: favorites.includes(movie.id) ? "Removed from Favorites" : "Added to Favorites",
      description: favorites.includes(movie.id) 
        ? `${movie.title} has been removed from your favorites`
        : `${movie.title} has been added to your favorites`
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Movie Sections */}
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Trending This Week */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <MovieGrid
            movies={trendingMovies}
            title="🔥 Trending This Week"
            loading={loading}
            onFavoriteToggle={handleFavoriteToggle}
            favoriteIds={favorites}
          />
        </motion.section>

        {/* Popular Movies */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MovieGrid
            movies={popularMovies}
            title="🍿 Popular Movies"
            loading={loading}
            onFavoriteToggle={handleFavoriteToggle}
            favoriteIds={favorites}
          />
        </motion.section>

        {/* Top Rated */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <MovieGrid
            movies={topRatedMovies}
            title="⭐ Top Rated"
            loading={loading}
            onFavoriteToggle={handleFavoriteToggle}
            favoriteIds={favorites}
          />
        </motion.section>
      </div>
    </div>
  );
};

export default Index;