import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Video } from '@/services/tmdb';

interface VideoPlayerProps {
  videos: Video[];
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer = ({ videos, isOpen, onClose }: VideoPlayerProps) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter for YouTube trailers and teasers
  const playableVideos = videos.filter(
    video => video.site === 'YouTube' && 
    (video.type === 'Trailer' || video.type === 'Teaser')
  );

  if (!playableVideos.length) return null;

  const currentVideo = playableVideos[currentVideoIndex];
  const youtubeUrl = `https://www.youtube.com/embed/${currentVideo.key}?autoplay=1&rel=0&modestbranding=1`;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 md:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`${
              isFullscreen 
                ? 'w-full h-full' 
                : 'w-full max-w-4xl'
            } bg-black rounded-lg overflow-hidden shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-2 md:p-4 bg-black/50">
              <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
                <h3 className="text-white font-semibold text-sm md:text-lg truncate">
                  {currentVideo.name}
                </h3>
                {playableVideos.length > 1 && (
                  <div className="hidden sm:flex space-x-1 md:space-x-2">
                    {playableVideos.map((video, index) => (
                      <Button
                        key={video.id}
                        variant={index === currentVideoIndex ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentVideoIndex(index)}
                        className="text-xs px-2 py-1"
                      >
                        {video.type} {index + 1}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1 md:space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20 h-8 w-8 md:h-10 md:w-10"
                >
                  {isFullscreen ? (
                    <Minimize className="h-3 w-3 md:h-5 md:w-5" />
                  ) : (
                    <Maximize className="h-3 w-3 md:h-5 md:w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 h-8 w-8 md:h-10 md:w-10"
                >
                  <X className="h-3 w-3 md:h-5 md:w-5" />
                </Button>
              </div>
            </div>

            {/* Video Player */}
            <div className={`${isFullscreen ? 'h-[calc(100vh-60px)] md:h-[calc(100vh-80px)]' : 'aspect-video'} bg-black`}>
              <iframe
                src={youtubeUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentVideo.name}
              />
            </div>

            {/* Video Info */}
            {!isFullscreen && (
              <div className="p-2 md:p-4 bg-black/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-white/80 text-xs md:text-sm space-y-1 sm:space-y-0">
                  <span>{currentVideo.type} • {currentVideo.site}</span>
                  <span className="text-xs md:text-sm">Published: {new Date(currentVideo.published_at).toLocaleDateString()}</span>
                </div>
                
                {/* Mobile video selection */}
                {playableVideos.length > 1 && (
                  <div className="sm:hidden mt-2 flex flex-wrap gap-1">
                    {playableVideos.map((video, index) => (
                      <Button
                        key={video.id}
                        variant={index === currentVideoIndex ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentVideoIndex(index)}
                        className="text-xs px-2 py-1 h-auto"
                      >
                        {video.type} {index + 1}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoPlayer;
