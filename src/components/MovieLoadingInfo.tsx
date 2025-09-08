import { motion } from 'framer-motion';
import { Download, Wifi, Film, Clock, HardDrive } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface MovieLoadingInfoProps {
  movieTitle: string;
  quality: string;
  fileSize?: string;
  downloadSpeed?: string;
  progress?: number;
}

const MovieLoadingInfo = ({ 
  movieTitle, 
  quality, 
  fileSize, 
  downloadSpeed, 
  progress = 0 
}: MovieLoadingInfoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
    >
      <Card className="w-96 bg-black/80 backdrop-blur-md border border-white/20">
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-cinema-gold">
              <Film className="h-6 w-6" />
              <h3 className="text-lg font-semibold text-white">Loading Movie</h3>
            </div>
            <p className="text-white font-medium">{movieTitle}</p>
            <Badge variant="secondary" className="bg-green-600 text-white">
              {quality} Quality
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/80">
              <span>Download Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {fileSize && (
              <div className="flex items-center space-x-2 text-white/80">
                <HardDrive className="h-4 w-4" />
                <span>{fileSize}</span>
              </div>
            )}
            
            {downloadSpeed && (
              <div className="flex items-center space-x-2 text-white/80">
                <Download className="h-4 w-4" />
                <span>{downloadSpeed}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-white/80">
              <Wifi className="h-4 w-4" />
              <span>Streaming</span>
            </div>
            
            <div className="flex items-center space-x-2 text-white/80">
              <Clock className="h-4 w-4" />
              <span>ETA: 2m</span>
            </div>
          </div>

          {/* Loading Animation */}
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-cinema-gold border-t-transparent rounded-full"
            />
          </div>

          {/* Info */}
          <p className="text-xs text-white/60 text-center">
            Fetching high-quality movie source and subtitles...
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MovieLoadingInfo;
