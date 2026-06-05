"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DispensacaoData } from "@/app/dashboard/page";

interface ChartProps {
    data: DispensacaoData[];
}

export default function ChartOverview({ data }: ChartProps) {
    const chartData = data.reduce<{ date: string; quantidade: number }[]>((acc, current) => {
        const dateStr = new Date(current.data_entrega).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        const existing = acc.find(item => item.date === dateStr);
        const quantidadeTotal = current.itens.reduce((sum, item) => sum + item.quantidade, 0);

        if (existing) {
            existing.quantidade += quantidadeTotal;
        } else {
            acc.push({ date: dateStr, quantidade: quantidadeTotal });
        }
        
        return acc;
    }, []).reverse();

    return (
        <Card className="rounded-xl shadow-sm border-none ring-1 ring-gray-100 bg-white h-full min-h-[400px] flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg text-[#003967]">Unidades Dispensadas por Dia</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                {chartData.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-gray-500">Sem dados suficientes para gerar o gráfico.</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis 
                                dataKey="date" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                stroke="#6b7280"
                            />
                            <YAxis 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                stroke="#6b7280"
                            />
                            <Tooltip 
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar 
                                dataKey="quantidade" 
                                fill="#1976d2" 
                                radius={[4, 4, 0, 0]} 
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}