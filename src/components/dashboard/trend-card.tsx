"use client"

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
import { MicroTrendDetectionOutput } from "@/ai/flows/micro-trend-detector"

interface TrendCardProps {
  trendData: MicroTrendDetectionOutput
}

export function TrendCard({ trendData }: TrendCardProps) {

  const trendingTopics = trendData.trendingTopics.map((topic, index) => ({
    topic,
    leadTime: trendData.leadTimes[index],
    explanation: trendData.explanations[index],
    relevance: Math.random() > 0.5 ? "High" : "Medium"
  }));
  
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
                  <Badge variant={trend.relevance === 'High' ? 'default' : 'secondary'} className={trend.relevance === 'High' ? 'bg-accent text-accent-foreground hover:bg-accent/80' : ''}>{trend.relevance}</Badge>
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
