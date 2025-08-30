"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MicroTrendDetectionOutput } from "@/ai/flows/micro-trend-detector"

interface TrendCardProps {
  trendData: MicroTrendDetectionOutput
}

interface Trend {
  topic: string;
  leadTime: string;
  explanation: string;
  relevance: "High" | "Medium" | null;
}

export function TrendCard({ trendData }: TrendCardProps) {
  const [trendingTopics, setTrendingTopics] = React.useState<Trend[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (trendData?.trendingTopics && trendData.trendingTopics.length > 0) {
      const topicsWithRelevance = trendData.trendingTopics.map((topic, index) => ({
        topic,
        leadTime: trendData.leadTimes?.[index] || "Unknown",
        explanation: trendData.explanations?.[index] || "No explanation available",
        relevance: Math.random() > 0.5 ? "High" : "Medium"
      }));
      setTrendingTopics(topicsWithRelevance);
    }
    setIsLoading(false);
  }, [trendData]);
  

  if (!trendData?.trendingTopics || trendData.trendingTopics.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Trend Discovery</CardTitle>
                <CardDescription>Emerging topics with high potential.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>No trending topics found.</p>
            </CardContent>
        </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trend Discovery</CardTitle>
          <CardDescription>Emerging topics with high potential.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend Discovery</CardTitle>
        <CardDescription>Emerging topics with high potential.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {trendingTopics.map((trend, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>
                <div className="flex flex-wrap items-center gap-2 text-left">
                  <span>{trend.topic}</span>
                  {trend.relevance && <Badge variant={trend.relevance === 'High' ? 'default' : 'secondary'} className={trend.relevance === 'High' ? 'bg-accent text-accent-foreground hover:bg-accent/80' : ''}>{trend.relevance}</Badge>}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-2 text-sm text-muted-foreground">Predicted Lead Time: <strong>{trend.leadTime}</strong></p>
                <p>{trend.explanation}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
