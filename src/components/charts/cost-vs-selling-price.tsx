
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { useDataContext } from "@/context/data-context"

export function CostVsSellingPriceChart() {
  const { stockItems } = useDataContext();

  const chartData = stockItems.map(item => ({
    name: item.name,
    costPrice: item.costPrice,
    sellingPrice: item.sellingPrice,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))'
            }}
        />
        <Legend />
        <Bar dataKey="costPrice" name="Cost Price" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="sellingPrice" name="Selling Price" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
