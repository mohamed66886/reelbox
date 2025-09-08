import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path?: string;
    vote_average: number;
    release_date: string;
    overview: string;
  };
  onFavoriteToggle?: (movie: MovieCardProps['movie']) => void;
  isFavorite?: boolean;
}

const MovieCard = ({ movie, onFavoriteToggle, isFavorite }: MovieCardProps) => {
  const navigate = useNavigate();
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.svg';

  const year = new Date(movie.release_date).getFullYear();
  const rating = movie.vote_average.toFixed(1);

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="movie-card group cursor-pointer rounded-lg overflow-hidden shadow-cinema bg-gradient-hero text-xs md:text-sm"
      onClick={handleCardClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="movie-overlay">
          <div className="absolute inset-0 flex flex-col justify-end p-2 md:p-4">
            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 md:h-4 md:w-4 text-cinema-gold fill-current" />
                  <span className="text-xs md:text-sm font-semibold text-white">{rating}</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 md:h-8 md:w-8 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.preventDefault();
                    onFavoriteToggle?.(movie);
                  }}
                >
                  {isFavorite ? (
                    <Heart className="h-3 w-3 md:h-4 md:w-4 fill-current text-red-500" />
                  ) : (
                    <Plus className="h-3 w-3 md:h-4 md:w-4" />
                  )}
                </Button>
              </div>
              
              <h3 className="text-white font-semibold text-xs md:text-sm line-clamp-2">
                {movie.title}
              </h3>
              
              <p className="text-white/80 text-[10px] md:text-xs">
                {year}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Info */}
      <div className="p-2 md:p-4 space-y-1 md:space-y-2">
        <h3 className="font-semibold text-xs md:text-sm line-clamp-1">{movie.title}</h3>
        <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2">
          {movie.overview}
        </p>
      </div>
    </motion.div>
  );
};

export default MovieCard;