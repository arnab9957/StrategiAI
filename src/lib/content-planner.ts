import { LLMRouter, LLMTask } from './llm-router';
import { TrendData } from './trend-discovery';
import { TimingRecommendation } from './timing-optimizer';

export interface ContentPiece {
  id: string;
  day: number;
  platform: string;
  contentType: 'post' | 'story' | 'reel' | 'video' | 'carousel' | 'live';
  title: string;
  caption: string;
  hashtags: string[];
  scheduledTime: string;
  trendTopic?: string;
  estimatedEngagement: number;
  mediaRequirements: {
    type: 'image' | 'video' | 'carousel' | 'text';
    specifications: string;
  };
  brandAlignment: number;
  sustainabilityScore?: number;
}

export interface ContentPlan {
  weekOf: Date;
  totalPieces: number;
  platforms: string[];
  contentPieces: ContentPiece[];
  gapAnalysis: {
    missingContentTypes: string[];
    underrepresentedPlatforms: string[];
    suggestions: string[];
  };
  repurposingOpportunities: {
    sourceContent: string;
    adaptations: string[];
  }[];
}

export interface BrandVoice {
  tone: string;
  personality: string[];
  values: string[];
  avoidTopics: string[];
  keyMessages: string[];
  targetAudience: string;
}

export class ContentPlanner {
  private llmRouter: LLMRouter;

  constructor() {
    this.llmRouter = new LLMRouter();
  }

  async generateWeeklyPlan(
    trends: TrendData[],
    timingRecommendations: TimingRecommendation[],
    brandVoice: BrandVoice,
    platforms: string[] = ['instagram', 'tiktok', 'linkedin', 'twitter']
  ): Promise<ContentPlan> {
    
    const contentPieces = await this.generateContentPieces(
      trends, 
      timingRecommendations, 
      brandVoice, 
      platforms
    );

    const gapAnalysis = this.analyzeContentGaps(contentPieces, platforms);
    const repurposingOpportunities = this.identifyRepurposingOpportunities(contentPieces);

    return {
      weekOf: new Date(),
      totalPieces: contentPieces.length,
      platforms,
      contentPieces,
      gapAnalysis,
      repurposingOpportunities
    };
  }

  private async generateContentPieces(
    trends: TrendData[],
    timingRecommendations: TimingRecommendation[],
    brandVoice: BrandVoice,
    platforms: string[]
  ): Promise<ContentPiece[]> {
    
    const contentPieces: ContentPiece[] = [];
    const contentTypesPerPlatform = {
      'instagram': ['post', 'story', 'reel', 'carousel'],
      'tiktok': ['video', 'live'],
      'linkedin': ['post', 'carousel', 'video'],
      'twitter': ['post', 'video'],
      'youtube': ['video', 'live']
    };

    // Generate 2-3 pieces per day per platform
    for (let day = 1; day <= 7; day++) {
      for (const platform of platforms) {
        const platformTiming = timingRecommendations.find(t => t.platform === platform);
        const relevantTrends = trends.filter(t => t.platforms.includes(platform)).slice(0, 2);
        
        const piecesForDay = await this.generateDayContent(
          day,
          platform,
          relevantTrends,
          platformTiming,
          brandVoice,
          contentTypesPerPlatform[platform] || ['post']
        );
        
        contentPieces.push(...piecesForDay);
      }
    }

    return contentPieces;
  }

  private async generateDayContent(
    day: number,
    platform: string,
    trends: TrendData[],
    timing: TimingRecommendation | undefined,
    brandVoice: BrandVoice,
    availableTypes: string[]
  ): Promise<ContentPiece[]> {
    
    const pieces: ContentPiece[] = [];
    const piecesPerDay = platform === 'instagram' ? 2 : 1;

    for (let i = 0; i < piecesPerDay; i++) {
      const trendTopic = trends[i % trends.length];
      const contentType = availableTypes[i % availableTypes.length];
      
      const task: LLMTask = {
        type: 'content-generation',
        complexity: 'medium',
        context: `Generate ${contentType} content for ${platform} about "${trendTopic?.topic || 'general brand content'}" 
                 Brand voice: ${brandVoice.tone}, targeting ${brandVoice.targetAudience}
                 Brand values: ${brandVoice.values.join(', ')}
                 Avoid: ${brandVoice.avoidTopics.join(', ')}`
      };

      const generatedContent = await this.llmRouter.executeTask(task);
      const parsedContent = this.parseGeneratedContent(generatedContent);

      const piece: ContentPiece = {
        id: `${platform}-day${day}-${i}`,
        day,
        platform,
        contentType: contentType as any,
        title: parsedContent.title,
        caption: parsedContent.caption,
        hashtags: await this.generateHashtags(trendTopic?.topic || '', platform),
        scheduledTime: timing?.optimalTime || '12:00 PM',
        trendTopic: trendTopic?.topic,
        estimatedEngagement: timing?.expectedEngagement || 50,
        mediaRequirements: this.getMediaRequirements(contentType),
        brandAlignment: this.calculateBrandAlignment(parsedContent.caption, brandVoice),
        sustainabilityScore: this.calculateSustainabilityScore(parsedContent.caption)
      };

      pieces.push(piece);
    }

    return pieces;
  }

  private parseGeneratedContent(content: string): { title: string; caption: string } {
    // Simple parsing - in production, this would be more sophisticated
    const lines = content.split('\n').filter(line => line.trim());
    return {
      title: lines[0] || 'Generated Content',
      caption: lines.slice(1).join('\n') || content
    };
  }

  private async generateHashtags(topic: string, platform: string): Promise<string[]> {
    const task: LLMTask = {
      type: 'content-generation',
      complexity: 'low',
      context: `Generate 5-8 relevant hashtags for "${topic}" on ${platform}. Focus on trending and niche hashtags.`
    };

    const hashtagsText = await this.llmRouter.executeTask(task);
    return hashtagsText.split(/[#\s,]+/).filter(tag => tag.length > 2).slice(0, 8);
  }

  private getMediaRequirements(contentType: string): { type: string; specifications: string } {
    const requirements = {
      'post': { type: 'image', specifications: '1080x1080px, high quality, brand colors' },
      'story': { type: 'image', specifications: '1080x1920px, vertical format, engaging visuals' },
      'reel': { type: 'video', specifications: '1080x1920px, 15-30 seconds, trending audio' },
      'video': { type: 'video', specifications: '1920x1080px or 1080x1920px, engaging thumbnail' },
      'carousel': { type: 'carousel', specifications: '2-10 slides, 1080x1080px each, cohesive design' },
      'live': { type: 'video', specifications: 'Real-time streaming, good lighting and audio' }
    };

    return requirements[contentType] || requirements['post'];
  }

  private calculateBrandAlignment(caption: string, brandVoice: BrandVoice): number {
    let score = 0.5; // Base score
    
    // Check for brand values
    brandVoice.values.forEach(value => {
      if (caption.toLowerCase().includes(value.toLowerCase())) {
        score += 0.1;
      }
    });

    // Check for key messages
    brandVoice.keyMessages.forEach(message => {
      if (caption.toLowerCase().includes(message.toLowerCase())) {
        score += 0.15;
      }
    });

    // Penalize for avoided topics
    brandVoice.avoidTopics.forEach(topic => {
      if (caption.toLowerCase().includes(topic.toLowerCase())) {
        score -= 0.2;
      }
    });

    return Math.max(0, Math.min(1, score));
  }

  private calculateSustainabilityScore(caption: string): number {
    const sustainabilityKeywords = [
      'sustainable', 'eco-friendly', 'green', 'renewable', 'recycled',
      'carbon-neutral', 'biodegradable', 'organic', 'ethical', 'fair-trade'
    ];

    let score = 0;
    sustainabilityKeywords.forEach(keyword => {
      if (caption.toLowerCase().includes(keyword)) {
        score += 0.1;
      }
    });

    return Math.min(1, score);
  }

  private analyzeContentGaps(contentPieces: ContentPiece[], platforms: string[]) {
    const contentTypesByPlatform = {};
    const platformCounts = {};

    contentPieces.forEach(piece => {
      if (!contentTypesByPlatform[piece.platform]) {
        contentTypesByPlatform[piece.platform] = new Set();
      }
      contentTypesByPlatform[piece.platform].add(piece.contentType);
      
      platformCounts[piece.platform] = (platformCounts[piece.platform] || 0) + 1;
    });

    const expectedTypes = {
      'instagram': ['post', 'story', 'reel', 'carousel'],
      'tiktok': ['video', 'live'],
      'linkedin': ['post', 'carousel', 'video'],
      'twitter': ['post', 'video']
    };

    const missingContentTypes = [];
    const underrepresentedPlatforms = [];

    platforms.forEach(platform => {
      const expected = expectedTypes[platform] || [];
      const actual = Array.from(contentTypesByPlatform[platform] || []);
      const missing = expected.filter(type => !actual.includes(type));
      
      if (missing.length > 0) {
        missingContentTypes.push(`${platform}: ${missing.join(', ')}`);
      }

      if ((platformCounts[platform] || 0) < 7) { // Less than 1 per day
        underrepresentedPlatforms.push(platform);
      }
    });

    return {
      missingContentTypes,
      underrepresentedPlatforms,
      suggestions: [
        ...missingContentTypes.map(gap => `Add ${gap}`),
        ...underrepresentedPlatforms.map(platform => `Increase ${platform} content frequency`)
      ]
    };
  }

  private identifyRepurposingOpportunities(contentPieces: ContentPiece[]) {
    const opportunities = [];
    
    // Find high-performing content types that can be adapted
    const videoContent = contentPieces.filter(p => p.contentType === 'video');
    const postContent = contentPieces.filter(p => p.contentType === 'post');

    videoContent.forEach(video => {
      opportunities.push({
        sourceContent: video.title,
        adaptations: [
          'Extract key quotes for Instagram posts',
          'Create carousel slides from main points',
          'Generate Twitter thread from script',
          'Create podcast episode from audio'
        ]
      });
    });

    postContent.forEach(post => {
      if (post.caption.length > 200) {
        opportunities.push({
          sourceContent: post.title,
          adaptations: [
            'Create short-form video script',
            'Break into Twitter thread',
            'Design infographic',
            'Expand into blog post'
          ]
        });
      }
    });

    return opportunities.slice(0, 5); // Limit to top 5 opportunities
  }

  async adaptContentForPlatform(
    sourceContent: ContentPiece,
    targetPlatform: string,
    brandVoice: BrandVoice
  ): Promise<ContentPiece> {
    const task: LLMTask = {
      type: 'content-generation',
      complexity: 'medium',
      context: `Adapt this content for ${targetPlatform}:
                Title: ${sourceContent.title}
                Caption: ${sourceContent.caption}
                
                Maintain brand voice: ${brandVoice.tone}
                Platform requirements: ${this.getPlatformRequirements(targetPlatform)}`
    };

    const adaptedContent = await this.llmRouter.executeTask(task);
    const parsed = this.parseGeneratedContent(adaptedContent);

    return {
      ...sourceContent,
      id: `${targetPlatform}-adapted-${Date.now()}`,
      platform: targetPlatform,
      title: parsed.title,
      caption: parsed.caption,
      mediaRequirements: this.getMediaRequirements(sourceContent.contentType),
      hashtags: await this.generateHashtags(sourceContent.trendTopic || '', targetPlatform)
    };
  }

  private getPlatformRequirements(platform: string): string {
    const requirements = {
      'instagram': 'Visual-first, engaging captions, relevant hashtags, stories for behind-the-scenes',
      'tiktok': 'Short-form video, trending sounds, quick hooks, vertical format',
      'linkedin': 'Professional tone, industry insights, thought leadership, networking focus',
      'twitter': 'Concise messaging, real-time engagement, trending topics, thread format for longer content',
      'youtube': 'Long-form content, SEO-optimized titles, detailed descriptions, engaging thumbnails'
    };

    return requirements[platform] || 'Platform-appropriate formatting and tone';
  }
}
