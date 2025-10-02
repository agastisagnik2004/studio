
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useDataContext } from "@/context/data-context"

export function MonthlyItemsChart() {
  const { sales } = useDataContext()

  const monthlyItems: { [key: string]: number } = {
    Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
  };

  sales.forEach(sale => {
    const month = new Date(sale.date).toLocaleString('default', { month: 'short' });
    if (monthlyItems.hasOwnProperty(month)) {
      monthlyItems[month] += sale.quantity;
    }
  });

  const data = Object.keys(monthlyItems).map(month => ({
    name: month,
    items: monthlyItems[month],
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))'
            }}
            formatter={(value: number) => [value, 'Items Sold']}
        />
        <Bar dataKey="items" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
