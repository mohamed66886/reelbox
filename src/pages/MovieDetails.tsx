import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Calendar, Clock, Globe, DollarSign, Heart, Plus, Play, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { movieService, MovieDetails as MovieDetailsType, Video } from '@/services/tmdb';
import { toast } from '@/hooks/use-toast';
import VideoPlayer from '@/components/VideoPlayer';
import MoviePlayer from '@/components/MoviePlayer';
import EpisodeList from '@/components/EpisodeList';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [isMoviePlayerOpen, setIsMoviePlayerOpen] = useState(false);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchMovieDetails(parseInt(id));
    }
  }, [id]);

  const fetchMovieDetails = async (movieId: number) => {
    setLoading(true);
    try {
      const [movieDetails, videosResponse] = await Promise.all([
        movieService.getMovieDetails(movieId),
        movieService.getMovieVideos(movieId)
      ]);
      
      setMovie(movieDetails);
      setVideos(videosResponse.results);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      toast({
        title: "Error",
        description: "Failed to load movie details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    if (!movie) return;

    const newFavorites = favorites.includes(movie.id)
      ? favorites.filter(fav => fav !== movie.id)
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
      const updatedMovies = savedMovies.filter((m: MovieDetailsType) => m.id !== movie.id);
      localStorage.setItem('favoriteMovies', JSON.stringify(updatedMovies));
    }

    toast({
      title: favorites.includes(movie.id) ? "Removed from Favorites" : "Added to Favorites",
      description: favorites.includes(movie.id) 
        ? `${movie.title} has been removed from your favorites`
        : `${movie.title} has been added to your favorites`
    });
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleWatchTrailer = () => {
    if (videos.length > 0) {
      setIsVideoPlayerOpen(true);
    } else {
      toast({
        title: "No Trailers Available",
        description: "Sorry, no trailers are available for this movie.",
        variant: "destructive"
      });
    }
  };

  const handleWatchMovie = () => {
    setIsMoviePlayerOpen(true);
  };

  const handlePlayEpisode = (episodeId: number) => {
    console.log('Playing episode:', episodeId);
    setIsMoviePlayerOpen(true);
    toast({
      title: "Playing Episode",
      description: `Starting episode ${episodeId}`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;
  
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.svg';

  const isFavorite = favorites.includes(movie.id);
  const rating = movie.vote_average.toFixed(1);
  const year = new Date(movie.release_date).getFullYear();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <div className="relative min-h-[70vh] md:min-h-screen">
        {backdropUrl && (
          <div className="absolute inset-0">
            <img
              src={backdropUrl}
              alt={movie.title}
              className={`w-full h-full object-cover transition-opacity duration-1000 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
          </div>
        )}

        <div className="relative z-10 pt-16 pb-8">
          <div className="container mx-auto px-4">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-white hover:bg-white/20"
                size="sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 items-start">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="md:col-span-1 mx-auto md:mx-0"
              >
                <Card className="overflow-hidden cinema-card max-w-xs md:max-w-none">
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                </Card>
              </motion.div>

              {/* Movie Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="md:col-span-2 space-y-4"
              >
                {/* Title and Basic Info */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white">
                      {movie.title}
                    </h1>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleFavoriteToggle}
                        className="h-10 w-10 border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                      >
                        {isFavorite ? (
                          <Heart className="h-4 w-4 fill-current text-red-500" />
                        ) : (
                          <Heart className="h-4 w-4 text-white" style={{ transform: 'scaleX(-1)' }} />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: movie.title,
                              text: movie.overview,
                              url: window.location.href,
                            });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                            toast({
                              title: "Link Copied!",
                              description: "Movie link copied to clipboard.",
                            });
                          }
                        }}
                      >
                        <Share2 className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </div>

                  {movie.tagline && (
                    <p className="text-sm md:text-lg text-cinema-gold italic">"{movie.tagline}"</p>
                  )}

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <Badge key={genre.id} variant="secondary" className="bg-cinema-gold/20 text-cinema-gold border-cinema-gold/30">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>

                  {/* Rating and Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 md:gap-6 text-white text-sm md:text-base">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-cinema-gold fill-current" />
                      <span className="font-semibold">{rating}</span>
                      <span className="text-white/60 hidden sm:inline">({movie.vote_count} votes)</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-white/60" />
                      <span>{year}</span>
                    </div>
                    
                    {movie.runtime && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-white/60" />
                        <span>{formatRuntime(movie.runtime)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4 text-white/60" />
                      <span className="uppercase">{movie.original_language}</span>
                    </div>
                  </div>
                </div>

                {/* Overview */}
                <div className="space-y-3">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">Overview</h2>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    {movie.overview}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <Button 
                    variant="outline"
                    className="border-cinema-gold/30 bg-cinema-gold/10 backdrop-blur-sm hover:bg-cinema-gold/20 text-cinema-gold px-4 py-2 text-xs md:text-base"
                    onClick={handleWatchTrailer}
                    disabled={videos.length === 0}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {videos.length > 0 ? 'Watch Trailer' : 'No Trailer Available'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 text-xs md:text-base"
                    onClick={handleFavoriteToggle}
                  >
                    <Heart className="mr-2 h-4 w-4 text-red-500" />
                    Add to Favorites
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="bg-background py-8 md:py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {/* Production Details */}
            {/* Production Details */}
            <Card className="cinema-card">
              <CardContent className="p-4 md:p-6 space-y-3">
                <h3 className="text-lg md:text-xl font-semibold">Production Details</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Status</p>
                    <p className="font-medium text-sm md:text-base">{movie.status}</p>
                  </div>
                  
                  {movie.budget > 0 && (
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Budget</p>
                      <p className="font-medium text-sm md:text-base">{formatCurrency(movie.budget)}</p>
                    </div>
                  )}
                  
                  {movie.revenue > 0 && (
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Revenue</p>
                      <p className="font-medium text-sm md:text-base">{formatCurrency(movie.revenue)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>            {/* Production Companies */}
            {movie.production_companies.length > 0 && (
              <Card className="cinema-card">
                <CardContent className="p-4 md:p-6 space-y-3">
                  <h3 className="text-lg md:text-xl font-semibold">Production Companies</h3>
                  <div className="space-y-2">
                    {movie.production_companies.slice(0, 3).map((company) => (
                      <div key={company.id} className="flex items-center space-x-2">
                        {company.logo_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                            alt={company.name}
                            className="h-6 md:h-8 object-contain"
                          />
                        )}
                        <span className="font-medium text-sm md:text-base">{company.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Countries & Languages */}
            <Card className="cinema-card">
              <CardContent className="p-4 md:p-6 space-y-3">
                <h3 className="text-lg md:text-xl font-semibold">Release Info</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Countries</p>
                    <div className="flex flex-wrap gap-1">
                      {movie.production_countries.slice(0, 3).map((country, index) => (
                        <span key={country.iso_3166_1} className="text-xs md:text-sm">
                          {country.name}{index < movie.production_countries.length - 1 && index < 2 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Languages</p>
                    <div className="flex flex-wrap gap-1">
                      {movie.spoken_languages.slice(0, 3).map((lang, index) => (
                        <span key={lang.iso_639_1} className="text-xs md:text-sm">
                          {lang.english_name}{index < movie.spoken_languages.length - 1 && index < 2 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Release Date</p>
                    <p className="font-medium text-sm md:text-base">
                      {new Date(movie.release_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="bg-background py-8 md:py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <EpisodeList 
              episodes={[]}
              onPlayEpisode={handlePlayEpisode}
              currentMovie={movie.title}
            />
          </motion.div>
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayer
        videos={videos}
        isOpen={isVideoPlayerOpen}
        onClose={() => setIsVideoPlayerOpen(false)}
      />

      {/* Movie Player */}
      <MoviePlayer
        movieId={movie.id}
        movieTitle={movie.title}
        movieYear={year}
        moviePoster={posterUrl}
        isOpen={isMoviePlayerOpen}
        onClose={() => setIsMoviePlayerOpen(false)}
      />
    </div>
  );
};

export default MovieDetails;
