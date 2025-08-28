"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", baseline: 186, strategiai: 80 },
  { month: "February", baseline: 305, strategiai: 200 },
  { month: "March", baseline: 237, strategiai: 120 },
  { month: "April", baseline: 200, strategiai: 190 },
  { month: "May", baseline: 209, strategiai: 280 },
  { month: "June", baseline: 214, strategiai: 320 },
]

const chartConfig = {
  strategiai: {
    label: "StrategiAI",
    color: "hsl(var(--primary))",
  },
  baseline: {
    label: "Baseline",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig

export function EngagementChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Tracking</CardTitle>
        <CardDescription>Baseline vs. StrategiAI Performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="baseline" fill="var(--color-baseline)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="strategiai" fill="var(--color-strategiai)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Engagement is up by 32% this month <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total engagement for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
