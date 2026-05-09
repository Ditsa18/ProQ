"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getActivity } from "@/lib/api/dashboard"

const chartConfig = {
  value: { label: "Requests", color: "#7dd3e8" },
}

export default function ActivityChart() {
  const [data, setData] = useState<{ time: string; value: number }[]>([])

  useEffect(() => {
    getActivity()
      .then((buckets) => setData(buckets.map((b) => ({ time: b.hour, value: b.count }))))
      .catch(console.error)
  }, [])

  return (
    <Card className="rounded-xl border border-gray-200 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
        <span className="text-[14px] font-semibold text-gray-900">Activity — Last 24 Hours</span>
        <span className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">Activity</span>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <BarChart accessibilityLayer data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="time" tickLine={false} tickMargin={10} axisLine={false} tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
