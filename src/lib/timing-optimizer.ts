export interface TimingRecommendation {
  platform: string;
  optimalTime: string;
  timezone: string;
  confidence: number;
  expectedEngagement: number;
  reasoning: string;
}

export interface UserProfile {
  timezone: string;
  audienceDemographics: {
    ageGroups: { [key: string]: number };
    locations: { [key: string]: number };
    interests: string[];
  };
  historicalEngagement: {
    platform: string;
    timeSlots: { [key: string]: number };
  }[];
}

export class TimingOptimizer {
  private circadianPatterns = {
    'instagram': {
      peak1: { start: 6, end: 9, multiplier: 1.3 },
      peak2: { start: 12, end: 14, multiplier: 1.2 },
      peak3: { start: 17, end: 21, multiplier: 1.4 }
    },
    'tiktok': {
      peak1: { start: 6, end: 10, multiplier: 1.2 },
      peak2: { start: 19, end: 23, multiplier: 1.5 }
    },
    'linkedin': {
      peak1: { start: 7, end: 9, multiplier: 1.4 },
      peak2: { start: 12, end: 14, multiplier: 1.2 },
      peak3: { start: 17, end: 18, multiplier: 1.3 }
    },
    'twitter': {
      peak1: { start: 8, end: 10, multiplier: 1.2 },
      peak2: { start: 12, end: 15, multiplier: 1.1 },
      peak3: { start: 17, end: 20, multiplier: 1.3 }
    },
    'youtube': {
      peak1: { start: 14, end: 16, multiplier: 1.2 },
      peak2: { start: 20, end: 22, multiplier: 1.4 }
    }
  };

  async getOptimalTiming(
    platforms: string[], 
    userProfile: UserProfile,
    contentType: string = 'general'
  ): Promise<TimingRecommendation[]> {
    const recommendations: TimingRecommendation[] = [];

    for (const platform of platforms) {
      const basePattern = this.circadianPatterns[platform];
      if (!basePattern) continue;

      const personalizedTiming = this.personalizeForUser(basePattern, userProfile, platform);
      const eventAdjustedTiming = await this.adjustForEvents(personalizedTiming);
      
      const recommendation: TimingRecommendation = {
        platform,
        optimalTime: this.formatTime(eventAdjustedTiming.bestHour),
        timezone: userProfile.timezone,
        confidence: eventAdjustedTiming.confidence,
        expectedEngagement: eventAdjustedTiming.expectedEngagement,
        reasoning: this.generateReasoning(platform, eventAdjustedTiming, userProfile)
      };

      recommendations.push(recommendation);
    }

    return recommendations;
  }

  private personalizeForUser(basePattern: any, userProfile: UserProfile, platform: string) {
    const historicalData = userProfile.historicalEngagement.find(h => h.platform === platform);
    
    if (!historicalData) {
      return this.getBestPeakTime(basePattern);
    }

    // Combine circadian patterns with user's historical performance
    const personalizedScores = {};
    
    for (let hour = 0; hour < 24; hour++) {
      const circadianScore = this.getCircadianScore(hour, basePattern);
      const historicalScore = historicalData.timeSlots[hour.toString()] || 0;
      const audienceScore = this.getAudienceScore(hour, userProfile);
      
      personalizedScores[hour] = (
        circadianScore * 0.4 +
        historicalScore * 0.4 +
        audienceScore * 0.2
      );
    }

    const bestHour = Object.keys(personalizedScores).reduce((a, b) => 
      personalizedScores[a] > personalizedScores[b] ? a : b
    );

    return {
      bestHour: parseInt(bestHour),
      score: personalizedScores[bestHour],
      confidence: this.calculateConfidence(historicalData, personalizedScores[bestHour])
    };
  }

  private async adjustForEvents(timing: any) {
    // Check for holidays, global events, platform algorithm updates
    const currentEvents = await this.getCurrentEvents();
    
    let adjustedTiming = { ...timing };
    
    for (const event of currentEvents) {
      if (event.type === 'holiday') {
        adjustedTiming.bestHour = this.adjustForHoliday(timing.bestHour, event);
      } else if (event.type === 'algorithm_update') {
        adjustedTiming.confidence *= 0.8; // Reduce confidence during algorithm changes
      }
    }

    adjustedTiming.expectedEngagement = this.calculateExpectedEngagement(adjustedTiming);
    
    return adjustedTiming;
  }

  private getBestPeakTime(pattern: any) {
    const peaks = Object.values(pattern) as any[];
    const bestPeak = peaks.reduce((best, current) => 
      current.multiplier > best.multiplier ? current : best
    );
    
    return {
      bestHour: Math.floor((bestPeak.start + bestPeak.end) / 2),
      score: bestPeak.multiplier,
      confidence: 0.7
    };
  }

  private getCircadianScore(hour: number, pattern: any): number {
    for (const peak of Object.values(pattern) as any[]) {
      if (hour >= peak.start && hour <= peak.end) {
        return peak.multiplier;
      }
    }
    return 0.5; // Base score for non-peak hours
  }

  private getAudienceScore(hour: number, userProfile: UserProfile): number {
    // Score based on when user's audience is most active
    const locationWeights = {
      'US': this.getUSActivityScore(hour),
      'EU': this.getEUActivityScore(hour),
      'ASIA': this.getAsiaActivityScore(hour)
    };

    let weightedScore = 0;
    let totalWeight = 0;

    for (const [location, percentage] of Object.entries(userProfile.audienceDemographics.locations)) {
      const weight = percentage / 100;
      const score = locationWeights[location] || 0.5;
      weightedScore += score * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? weightedScore / totalWeight : 0.5;
  }

  private getUSActivityScore(hour: number): number {
    // US activity patterns (EST)
    if (hour >= 6 && hour <= 9) return 0.8;
    if (hour >= 12 && hour <= 14) return 0.7;
    if (hour >= 17 && hour <= 21) return 0.9;
    return 0.4;
  }

  private getEUActivityScore(hour: number): number {
    // EU activity patterns (CET)
    if (hour >= 7 && hour <= 9) return 0.8;
    if (hour >= 12 && hour <= 14) return 0.7;
    if (hour >= 18 && hour <= 20) return 0.9;
    return 0.4;
  }

  private getAsiaActivityScore(hour: number): number {
    // Asia activity patterns (JST)
    if (hour >= 8 && hour <= 10) return 0.8;
    if (hour >= 12 && hour <= 14) return 0.6;
    if (hour >= 19 && hour <= 22) return 0.9;
    return 0.4;
  }

  private calculateConfidence(historicalData: any, score: number): number {
    const dataPoints = Object.keys(historicalData.timeSlots).length;
    const dataQuality = Math.min(dataPoints / 24, 1); // More data = higher confidence
    const scoreConfidence = Math.min(score, 1);
    
    return (dataQuality * 0.6 + scoreConfidence * 0.4);
  }

  private async getCurrentEvents(): Promise<any[]> {
    // Mock event data - in production, this would fetch from external APIs
    return [
      {
        type: 'holiday',
        name: 'Black Friday',
        impact: 'high',
        adjustment: 2 // Hours to shift
      }
    ];
  }

  private adjustForHoliday(hour: number, event: any): number {
    // Adjust timing based on holiday shopping patterns
    if (event.name === 'Black Friday') {
      return Math.max(6, hour - 2); // Earlier posting for shopping events
    }
    return hour;
  }

  private calculateExpectedEngagement(timing: any): number {
    return Math.round(timing.score * timing.confidence * 100);
  }

  private formatTime(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  }

  private generateReasoning(platform: string, timing: any, userProfile: UserProfile): string {
    const reasons = [];
    
    if (timing.confidence > 0.8) {
      reasons.push('High confidence based on historical performance');
    }
    
    if (timing.score > 1.2) {
      reasons.push(`Peak engagement window for ${platform}`);
    }
    
    const primaryLocation = Object.keys(userProfile.audienceDemographics.locations)[0];
    if (primaryLocation) {
      reasons.push(`Optimized for ${primaryLocation} audience timezone`);
    }

    return reasons.join('. ') + '.';
  }
}
