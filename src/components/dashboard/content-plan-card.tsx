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
                    <Loader className="animate-spin" />
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
    });
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Content Plan</CardTitle>
        <CardDescription>Day 1 of your 7-day strategy.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {planItems.map((item) => (
            <li key={item.id} className="flex items-start gap-4">
              <Checkbox id={`task-${item.id}`} checked={item.done} className="mt-1" />
              <div className="grid gap-1">
                <label htmlFor={`task-${item.id}`} className="font-medium leading-none cursor-pointer">
                  {item.time} - {item.platform}
                </label>
                <p className="text-sm text-muted-foreground">{item.content}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
            View Full Content Plan <ArrowRight className="ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}
