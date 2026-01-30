"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  AreaChart,
  Bar,
  BarChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";

interface VitalsChartProps {
  data: any[];
  dataKey1: string;
  label1: string;
  color1: string;
  dataKey2?: string;
  label2?: string;
  color2?: string;
}

export function VitalsChart({ data, dataKey1, label1, color1, dataKey2, label2, color2 }: VitalsChartProps) {
  const chartConfig = {
    [dataKey1]: {
      label: label1,
      color: color1,
    },
    ...(dataKey2 && label2 && color2 && {
      [dataKey2]: {
        label: label2,
        color: color2,
      },
    }),
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
          stroke={color1}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={['dataMin - 10', 'dataMax + 10']}
          />
        {dataKey2 && <YAxis
          yAxisId="right"
          orientation="right"
          stroke={color2}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={['dataMin - 10', 'dataMax + 10']}
        />}
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey={dataKey1}
          stroke={color1}
          strokeWidth={2}
          dot={false}
          name={label1}
        />
        {dataKey2 && <Line
          yAxisId={dataKey2 && "right"}
          type="monotone"
          dataKey={dataKey2}
          stroke={color2}
          strokeWidth={2}
          dot={false}
          name={label2}
        />}
      </LineChart>
    </ChartContainer>
  );
}
