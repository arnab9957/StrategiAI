export interface PlatformConfig {
  id: string;
  name: string;
  displayName: string;
  authUrl: string;
  scopes: string[];
  clientId: string;
  redirectUri: string;
  color: string;
  icon: string;
}

export interface ConnectionStatus {
  platform: string;
  connected: boolean;
  lastSync: Date | null;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  metrics?: {
    followers: number;
    engagement: number;
    reach: number;
  };
}

export class PlatformConnector {
  private platforms: Map<string, PlatformConfig> = new Map();

  constructor() {
    this.initializePlatforms();
  }

  private initializePlatforms() {
    const configs: PlatformConfig[] = [
      {
        id: 'instagram',
        name: 'instagram',
        displayName: 'Instagram',
        authUrl: 'https://api.instagram.com/oauth/authorize',
        scopes: ['user_profile', 'user_media'],
        clientId: process.env.INSTAGRAM_CLIENT_ID || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/instagram`,
        color: '#E4405F',
        icon: 'instagram'
      },
      {
        id: 'tiktok',
        name: 'tiktok',
        displayName: 'TikTok',
        authUrl: 'https://www.tiktok.com/auth/authorize/',
        scopes: ['user.info.basic', 'video.list'],
        clientId: process.env.TIKTOK_CLIENT_ID || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/tiktok`,
        color: '#000000',
        icon: 'tiktok'
      },
      {
        id: 'linkedin',
        name: 'linkedin',
        displayName: 'LinkedIn',
        authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
        scopes: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
        clientId: process.env.LINKEDIN_CLIENT_ID || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/linkedin`,
        color: '#0077B5',
        icon: 'linkedin'
      },
      {
        id: 'twitter',
        name: 'twitter',
        displayName: 'Twitter/X',
        authUrl: 'https://twitter.com/i/oauth2/authorize',
        scopes: ['tweet.read', 'tweet.write', 'users.read'],
        clientId: process.env.TWITTER_CLIENT_ID || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/twitter`,
        color: '#1DA1F2',
        icon: 'twitter'
      },
      {
        id: 'youtube',
        name: 'youtube',
        displayName: 'YouTube',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
        clientId: process.env.YOUTUBE_CLIENT_ID || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/youtube`,
        color: '#FF0000',
        icon: 'youtube'
      },
      // Emerging platforms
      {
        id: 'threads',
        name: 'threads',
        displayName: 'Threads',
        authUrl: 'https://threads.net/oauth/authorize',
        scopes: ['threads_basic', 'threads_content_publish'],
        clientId: process.env.THREADS_CLIENT_ID || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/threads`,
        color: '#000000',
        icon: 'threads'
      },
      {
        id: 'discord',
        name: 'discord',
        displayName: 'Discord',
        authUrl: 'https://discord.com/api/oauth2/authorize',
        scopes: ['identify', 'guilds'],
        clientId: process.env.DISCORD_CLIENT_ID || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/discord`,
        color: '#5865F2',
        icon: 'discord'
      }
    ];

    configs.forEach(config => {
      this.platforms.set(config.id, config);
    });
  }

  getPlatformConfig(platformId: string): PlatformConfig | undefined {
    return this.platforms.get(platformId);
  }

  getAllPlatforms(): PlatformConfig[] {
    return Array.from(this.platforms.values());
  }

  getAuthUrl(platformId: string, state?: string): string {
    const config = this.platforms.get(platformId);
    if (!config) {
      throw new Error(`Platform ${platformId} not found`);
    }

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(' '),
      response_type: 'code',
      state: state || Math.random().toString(36).substring(7)
    });

    return `${config.authUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(platformId: string, code: string): Promise<any> {
    const config = this.platforms.get(platformId);
    if (!config) {
      throw new Error(`Platform ${platformId} not found`);
    }

    // Platform-specific token exchange logic
    switch (platformId) {
      case 'instagram':
        return this.exchangeInstagramToken(config, code);
      case 'tiktok':
        return this.exchangeTikTokToken(config, code);
      case 'linkedin':
        return this.exchangeLinkedInToken(config, code);
      case 'twitter':
        return this.exchangeTwitterToken(config, code);
      case 'youtube':
        return this.exchangeYouTubeToken(config, code);
      default:
        throw new Error(`Token exchange not implemented for ${platformId}`);
    }
  }

  private async exchangeInstagramToken(config: PlatformConfig, code: string) {
    const response = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET || '',
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri,
        code
      })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange Instagram code for token');
    }

    return response.json();
  }

  private async exchangeTikTokToken(config: PlatformConfig, code: string) {
    const response = await fetch('https://open-api.tiktok.com/oauth/access_token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: config.clientId,
        client_secret: process.env.TIKTOK_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri
      })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange TikTok code for token');
    }

    return response.json();
  }

  private async exchangeLinkedInToken(config: PlatformConfig, code: string) {
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: config.clientId,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
        redirect_uri: config.redirectUri
      })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange LinkedIn code for token');
    }

    return response.json();
  }

  private async exchangeTwitterToken(config: PlatformConfig, code: string) {
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${config.clientId}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        code_verifier: 'challenge' // In production, use proper PKCE
      })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange Twitter code for token');
    }

    return response.json();
  }

  private async exchangeYouTubeToken(config: PlatformConfig, code: string) {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET || '',
        redirect_uri: config.redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange YouTube code for token');
    }

    return response.json();
  }

  async refreshToken(platformId: string, refreshToken: string): Promise<any> {
    const config = this.platforms.get(platformId);
    if (!config) {
      throw new Error(`Platform ${platformId} not found`);
    }

    // Implement refresh token logic for each platform
    // This is a simplified version - each platform has different refresh mechanisms
    const response = await fetch(`${config.authUrl.replace('authorize', 'token')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: config.clientId,
        client_secret: process.env[`${platformId.toUpperCase()}_CLIENT_SECRET`] || ''
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh ${platformId} token`);
    }

    return response.json();
  }

  async fetchPlatformMetrics(platformId: string, accessToken: string): Promise<any> {
    // Fetch basic metrics from each platform
    switch (platformId) {
      case 'instagram':
        return this.fetchInstagramMetrics(accessToken);
      case 'tiktok':
        return this.fetchTikTokMetrics(accessToken);
      case 'linkedin':
        return this.fetchLinkedInMetrics(accessToken);
      case 'twitter':
        return this.fetchTwitterMetrics(accessToken);
      case 'youtube':
        return this.fetchYouTubeMetrics(accessToken);
      default:
        return { followers: 0, engagement: 0, reach: 0 };
    }
  }

  private async fetchInstagramMetrics(accessToken: string) {
    const response = await fetch(`https://graph.instagram.com/me?fields=account_type,media_count&access_token=${accessToken}`);
    const data = await response.json();
    
    return {
      followers: data.followers_count || 0,
      engagement: 0, // Calculate from recent posts
      reach: 0 // Calculate from insights
    };
  }

  private async fetchTikTokMetrics(accessToken: string) {
    const response = await fetch('https://open-api.tiktok.com/user/info/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    
    return {
      followers: data.data?.follower_count || 0,
      engagement: 0,
      reach: 0
    };
  }

  private async fetchLinkedInMetrics(accessToken: string) {
    const response = await fetch('https://api.linkedin.com/v2/people/(id~)', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    
    return {
      followers: 0, // LinkedIn doesn't provide follower count in basic API
      engagement: 0,
      reach: 0
    };
  }

  private async fetchTwitterMetrics(accessToken: string) {
    const response = await fetch('https://api.twitter.com/2/users/me?user.fields=public_metrics', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    
    return {
      followers: data.data?.public_metrics?.followers_count || 0,
      engagement: 0,
      reach: 0
    };
  }

  private async fetchYouTubeMetrics(accessToken: string) {
    const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    
    const stats = data.items?.[0]?.statistics;
    return {
      followers: parseInt(stats?.subscriberCount || '0'),
      engagement: 0,
      reach: parseInt(stats?.viewCount || '0')
    };
  }
}
