import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Monitor, Smartphone, Tv, Headphones, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

interface PlayerSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySettings: (settings: PlayerSettings) => void;
}

interface PlayerSettings {
  quality: string;
  autoplay: boolean;
  subtitles: boolean;
  language: string;
  playbackSpeed: number;
  device: string;
}

const PlayerSettingsModal = ({ isOpen, onClose, onApplySettings }: PlayerSettingsProps) => {
  const [settings, setSettings] = useState<PlayerSettings>({
    quality: 'HD',
    autoplay: true,
    subtitles: false,
    language: 'en',
    playbackSpeed: 1.0,
    device: 'desktop'
  });

  const qualities = ['4K', 'HD', 'SD', 'Auto'];
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];
  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
  const devices = [
    { id: 'desktop', name: 'Desktop', icon: Monitor },
    { id: 'mobile', name: 'Mobile', icon: Smartphone },
    { id: 'tv', name: 'Smart TV', icon: Tv },
    { id: 'audio', name: 'Audio Only', icon: Headphones }
  ];

  const updateSetting = <K extends keyof PlayerSettings>(key: K, value: PlayerSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplySettings(settings);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl bg-background rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-6 w-6" />
                  <span>Player Settings</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Video Quality */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Video Quality</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {qualities.map((quality) => (
                      <Button
                        key={quality}
                        variant={settings.quality === quality ? "default" : "outline"}
                        onClick={() => updateSetting('quality', quality)}
                        className="h-12"
                      >
                        {quality}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Playback Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Playback</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Autoplay next episode</span>
                      <Switch
                        checked={settings.autoplay}
                        onCheckedChange={(checked) => updateSetting('autoplay', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Show subtitles</span>
                      <Switch
                        checked={settings.subtitles}
                        onCheckedChange={(checked) => updateSetting('subtitles', checked)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Playback Speed</label>
                      <div className="grid grid-cols-6 gap-2">
                        {speeds.map((speed) => (
                          <Button
                            key={speed}
                            variant={settings.playbackSpeed === speed ? "default" : "outline"}
                            onClick={() => updateSetting('playbackSpeed', speed)}
                            size="sm"
                          >
                            {speed}x
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Language Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Language & Subtitles</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant={settings.language === lang.code ? "default" : "outline"}
                        onClick={() => updateSetting('language', lang.code)}
                        className="justify-start h-12"
                      >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Device Optimization */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Device Optimization</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {devices.map((device) => {
                      const Icon = device.icon;
                      return (
                        <Button
                          key={device.id}
                          variant={settings.device === device.id ? "default" : "outline"}
                          onClick={() => updateSetting('device', device.id)}
                          className="justify-start h-14"
                        >
                          <Icon className="h-5 w-5 mr-2" />
                          {device.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleApply} className="bg-cinema-red hover:bg-cinema-red/90">
                    Apply Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlayerSettingsModal;
