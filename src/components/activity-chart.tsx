"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

interface ActivityChartProps {
  data: { name: string; total: number }[]
}

export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
                dataKey="name" 
                stroke="hsl(var(--foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
            />
            <YAxis 
                stroke="hsl(var(--foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
            />
            <Tooltip
                contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))"
                }}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
        </ResponsiveContainer>
    </div>
  )
}
