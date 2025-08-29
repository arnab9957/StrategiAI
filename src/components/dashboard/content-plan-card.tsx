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
import { ArrowRight } from "lucide-react"

interface ContentPlanCardProps {
    contentPlan: string;
}

export function ContentPlanCard({ contentPlan }: ContentPlanCardProps) {
    const dailyPlan = contentPlan.split('\n\n')[0];
    const planItems = dailyPlan.split('\n').slice(1).map((item, index) => {
        const [time, contentPart] = item.replace(/^- /, '').split(': ');
        const [content, platform] = contentPart.split(' on ');
        return {
            id: `${index + 1}`,
            time: time,
            content: content.trim(),
            platform: platform.replace(/\.$/, '').trim(),
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
