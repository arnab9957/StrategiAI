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

const todaysPlan = [
  { id: "1", time: "9:00 AM", content: "Post a Reel about the new 'Sustainable Fashion Tech' trend.", platform: "Instagram", done: true },
  { id: "2", time: "12:00 PM", content: "YouTube video premiere: 'AI in Film Making - A Deep Dive'.", platform: "YouTube", done: false },
  { id: "3", time: "5:00 PM", content: "LinkedIn post sharing insights from the YouTube video.", platform: "LinkedIn", done: false },
]

export function ContentPlanCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Content Plan</CardTitle>
        <CardDescription>Day 1 of your 7-day strategy.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {todaysPlan.map((item) => (
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
