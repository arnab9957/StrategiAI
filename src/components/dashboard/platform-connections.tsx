'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { 
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Users,
  TrendingUp,
  Eye
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  displayName: string;
  color: string;
  icon: string;
  connected: boolean;
  metrics?: {
    followers: number;
    engagement: number;
    reach: number;
  };
}

const platformIcons = {
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  tiktok: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  ),
  threads: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.01 1.5 8.434 2.35 5.58 3.995 3.529 5.845 1.225 8.598.044 12.179.02h.014c3.581.024 6.334 1.205 8.184 3.509C21.65 5.58 22.5 8.434 22.5 12.01c0 3.576-.85 6.43-2.495 8.481C18.155 22.795 15.402 23.976 11.821 24h.365zm4.959-16.206c-.373-.586-.905-1.055-1.584-1.393-.679-.339-1.496-.508-2.451-.508-.8 0-1.491.142-2.074.425-.583.283-1.042.678-1.375 1.184-.333.506-.499 1.084-.499 1.734 0 .381.055.734.166 1.061.11.326.272.618.484.875.212.257.473.48.783.669.31.189.663.349 1.061.481.398.132.845.237 1.34.315.495.078 1.033.117 1.613.117.58 0 1.118-.039 1.613-.117.495-.078.942-.183 1.34-.315.398-.132.751-.292 1.061-.481.31-.189.571-.412.783-.669.212-.257.374-.549.484-.875.11-.327.166-.68.166-1.061 0-.65-.166-1.228-.499-1.734-.333-.506-.792-.901-1.375-1.184-.583-.283-1.274-.425-2.074-.425-.955 0-1.772.169-2.451.508-.679.338-1.211.807-1.584 1.393z"/>
    </svg>
  ),
  discord: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  )
};

export function PlatformConnections() {
  const { user, connectPlatform, disconnectPlatform } = useAppStore();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const response = await fetch('/api/platforms/connect');
      const data = await response.json();
      
      // Mock connection status and metrics
      const platformsWithStatus = data.platforms.map((platform: any) => ({
        ...platform,
        connected: Math.random() > 0.5, // Random for demo
        metrics: {
          followers: Math.floor(Math.random() * 10000),
          engagement: Math.floor(Math.random() * 100),
          reach: Math.floor(Math.random() * 50000)
        }
      }));
      
      setPlatforms(platformsWithStatus);
    } catch (error) {
      console.error('Failed to fetch platforms:', error);
    }
  };

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    
    try {
      const response = await fetch('/api/platforms/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform: platformId }),
      });
      
      const data = await response.json();
      
      if (data.authUrl) {
        // Open OAuth flow in new window
        window.open(data.authUrl, 'oauth', 'width=500,height=600');
      }
    } catch (error) {
      console.error('Failed to connect platform:', error);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = (platformId: string) => {
    disconnectPlatform(platformId);
    setPlatforms(prev => 
      prev.map(p => 
        p.id === platformId ? { ...p, connected: false } : p
      )
    );
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          Platform Connections
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {platforms.map((platform, index) => {
          const IconComponent = platformIcons[platform.icon] || Plus;
          
          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border rounded-lg hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${platform.color}20` }}
                  >
                    <IconComponent 
                      className="w-5 h-5" 
                      style={{ color: platform.color }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{platform.displayName}</h4>
                    <div className="flex items-center gap-2">
                      {platform.connected ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Not Connected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant={platform.connected ? "outline" : "default"}
                  onClick={() => 
                    platform.connected 
                      ? handleDisconnect(platform.id)
                      : handleConnect(platform.id)
                  }
                  disabled={connecting === platform.id}
                >
                  {connecting === platform.id ? (
                    'Connecting...'
                  ) : platform.connected ? (
                    'Disconnect'
                  ) : (
                    'Connect'
                  )}
                </Button>
              </div>

              {platform.connected && platform.metrics && (
                <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                      <Users className="w-3 h-3" />
                      Followers
                    </div>
                    <div className="font-semibold">
                      {formatNumber(platform.metrics.followers)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                      <TrendingUp className="w-3 h-3" />
                      Engagement
                    </div>
                    <div className="font-semibold">
                      {platform.metrics.engagement}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                      <Eye className="w-3 h-3" />
                      Reach
                    </div>
                    <div className="font-semibold">
                      {formatNumber(platform.metrics.reach)}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
        
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground text-center">
            Connect your social media accounts to enable automated posting and analytics
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
