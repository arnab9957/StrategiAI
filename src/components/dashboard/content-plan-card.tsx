"use client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Loader } from "lucide-react"

interface ContentPlanCardProps {
    contentPlan: string;
}

export function ContentPlanCard({ contentPlan }: ContentPlanCardProps) {
    if (!contentPlan) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Today's Content Plan</CardTitle>
                    <CardDescription>Day 1 of your 7-day strategy.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-48">
                    <div className="flex items-center gap-2">
                        <Loader className="animate-spin h-4 w-4" />
                        <span className="text-sm text-muted-foreground">Loading content plan...</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const dailyPlan = contentPlan.split('Day 1:')[1]?.split('Day 2:')[0]?.trim() || '';
    
    if (!dailyPlan) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Today's Content Plan</CardTitle>
            <CardDescription>Day 1 of your 7-day strategy.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Could not parse content plan for today.</p>
          </CardContent>
        </Card>
      )
    }

    const planItems = dailyPlan.split('*').slice(1).map((item, index) => {
        const contentMatch = item.match(/\*\*Idea:\*\* "(.*?)"/);
        const timeMatch = item.match(/\*\*Optimal Time:\*\* (.*?)$/m);
        const platformMatch = item.match(/\((.*?)\s-/);

        return {
            id: `${index + 1}`,
            time: timeMatch ? timeMatch[1].trim() : "N/A",
            content: contentMatch ? contentMatch[1].trim() : "No content idea",
            platform: platformMatch ? platformMatch[1].trim() : 'Social',
            done: Math.random() > 0.5
        };
    }).filter(item => item.content !== "No content idea"); // Filter out invalid items
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Content Plan</CardTitle>
        <CardDescription>Day 1 of your 7-day strategy.</CardDescription>
      </CardHeader>
      <CardContent>
        {planItems.length > 0 ? (
          <ul className="space-y-4">
            {planItems.map((item) => (
              <li key={item.id} className="flex items-start gap-4">
                <Checkbox id={`task-${item.id}`} checked={item.done} className="mt-1" />
                <div className="grid gap-1 flex-1 min-w-0">
                  <label htmlFor={`task-${item.id}`} className="font-medium leading-none cursor-pointer">
                    {item.time} - {item.platform}
                  </label>
                  <p className="text-sm text-muted-foreground">{item.content}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No content items found for today.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
            View Full Content Plan <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
