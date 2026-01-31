"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface WaveformChartProps {
  data: any[];
  dataKey: string;
  color: string;
  gradientColor: string;
}

export function WaveformChart({ data, dataKey, color, gradientColor }: WaveformChartProps) {
  const chartConfig = {
    [dataKey]: {
      label: "PPG",
      color: color,
    },
  };

  return (
    <ChartContainer 
      config={chartConfig} 
      className="min-h-[100px] w-full"
      aria-label="Chart showing PPG waveform"
      role="img"
    >
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
            <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0}/>
            </linearGradient>
        </defs>
        <YAxis
          stroke={color}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={['dataMin - 100', 'dataMax + 100']}
          />
        <XAxis dataKey="time" hide={true} />
        <Tooltip 
            content={<ChartTooltipContent hideLabel hideIndicator />}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "3 3" }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorWave)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
