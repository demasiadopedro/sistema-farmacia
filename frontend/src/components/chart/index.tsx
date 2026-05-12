"use client";

import { Card, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer } from "../ui/chart";
import { type ChartConfig } from "@/components/ui/chart";
import { CartesianGrid, XAxis, Bar, BarChart, Tooltip } from "recharts";

export default function ChartOverview() {

    {/* arrumar os dados depois */}
    const chartData = [
        { month: "Jan", dispensacoes: 120 },
        { month: "Fev", dispensacoes: 150 },
        { month: "Mar", dispensacoes: 180 },
        { month: "Abr", dispensacoes: 210 },
        { month: "Mai", dispensacoes: 170 },
        { month: "Jun", dispensacoes: 250 },
    ]

    const chartConfig = {
        dispensacoes: {
            label: "Dispensações",
            color: "#1976d2", // Azul padrão do tema
        },
    } satisfies ChartConfig

    return (
        <Card className="w-full rounded-xl shadow-sm border-none ring-1 ring-gray-100 bg-white">
            <CardHeader className="pb-2">
                <CardTitle>
                    <h2 className='text-lg sm:text-xl font-bold text-[#003967]'>
                        Dispensações Mensais
                    </h2>
                </CardTitle>
            </CardHeader>

            <ChartContainer config={chartConfig} className="min-h-[250px] w-full mt-4">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="dispensacoes" fill="var(--color-dispensacoes)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
            </ChartContainer>
        </Card>
    )
}