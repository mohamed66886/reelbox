import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  SkipBack, 
  SkipForward,
  Settings,
  Subtitles,
  RotateCcw,
  Loader
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import PlayerSettingsModal from './PlayerSettingsModal';
import MovieLoadingInfo from './MovieLoadingInfo';
import { movieService, StreamingSource } from '@/services/tmdb';

interface MoviePlayerProps {
  movieTitle: string;
  movieYear: number;
  moviePoster: string;
  movieId: number;
  isOpen: boolean;
  onClose: () => void;
}

const MoviePlayer = ({ movieTitle, movieYear, moviePoster, movieId, isOpen, onClose }: MoviePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [quality, setQuality] = useState('HD');
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [movieSources, setMovieSources] = useState<StreamingSource[]>([]);
  const [availableSubtitles, setAvailableSubtitles] = useState<Array<{language: string; url: string; label: string}>>([]);
  const [loadingMovie, setLoadingMovie] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // تحميل مصادر الفيلم عند فتح المشغل
  useEffect(() => {
    const loadMovieSources = async () => {
      if (!isOpen || !movieId) return;
      
      setLoadingMovie(true);
      
      // استخدام timeout لتجنب التحميل المستمر
      const timeoutId = setTimeout(() => {
        setLoadingMovie(false);
        toast({
          title: "Loading Taking Too Long",
          description: "Using demo video instead",
          variant: "default"
        });
      }, 5000); // 5 ثواني timeout

      try {
        const streamingData = await movieService.getMovieStreamingSources(movieId);
        clearTimeout(timeoutId);
        setMovieSources(streamingData.sources);
        setAvailableSubtitles(streamingData.subtitles);
        
        toast({
          title: "Movie Ready! 🎬",
          description: `${movieTitle} is ready to play in ${streamingData.sources[0]?.quality || 'HD'} quality.`
        });
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error loading movie sources:', error);
        
        // اختيار فيلم مناسب حسب نوع الفيلم المطلوب
        let selectedMovieSources;
        const titleLower = movieTitle.toLowerCase();
        
        if (titleLower.includes('horror') || titleLower.includes('zombie') || titleLower.includes('scary')) {
          // أفلام رعب
          selectedMovieSources = [
            {
              quality: 'HD',
              url: 'https://archive.org/download/night_of_the_living_dead_1968/night_of_the_living_dead_1968_512kb.mp4',
              format: 'mp4',
              size: '495MB'
            }
          ];
        } else if (titleLower.includes('sci-fi') || titleLower.includes('space') || titleLower.includes('alien')) {
          // أفلام خيال علمي
          selectedMovieSources = [
            {
              quality: 'HD',
              url: 'https://archive.org/download/Plan9FromOuterSpace_201301/Plan9FromOuterSpace.mp4',
              format: 'mp4',
              size: '623MB'
            }
          ];
        } else if (titleLower.includes('classic') || movieYear < 1950) {
          // أفلام كلاسيكية
          selectedMovieSources = [
            {
              quality: 'HD',
              url: 'https://archive.org/download/Nosferatu_1922_murnau/Nosferatu_1922_murnau_512kb.mp4',
              format: 'mp4',
              size: '387MB'
            }
          ];
        } else {
          // أفلام عامة - فيديو تجريبي سريع
          selectedMovieSources = [
            {
              quality: 'HD',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              format: 'mp4',
              size: '158MB'
            }
          ];
        }
        
        setMovieSources(selectedMovieSources);
        
        toast({
          title: "Classic Movie Loaded! 🎭",
          description: "Playing a classic public domain film. This is a real movie from cinema history!",
        });
      } finally {
        setLoadingMovie(false);
      }
    };

    loadMovieSources();
  }, [isOpen, movieId, movieTitle, movieYear]);

  // أفلام حقيقية مجانية للعرض التوضيحي
  const sampleMovieSources = [
    {
      quality: 'HD',
      url: 'https://archive.org/download/night_of_the_living_dead_1968/night_of_the_living_dead_1968_512kb.mp4',
      size: '495MB'
    },
    {
      quality: 'SD',
      url: 'https://archive.org/download/Plan9FromOuterSpace_201301/Plan9FromOuterSpace.mp4',
      size: '623MB'
    }
  ];

  const currentSource = movieSources.find(source => source.quality === quality) || 
                       sampleMovieSources.find(source => source.quality === quality) || 
                       movieSources[0] || 
                       sampleMovieSources[0];

  // إعادة تحميل الفيديو عند تغيير المصدر
  useEffect(() => {
    if (videoRef.current && currentSource?.url) {
      setIsLoading(true);
      setVideoError(false);
      videoRef.current.load();
    }
  }, [currentSource?.url]);

  const togglePlayPause = useCallback(async () => {
    if (videoRef.current && currentSource?.url) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          // التأكد من أن المصدر محمل قبل المحاولة
          if (videoRef.current.readyState >= 2) {
            await videoRef.current.play();
            setIsPlaying(true);
          } else {
            // إذا لم يكن المصدر جاهز، أعد تحميله
            videoRef.current.load();
            toast({
              title: "Loading Video...",
              description: "Please wait while the video loads",
            });
          }
        }
      } catch (error) {
        console.error('Play error:', error);
        setIsPlaying(false);
        toast({
          title: "Playback Error",
          description: "Unable to play video. Trying to reload...",
          variant: "destructive"
        });
        // محاولة إعادة تحميل الفيديو
        if (videoRef.current) {
          videoRef.current.load();
        }
      }
    }
  }, [isPlaying, currentSource?.url]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'KeyF':
          setIsFullscreen(!isFullscreen);
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'ArrowLeft':
          if (videoRef.current && videoRef.current.readyState >= 2) {
            videoRef.current.currentTime -= 10;
          }
          break;
        case 'ArrowRight':
          if (videoRef.current && videoRef.current.readyState >= 2) {
            videoRef.current.currentTime += 10;
          }
          break;
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, isFullscreen, togglePlayPause, toggleMute, onClose]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100;
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = (value[0] / 100) * duration;
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    setVideoError(false);
    setRetryCount(0);
    setDuration(videoRef.current?.duration || 0);
    
    // تعيين الصوت بناءً على الحالة الحالية
    if (videoRef.current) {
      videoRef.current.volume = volume[0] / 100;
      videoRef.current.muted = isMuted;
    }
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setVideoError(true);
    
    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
      toast({
        title: "Retrying...",
        description: `Attempt ${retryCount + 1}/3 - Trying alternative source`,
        variant: "default"
      });
      
      // محاولة تغيير الجودة تلقائياً
      const availableSources = movieSources.length > 0 ? movieSources : sampleMovieSources;
      const currentQualityIndex = availableSources.findIndex(source => source.quality === quality);
      
      if (currentQualityIndex < availableSources.length - 1) {
        const nextSource = availableSources[currentQualityIndex + 1];
        setQuality(nextSource.quality);
      } else if (availableSources.length > 0) {
        // العودة للمصدر الأول
        setQuality(availableSources[0].quality);
      }
      
      setTimeout(() => {
        setVideoError(false);
        if (videoRef.current) {
          videoRef.current.load();
        }
      }, 2000);
    } else {
      toast({
        title: "Video Unavailable",
        description: "Unable to load video after multiple attempts. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSettingsApply = (settings: {
    quality: string;
    autoplay: boolean;
    subtitles: boolean;
    language: string;
    playbackSpeed: number;
    device: string;
  }) => {
    setQuality(settings.quality);
    setSubtitlesEnabled(settings.subtitles);
    if (videoRef.current) {
      videoRef.current.playbackRate = settings.playbackSpeed;
    }
    toast({
      title: "Settings Applied",
      description: "Player settings have been updated successfully."
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
        onMouseMove={handleMouseMove}
      >
        <div className={`relative w-full h-full ${isFullscreen ? '' : 'max-w-7xl mx-auto'}`}>
          {/* Video Player */}
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            src={currentSource?.url}
            onLoadedData={handleVideoLoad}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={handleVideoError}
            onCanPlay={() => setIsLoading(false)}
            onWaiting={() => setIsLoading(true)}
            poster={moviePoster}
            preload="metadata"
          />

          {/* Loading Overlay */}
          {(isLoading || loadingMovie || videoError) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 p-4">
              {videoError ? (
                <div className="text-center text-white">
                  <RotateCcw className="h-8 w-8 md:h-12 md:w-12 animate-spin mx-auto mb-3 md:mb-4" />
                  <p className="text-sm md:text-lg">Switching to alternative source...</p>
                  <p className="text-xs md:text-sm text-gray-300">Please wait</p>
                </div>
              ) : loadingMovie ? (
                <MovieLoadingInfo
                  movieTitle={movieTitle}
                  quality={quality}
                  fileSize={currentSource && 'size' in currentSource ? String(currentSource.size) : undefined}
                  downloadSpeed="Loading..."
                  progress={45}
                />
              ) : (
                <div className="text-center text-white">
                  <Loader className="h-8 w-8 md:h-12 md:w-12 animate-spin mx-auto mb-3 md:mb-4" />
                  <p className="text-sm md:text-lg">Buffering...</p>
                </div>
              )}
            </div>
          )}

          {/* Controls Overlay */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50"
              >
                {/* Top Controls */}
                <div className="absolute top-0 left-0 right-0 p-3 md:p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-4">
                    <h1 className="text-white text-sm md:text-xl font-semibold truncate max-w-32 sm:max-w-48 md:max-w-none">
                      {movieTitle} <span className="hidden sm:inline">({movieYear})</span>
                    </h1>
                    <Badge variant="secondary" className="bg-green-600 text-white text-xs md:text-sm">
                      {quality}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                      className="text-white hover:bg-white/20 h-8 w-8 md:h-10 md:w-10"
                    >
                      <Subtitles className="h-3 w-3 md:h-5 md:w-5" />
                    </Button>
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

                {/* Center Play Button */}
                {!isPlaying && !isLoading && !loadingMovie && !videoError && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Button
                      onClick={togglePlayPause}
                      className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/30"
                    >
                      <Play className="h-6 w-6 md:h-8 md:w-8 text-white ml-1" />
                    </Button>
                  </motion.div>
                )}

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
                  {/* Progress Bar */}
                  <div className="mb-3 md:mb-4">
                    <Slider
                      value={[duration ? (currentTime / duration) * 100 : 0]}
                      onValueChange={handleProgressChange}
                      max={100}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-white text-xs md:text-sm mt-1 md:mt-2">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => skipTime(-10)}
                        className="text-white hover:bg-white/20 h-8 w-8 md:h-10 md:w-10"
                      >
                        <SkipBack className="h-3 w-3 md:h-5 md:w-5" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePlayPause}
                        className="text-white hover:bg-white/20 h-10 w-10 md:h-12 md:w-12"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5 md:h-6 md:w-6" />
                        ) : (
                          <Play className="h-5 w-5 md:h-6 md:w-6" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => skipTime(10)}
                        className="text-white hover:bg-white/20 h-8 w-8 md:h-10 md:w-10"
                      >
                        <SkipForward className="h-3 w-3 md:h-5 md:w-5" />
                      </Button>

                      <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* Mobile volume button - shows on small screens */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleMute}
                          className="sm:hidden text-white hover:bg-white/20 h-8 w-8"
                        >
                          {isMuted ? (
                            <VolumeX className="h-3 w-3" />
                          ) : (
                            <Volume2 className="h-3 w-3" />
                          )}
                        </Button>
                        
                        {/* Desktop volume controls - hidden on small screens */}
                        <div className="hidden sm:flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMute}
                            className="text-white hover:bg-white/20 h-8 w-8 md:h-10 md:w-10"
                          >
                            {isMuted ? (
                              <VolumeX className="h-3 w-3 md:h-5 md:w-5" />
                            ) : (
                              <Volume2 className="h-3 w-3 md:h-5 md:w-5" />
                            )}
                          </Button>
                          <div className="w-16 md:w-24">
                            <Slider
                              value={volume}
                              onValueChange={handleVolumeChange}
                              max={100}
                              step={1}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 md:space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSettings(true)}
                        className="text-white hover:bg-white/20 h-8 w-8 md:h-10 md:w-10"
                      >
                        <Settings className="h-3 w-3 md:h-5 md:w-5" />
                      </Button>
                      <select
                        value={quality}
                        onChange={(e) => setQuality(e.target.value)}
                        className="bg-black/50 text-white border border-white/20 rounded px-1 md:px-2 py-1 text-xs md:text-sm"
                      >
                        {(movieSources.length > 0 ? movieSources : sampleMovieSources).map((source) => (
                          <option key={source.quality} value={source.quality}>
                            {source.quality} {'size' in source && source.size ? ` (${source.size})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtitles */}
          {subtitlesEnabled && availableSubtitles.length > 0 && (
            <div className="absolute bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 px-4">
              <div className="bg-black/70 text-white px-3 md:px-4 py-2 rounded text-center max-w-xs md:max-w-none">
                <div className="mb-1 md:mb-2 text-xs md:text-sm">
                  {availableSubtitles[0].label} Subtitles Available
                </div>
                <div className="text-xs md:text-sm">
                  Sample subtitle text would appear here
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Player Settings Modal */}
        <PlayerSettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onApplySettings={handleSettingsApply}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default MoviePlayer;
