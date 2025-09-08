import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Episode {
  id: number;
  title: string;
  duration: string;
  description: string;
  thumbnail: string;
  rating: number;
  releaseDate: string;
}

interface EpisodeListProps {
  episodes: Episode[];
  onPlayEpisode: (episodeId: number) => void;
  currentMovie: string;
}

const EpisodeList = ({ episodes, onPlayEpisode, currentMovie }: EpisodeListProps) => {
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  // Sample episodes data (في التطبيق الحقيقي ستأتي من API)
  const sampleEpisodes: Episode[] = [
    {
      id: 1,
      title: `${currentMovie} - Part 1`,
      duration: '2h 15m',
      description: 'The beginning of an epic journey...',
      thumbnail: '/placeholder.svg',
      rating: 8.5,
      releaseDate: '2024-01-15'
    },
    {
      id: 2,
      title: `${currentMovie} - Part 2`,
      duration: '2h 30m',
      description: 'The adventure continues with more action...',
      thumbnail: '/placeholder.svg',
      rating: 8.8,
      releaseDate: '2024-06-20'
    }
  ];

  const episodeList = episodes.length > 0 ? episodes : sampleEpisodes;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Episodes & Parts</h2>
      
      <div className="grid gap-4">
        {episodeList.map((episode, index) => (
          <motion.div
            key={episode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`cinema-card cursor-pointer transition-all hover:scale-[1.02] ${
              selectedEpisode === episode.id ? 'ring-2 ring-cinema-gold' : ''
            }`}>
              <CardContent className="p-0">
                <div className="flex">
                  {/* Episode Thumbnail */}
                  <div className="relative w-48 h-28 flex-shrink-0">
                    <img
                      src={episode.thumbnail}
                      alt={episode.title}
                      className="w-full h-full object-cover rounded-l-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        className="h-12 w-12 rounded-full bg-cinema-red hover:bg-cinema-red/90"
                        onClick={() => {
                          setSelectedEpisode(episode.id);
                          onPlayEpisode(episode.id);
                        }}
                      >
                        <Play className="h-6 w-6 text-white ml-1" />
                      </Button>
                    </div>
                    
                    {/* Episode Number */}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {index + 1}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Episode Info */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold line-clamp-1">
                        {episode.title}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm text-cinema-gold">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{episode.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {episode.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{episode.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(episode.releaseDate).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EpisodeList;
