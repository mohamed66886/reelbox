import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MovieGrid from '@/components/MovieGrid';
import { Movie } from '@/services/tmdb';
import { toast } from '@/hooks/use-toast';

const Favorites = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    // Load favorite movies from localStorage
    const savedMovies = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    const savedFavorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
    
    setFavoriteMovies(savedMovies);
    setFavorites(savedFavorites);
  }, []);

  const handleFavoriteToggle = (movie: Movie) => {
    const newFavorites = favorites.filter(id => id !== movie.id);
    const newFavoriteMovies = favoriteMovies.filter(m => m.id !== movie.id);
    
    setFavorites(newFavorites);
    setFavoriteMovies(newFavoriteMovies);
    
    localStorage.setItem('movieFavorites', JSON.stringify(newFavorites));
    localStorage.setItem('favoriteMovies', JSON.stringify(newFavoriteMovies));

    toast({
      title: "Removed from Favorites",
      description: `${movie.title} has been removed from your favorites`
    });
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    setFavoriteMovies([]);
    localStorage.removeItem('movieFavorites');
    localStorage.removeItem('favoriteMovies');
    
    toast({
      title: "Favorites Cleared",
      description: "All movies have been removed from your favorites"
    });
  };

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold gradient-text mb-2 md:mb-3">
              Your Favorites
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground">
              {favoriteMovies.length} movie{favoriteMovies.length !== 1 ? 's' : ''} in your collection
            </p>
          </div>
          
          {favoriteMovies.length > 0 && (
            <Button
              variant="outline"
              onClick={clearAllFavorites}
              className="hover:bg-destructive hover:text-destructive-foreground self-start sm:self-auto"
              size="sm"
            >
              <Trash2 className="mr-2 h-3 w-3 md:h-4 md:w-4" />
              Clear All
            </Button>
          )}
        </motion.div>

        {/* Movies Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {favoriteMovies.length > 0 ? (
            <MovieGrid
              movies={favoriteMovies}
              onFavoriteToggle={handleFavoriteToggle}
              favoriteIds={favorites}
            />
          ) : (
            <div className="text-center py-12 md:py-16">
              <Heart className="mx-auto text-muted-foreground h-12 w-12 md:h-16 md:w-16 mb-4 md:mb-6" />
              <h3 className="text-lg md:text-2xl font-semibold mb-2">No Favorites Yet</h3>
              <p className="text-muted-foreground text-sm md:text-lg mb-6 md:mb-8 px-4">
                Start adding movies to your favorites to see them here
              </p>
              <Button className="px-6 md:px-8 py-2 md:py-3" size="sm">
                <Heart className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                Discover Movies
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Favorites;