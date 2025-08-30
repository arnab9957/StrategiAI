import { LLMRouter, LLMTask } from './llm-router';

export interface TrendData {
  topic: string;
  score: number;
  growthVelocity: number;
  audienceRelevance: number;
  competitionLevel: number;
  leadTime: string;
  explanation: string;
  platforms: string[];
  geoRegions: string[];
  culturalContext?: string;
}

export interface MicroTrend extends TrendData {
  detectedAt: Date;
  confidence: number;
  sourceCount: number;
}

export class TrendDiscoveryEngine {
  private llmRouter: LLMRouter;
  private dataSources: string[] = [
    'twitter-api', 'instagram-api', 'tiktok-api', 'reddit-api', 
    'youtube-api', 'linkedin-api', 'discord-api', 'substack-api'
  ];

  constructor() {
    this.llmRouter = new LLMRouter();
  }

  async discoverTrends(platforms: string[] = [], geoFilter?: string): Promise<TrendData[]> {
    const rawData = await this.collectTrendData(platforms, geoFilter);
    const scoredTrends = await this.scoreTrends(rawData);
    const explainedTrends = await this.explainTrends(scoredTrends);
    
    return explainedTrends.sort((a, b) => b.score - a.score);
  }

  async detectMicroTrends(): Promise<MicroTrend[]> {
    const recentData = await this.collectRecentData(6); // Last 6 hours
    const microTrends: MicroTrend[] = [];

    for (const data of recentData) {
      if (this.isMicroTrend(data)) {
        const microTrend: MicroTrend = {
          ...data,
          detectedAt: new Date(),
          confidence: this.calculateConfidence(data),
          sourceCount: data.platforms.length
        };
        microTrends.push(microTrend);
      }
    }

    return microTrends;
  }

  private async collectTrendData(platforms: string[], geoFilter?: string): Promise<any[]> {
    // Simulate data collection from multiple sources
    const mockData = [
      {
        topic: 'AI Video Generation',
        mentions: 15420,
        growth: 0.85,
        platforms: ['tiktok', 'youtube', 'twitter'],
        regions: ['US', 'UK', 'CA']
      },
      {
        topic: 'Sustainable Fashion Tech',
        mentions: 8930,
        growth: 0.62,
        platforms: ['instagram', 'linkedin', 'pinterest'],
        regions: ['EU', 'US', 'AU']
      },
      {
        topic: 'Web3 Gaming',
        mentions: 12100,
        growth: 0.73,
        platforms: ['discord', 'twitter', 'reddit'],
        regions: ['US', 'JP', 'KR']
      }
    ];

    return mockData.filter(item => 
      !platforms.length || item.platforms.some(p => platforms.includes(p))
    );
  }

  private async collectRecentData(hours: number): Promise<any[]> {
    // Simulate real-time data collection for micro-trend detection
    return [
      {
        topic: 'Quantum Computing Breakthrough',
        mentions: 245,
        growth: 2.1,
        platforms: ['twitter', 'linkedin'],
        regions: ['US'],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      }
    ];
  }

  private async scoreTrends(rawData: any[]): Promise<TrendData[]> {
    return rawData.map(data => {
      const growthVelocity = this.calculateGrowthVelocity(data);
      const audienceRelevance = this.calculateAudienceRelevance(data);
      const competitionLevel = this.calculateCompetitionLevel(data);
      
      const score = (
        growthVelocity * 0.4 +
        audienceRelevance * 0.35 +
        (1 - competitionLevel) * 0.25
      ) * 100;

      return {
        topic: data.topic,
        score: Math.round(score),
        growthVelocity,
        audienceRelevance,
        competitionLevel,
        leadTime: this.calculateLeadTime(growthVelocity),
        explanation: '',
        platforms: data.platforms,
        geoRegions: data.regions
      };
    });
  }

  private async explainTrends(trends: TrendData[]): Promise<TrendData[]> {
    const explainedTrends = [];

    for (const trend of trends) {
      const task: LLMTask = {
        type: 'trend-discovery',
        complexity: 'medium',
        context: `Explain why "${trend.topic}" is trending with a growth velocity of ${trend.growthVelocity} and audience relevance of ${trend.audienceRelevance}. Platforms: ${trend.platforms.join(', ')}`
      };

      const explanation = await this.llmRouter.executeTask(task);
      explainedTrends.push({
        ...trend,
        explanation
      });
    }

    return explainedTrends;
  }

  private calculateGrowthVelocity(data: any): number {
    return Math.min(data.growth || 0, 1);
  }

  private calculateAudienceRelevance(data: any): number {
    const platformWeight = {
      'tiktok': 0.9, 'instagram': 0.85, 'youtube': 0.8,
      'twitter': 0.75, 'linkedin': 0.7, 'discord': 0.65
    };
    
    const avgWeight = data.platforms.reduce((sum: number, platform: string) => 
      sum + (platformWeight[platform] || 0.5), 0) / data.platforms.length;
    
    return avgWeight;
  }

  private calculateCompetitionLevel(data: any): number {
    // Higher mentions = higher competition
    const mentionThreshold = 10000;
    return Math.min(data.mentions / mentionThreshold, 1);
  }

  private calculateLeadTime(velocity: number): string {
    if (velocity > 0.8) return '1-2 weeks';
    if (velocity > 0.6) return '2-4 weeks';
    if (velocity > 0.4) return '1-2 months';
    return '2-3 months';
  }

  private isMicroTrend(data: any): boolean {
    return data.growth > 1.5 && data.mentions < 1000;
  }

  private calculateConfidence(data: any): number {
    const factors = [
      data.growth > 1.0 ? 0.3 : 0,
      data.platforms.length > 1 ? 0.2 : 0,
      data.mentions > 100 ? 0.3 : 0,
      data.regions.length > 1 ? 0.2 : 0
    ];
    
    return factors.reduce((sum, factor) => sum + factor, 0);
  }
}
