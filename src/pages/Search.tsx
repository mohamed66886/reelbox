import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MovieGrid from '@/components/MovieGrid';
import { movieService, Movie } from '@/services/tmdb';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from '@/hooks/use-toast';

const Search = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const debouncedQuery = useDebounce(query, 500);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Search movies when query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchMovies(debouncedQuery);
    } else {
      setMovies([]);
    }
  }, [debouncedQuery]);

  const searchMovies = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await movieService.searchMovies(searchQuery);
      setMovies(response.results);
    } catch (error) {
      console.error('Error searching movies:', error);
      toast({
        title: "Search Error",
        description: "Failed to search movies. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
    <div className="min-h-screen pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-8"
        >
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold gradient-text mb-3">
            Search Movies
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Discover your next favorite movie from our extensive collection
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-6 md:mb-8"
        >
          <div className="relative">
            <SearchIcon className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 md:h-5 md:w-5" />
            <Input
              placeholder="Search for movies, actors, directors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-6 text-sm md:text-lg glass-effect border-border/50"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 md:h-10 md:w-10"
                onClick={() => setQuery('')}
              >
                <X className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            )}
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {query ? (
            <MovieGrid
              movies={movies}
              title={`Search Results for "${query}"`}
              loading={loading}
              onFavoriteToggle={handleFavoriteToggle}
              favoriteIds={favorites}
            />
          ) : (
            <div className="text-center py-12 md:py-16">
              <SearchIcon className="mx-auto text-muted-foreground h-12 w-12 md:h-16 md:w-16 mb-4 md:mb-6" />
              <h3 className="text-lg md:text-2xl font-semibold mb-2">Start Searching</h3>
              <p className="text-muted-foreground text-sm md:text-lg px-4">
                Type in the search bar above to find movies
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Search;