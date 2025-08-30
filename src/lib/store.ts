import { create } from 'zustand';
import { TrendData, MicroTrend } from './trend-discovery';
import { TimingRecommendation, UserProfile } from './timing-optimizer';
import { ContentPlan, BrandVoice } from './content-planner';

interface Platform {
  id: string;
  name: string;
  connected: boolean;
  lastSync: Date | null;
  metrics: {
    followers: number;
    engagement: number;
    reach: number;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  profile: UserProfile;
  brandVoice: BrandVoice;
  connectedPlatforms: Platform[];
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    credits: number;
    usage: {
      trendsAnalyzed: number;
      contentGenerated: number;
      scheduledPosts: number;
    };
  };
}

interface AppState {
  // User & Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Trends & Analytics
  trends: TrendData[];
  microTrends: MicroTrend[];
  isLoadingTrends: boolean;
  
  // Content Planning
  currentContentPlan: ContentPlan | null;
  timingRecommendations: TimingRecommendation[];
  isGeneratingPlan: boolean;
  
  // Dashboard
  selectedPlatforms: string[];
  dashboardWidgets: string[];
  
  // AI Credits
  creditsRemaining: number;
  
  // Actions
  setUser: (user: User) => void;
  updateTrends: (trends: TrendData[]) => void;
  updateMicroTrends: (microTrends: MicroTrend[]) => void;
  setContentPlan: (plan: ContentPlan) => void;
  setTimingRecommendations: (recommendations: TimingRecommendation[]) => void;
  updatePlatformSelection: (platforms: string[]) => void;
  consumeCredits: (amount: number) => void;
  connectPlatform: (platform: Platform) => void;
  disconnectPlatform: (platformId: string) => void;
  updateBrandVoice: (brandVoice: BrandVoice) => void;
  setLoading: (key: string, loading: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  trends: [],
  microTrends: [],
  isLoadingTrends: false,
  currentContentPlan: null,
  timingRecommendations: [],
  isGeneratingPlan: false,
  selectedPlatforms: ['instagram', 'tiktok', 'linkedin'],
  dashboardWidgets: ['trends', 'content-plan', 'engagement', 'platforms'],
  creditsRemaining: 100,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  updateTrends: (trends) => set({ trends, isLoadingTrends: false }),
  
  updateMicroTrends: (microTrends) => set({ microTrends }),
  
  setContentPlan: (currentContentPlan) => set({ currentContentPlan, isGeneratingPlan: false }),
  
  setTimingRecommendations: (timingRecommendations) => set({ timingRecommendations }),
  
  updatePlatformSelection: (selectedPlatforms) => set({ selectedPlatforms }),
  
  consumeCredits: (amount) => {
    const { creditsRemaining } = get();
    set({ creditsRemaining: Math.max(0, creditsRemaining - amount) });
  },
  
  connectPlatform: (platform) => {
    const { user } = get();
    if (!user) return;
    
    const updatedPlatforms = [...user.connectedPlatforms];
    const existingIndex = updatedPlatforms.findIndex(p => p.id === platform.id);
    
    if (existingIndex >= 0) {
      updatedPlatforms[existingIndex] = platform;
    } else {
      updatedPlatforms.push(platform);
    }
    
    set({
      user: {
        ...user,
        connectedPlatforms: updatedPlatforms
      }
    });
  },
  
  disconnectPlatform: (platformId) => {
    const { user } = get();
    if (!user) return;
    
    const updatedPlatforms = user.connectedPlatforms.map(p => 
      p.id === platformId ? { ...p, connected: false } : p
    );
    
    set({
      user: {
        ...user,
        connectedPlatforms: updatedPlatforms
      }
    });
  },
  
  updateBrandVoice: (brandVoice) => {
    const { user } = get();
    if (!user) return;
    
    set({
      user: {
        ...user,
        brandVoice
      }
    });
  },
  
  setLoading: (key, loading) => {
    const loadingStates = {
      'trends': { isLoadingTrends: loading },
      'content-plan': { isGeneratingPlan: loading }
    };
    
    const stateUpdate = loadingStates[key];
    if (stateUpdate) {
      set(stateUpdate);
    }
  }
}));

// Selectors for computed values
export const useConnectedPlatforms = () => {
  return useAppStore(state => 
    state.user?.connectedPlatforms.filter(p => p.connected) || []
  );
};

export const usePlatformMetrics = () => {
  return useAppStore(state => {
    const platforms = state.user?.connectedPlatforms || [];
    return platforms.reduce((acc, platform) => {
      acc[platform.name] = platform.metrics;
      return acc;
    }, {} as Record<string, any>);
  });
};

export const useCreditsStatus = () => {
  return useAppStore(state => ({
    remaining: state.creditsRemaining,
    plan: state.user?.subscription.plan || 'free',
    usage: state.user?.subscription.usage || {
      trendsAnalyzed: 0,
      contentGenerated: 0,
      scheduledPosts: 0
    }
  }));
};
