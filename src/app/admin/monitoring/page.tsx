import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, ScatterChart } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Server, Database, MessageCircle, AlertTriangle } from "lucide-react";

export default function AdminMonitoringPage() {
    const gridDbData = [
        { name: '10:00', latency: 12, throughput: 342 },
        { name: '10:05', latency: 15, throughput: 350 },
        { name: '10:10', latency: 10, throughput: 330 },
        { name: '10:15', latency: 18, throughput: 360 },
        { name: '10:20', latency: 11, throughput: 345 },
    ];
     const azureData = [
        { name: '10:00', messages: 1200, errors: 5 },
        { name: '10:05', messages: 1250, errors: 2 },
        { name: '10:10', messages: 1180, errors: 8 },
        { name: '10:15', messages: 1300, errors: 3 },
        { name: '10:20', messages: 1220, errors: 1 },
    ];
    const apiData = [
        { name: '10:00', responseTime: 45, errors: 1 },
        { name: '10:05', responseTime: 55, errors: 0 },
        { name: '10:10', responseTime: 40, errors: 2 },
        { name: '10:15', responseTime: 60, errors: 0 },
        { name: '10:20', responseTime: 48, errors: 1 },
    ];
     const alertData = [
        { name: '10:00', deliveryTime: 13, failed: 0 },
        { name: '10:05', deliveryTime: 15, failed: 1 },
        { name: '10:10', deliveryTime: 12, failed: 0 },
        { name: '10:15', deliveryTime: 18, failed: 0 },
        { name: '10:20', deliveryTime: 14, failed: 0 },
    ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">System Monitoring</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Database className="h-6 w-6"/>
                    <CardTitle>GridDB Performance</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="min-h-[200px] w-full">
                    <LineChart data={gridDbData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Throughput (msg/s)', angle: 90, position: 'insideRight' }}/>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="latency" stroke="hsl(var(--chart-1))" name="Query Latency (ms)" />
                        <Line yAxisId="right" type="monotone" dataKey="throughput" stroke="hsl(var(--chart-2))" name="Write Throughput (msg/s)" />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Server className="h-6 w-6"/>
                    <CardTitle>Azure IoT Hub</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="min-h-[200px] w-full">
                    <LineChart data={azureData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" label={{ value: 'Messages', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Errors', angle: 90, position: 'insideRight' }}/>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="messages" stroke="hsl(var(--chart-1))" name="Message Throughput" />
                        <Line yAxisId="right" type="monotone" dataKey="errors" stroke="hsl(var(--chart-5))" name="Error Rate" />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <MessageCircle className="h-6 w-6"/>
                    <CardTitle>API Performance</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="min-h-[200px] w-full">
                    <BarChart data={apiData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="responseTime" fill="hsl(var(--chart-3))" name="Response Time (ms)" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6"/>
                    <CardTitle>Alert System</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="min-h-[200px] w-full">
                    <LineChart data={alertData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="deliveryTime" stroke="hsl(var(--chart-4))" name="Delivery Time (s)" />
                        <Line type="step" dataKey="failed" stroke="hsl(var(--chart-5))" name="Failed Alerts" />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
