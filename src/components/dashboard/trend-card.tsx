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

const trendingTopics = [
  {
    topic: "AI in Film Making",
    leadTime: "2 weeks",
    explanation: "Generative AI tools for video and scriptwriting are becoming more accessible, sparking a wave of creative projects and discussions among indie filmmakers and major studios alike.",
    relevance: "High"
  },
  {
    topic: "Sustainable Fashion Tech",
    leadTime: "1 month",
    explanation: "Innovations in textile recycling and digital passports for clothing are gaining traction. Brands are leveraging this to appeal to eco-conscious consumers.",
    relevance: "Medium"
  },
  {
    topic: "Retro Gaming Revival",
    leadTime: "3 days",
    explanation: "A recent high-profile re-release of a classic console has sparked nostalgia. Influencers are live-streaming retro games, creating viral moments.",
    relevance: "High"
  },
]

export function TrendCard() {
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
