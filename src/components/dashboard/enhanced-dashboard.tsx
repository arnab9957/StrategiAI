'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { TrendDiscoveryEngine } from '@/lib/trend-discovery';
import { TimingOptimizer } from '@/lib/timing-optimizer';
import { ContentPlanner } from '@/lib/content-planner';
import { PlatformConnections } from './platform-connections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Calendar, 
  Zap, 
  Target, 
  BarChart3, 
  Sparkles,
  Clock,
  Users,
  Eye,
  RefreshCw
} from 'lucide-react';

export function EnhancedDashboard() {
  const {
    trends,
    microTrends,
    currentContentPlan,
    timingRecommendations,
    selectedPlatforms,
    creditsRemaining,
    isLoadingTrends,
    isGeneratingPlan,
    updateTrends,
    updateMicroTrends,
    setContentPlan,
    setTimingRecommendations,
    consumeCredits,
    setLoading
  } = useAppStore();

  const [trendEngine] = useState(() => new TrendDiscoveryEngine());
  const [timingOptimizer] = useState(() => new TimingOptimizer());
  const [contentPlanner] = useState(() => new ContentPlanner());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Auto-refresh trends every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshTrends();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Initial data load
  useEffect(() => {
    if (trends.length === 0) {
      refreshTrends();
    }
  }, []);

  const refreshTrends = async () => {
    setLoading('trends', true);
    try {
      const [newTrends, newMicroTrends] = await Promise.all([
        trendEngine.discoverTrends(selectedPlatforms),
        trendEngine.detectMicroTrends()
      ]);
      
      updateTrends(newTrends);
      updateMicroTrends(newMicroTrends);
      setLastUpdate(new Date());
      consumeCredits(5);
    } catch (error) {
      console.error('Failed to refresh trends:', error);
    }
  };

  const generateContentPlan = async () => {
    if (!trends.length) return;
    
    setLoading('content-plan', true);
    try {
      // Mock user profile and brand voice
      const mockUserProfile = {
        timezone: 'America/New_York',
        audienceDemographics: {
          ageGroups: { '18-24': 30, '25-34': 40, '35-44': 30 },
          locations: { 'US': 60, 'EU': 25, 'ASIA': 15 },
          interests: ['technology', 'lifestyle', 'business']
        },
        historicalEngagement: selectedPlatforms.map(platform => ({
          platform,
          timeSlots: { '9': 0.8, '12': 0.6, '17': 0.9, '20': 0.7 }
        }))
      };

      const mockBrandVoice = {
        tone: 'professional yet approachable',
        personality: ['innovative', 'trustworthy', 'forward-thinking'],
        values: ['sustainability', 'innovation', 'community'],
        avoidTopics: ['politics', 'controversial'],
        keyMessages: ['empowering creators', 'data-driven insights'],
        targetAudience: 'content creators and social media managers'
      };

      const recommendations = await timingOptimizer.getOptimalTiming(
        selectedPlatforms,
        mockUserProfile
      );
      
      const plan = await contentPlanner.generateWeeklyPlan(
        trends.slice(0, 5),
        recommendations,
        mockBrandVoice,
        selectedPlatforms
      );

      setTimingRecommendations(recommendations);
      setContentPlan(plan);
      consumeCredits(10);
    } catch (error) {
      console.error('Failed to generate content plan:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StrategiAI Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-powered social media intelligence • Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              {creditsRemaining} credits
            </Badge>
            <Button 
              onClick={refreshTrends} 
              disabled={isLoadingTrends}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingTrends ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Trends</p>
                  <p className="text-2xl font-bold">{trends.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Micro Trends</p>
                  <p className="text-2xl font-bold">{microTrends.length}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Content Pieces</p>
                  <p className="text-2xl font-bold">{currentContentPlan?.totalPieces || 0}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Platforms</p>
                  <p className="text-2xl font-bold">{selectedPlatforms.length}</p>
                </div>
                <Users className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Trend Discovery</TabsTrigger>
            <TabsTrigger value="content">Content Planning</TabsTrigger>
            <TabsTrigger value="timing">Optimal Timing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Active Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence>
                    {trends.slice(0, 5).map((trend, index) => (
                      <motion.div
                        key={trend.topic}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{trend.topic}</h4>
                          <Badge variant={trend.score > 80 ? 'default' : 'secondary'}>
                            {trend.score}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {trend.explanation}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span>Lead time: {trend.leadTime}</span>
                          <div className="flex gap-1">
                            {trend.platforms.map(platform => (
                              <Badge key={platform} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Progress value={trend.score} className="mt-2" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Micro Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Micro Trends (Early Detection)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {microTrends.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No micro trends detected in the last 6 hours
                    </p>
                  ) : (
                    microTrends.map((microTrend, index) => (
                      <motion.div
                        key={microTrend.topic}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{microTrend.topic}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="bg-green-500">
                              {Math.round(microTrend.confidence * 100)}%
                            </Badge>
                            <Badge variant="outline">
                              {microTrend.sourceCount} sources
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Detected {new Date(microTrend.detectedAt).toLocaleTimeString()}
                        </p>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">7-Day Content Plan</h2>
              <Button 
                onClick={generateContentPlan}
                disabled={isGeneratingPlan || trends.length === 0}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isGeneratingPlan ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Plan
                  </>
                )}
              </Button>
            </div>

            {currentContentPlan ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Array.from({ length: 7 }, (_, day) => {
                          const dayContent = currentContentPlan.contentPieces.filter(p => p.day === day + 1);
                          return (
                            <div key={day} className="border rounded-lg p-4">
                              <h4 className="font-semibold mb-3">
                                Day {day + 1} - {dayContent.length} pieces
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {dayContent.map((piece, index) => (
                                  <motion.div
                                    key={piece.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-3 bg-muted rounded-md"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <Badge variant="outline">{piece.platform}</Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {piece.scheduledTime}
                                      </span>
                                    </div>
                                    <h5 className="font-medium text-sm mb-1">{piece.title}</h5>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {piece.caption}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {piece.contentType}
                                      </Badge>
                                      <span className="text-xs">
                                        Est. {piece.estimatedEngagement}% engagement
                                      </span>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* Gap Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Content Gaps
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentContentPlan.gapAnalysis.suggestions.map((suggestion, index) => (
                          <div key={index} className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Repurposing Opportunities */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5" />
                        Repurposing Ideas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentContentPlan.repurposingOpportunities.slice(0, 3).map((opportunity, index) => (
                          <div key={index} className="p-3 border rounded">
                            <h5 className="font-medium text-sm mb-2">{opportunity.sourceContent}</h5>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {opportunity.adaptations.slice(0, 2).map((adaptation, i) => (
                                <li key={i}>• {adaptation}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Content Plan Generated</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate a 7-day content plan based on current trends and optimal timing
                  </p>
                  <Button 
                    onClick={generateContentPlan}
                    disabled={trends.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Content Plan
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="timing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Optimal Posting Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                {timingRecommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {timingRecommendations.map((rec, index) => (
                      <motion.div
                        key={rec.platform}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold capitalize">{rec.platform}</h4>
                          <Badge variant={rec.confidence > 0.8 ? 'default' : 'secondary'}>
                            {Math.round(rec.confidence * 100)}% confidence
                          </Badge>
                        </div>
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {rec.optimalTime}
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          Expected engagement: {rec.expectedEngagement}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {rec.reasoning}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Generate a content plan to see optimal posting times
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Performance Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                      <p className="text-muted-foreground">
                        Connect your social media accounts to see detailed performance analytics
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                <PlatformConnections />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
