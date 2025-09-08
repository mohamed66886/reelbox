import { motion } from 'framer-motion';
import { Clapperboard } from 'lucide-react';
import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  onFavoriteToggle?: (movie: Movie) => void;
  favoriteIds?: number[];
  loading?: boolean;
}

const MovieGrid = ({ movies, title, onFavoriteToggle, favoriteIds = [], loading }: MovieGridProps) => {
  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        {title && (
          <h2 className="text-lg md:text-2xl lg:text-3xl font-display font-bold">{title}</h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="cinema-card aspect-[2/3] animate-pulse bg-muted/20"
            />
          ))}
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {title && (
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg md:text-2xl lg:text-3xl font-display font-bold gradient-text"
        >
          {title}
        </motion.h2>
      )}
      
      {movies.length === 0 ? (
        <div className="text-center py-8 md:py-16">
          <Clapperboard className="mx-auto text-muted-foreground h-8 w-8 md:h-16 md:w-16 mb-3 md:mb-6" />
          <h3 className="text-base md:text-xl font-semibold mb-1 md:mb-2">No Movies Found</h3>
          <p className="text-muted-foreground text-xs md:text-base px-2 md:px-4">Try adjusting your search criteria</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6"
        >
          {movies.map((movie) => (
            <motion.div key={movie.id} variants={item}>
              <MovieCard
                movie={movie}
                onFavoriteToggle={onFavoriteToggle}
                isFavorite={favoriteIds.includes(movie.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MovieGrid;