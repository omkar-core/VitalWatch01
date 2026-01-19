"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Vital } from "@/lib/types";

interface VitalsChartProps {
  data: Vital[];
}

export function VitalsChart({ data }: VitalsChartProps) {
  const chartConfig = {
    heartRate: {
      label: "Heart Rate",
      color: "hsl(var(--chart-1))",
    },
    spo2: {
      label: "SPO2",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          yAxisId="left"
          stroke="hsl(var(--chart-1))"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="hsl(var(--chart-2))"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="Heart Rate"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="SPO2"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
