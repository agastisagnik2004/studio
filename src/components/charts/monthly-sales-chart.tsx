
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useDataContext } from "@/context/data-context"

export function MonthlySalesChart() {
  const { sales } = useDataContext()

  const monthlySales: { [key: string]: number } = {
    Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
  };

  sales.forEach(sale => {
    const month = new Date(sale.date).toLocaleString('default', { month: 'short' });
    if (monthlySales.hasOwnProperty(month)) {
      monthlySales[month] += sale.total;
    }
  });

  const data = Object.keys(monthlySales).map(month => ({
    name: month,
    total: monthlySales[month],
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
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip 
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))'
            }}
            formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Sales']}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
