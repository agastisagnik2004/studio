
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useDataContext } from "@/context/data-context"

export function CustomerPurchasesChart() {
  const { sales, customers } = useDataContext();

  const customerPurchases = customers.map(customer => {
    const totalItems = sales
      .filter(sale => sale.customerId === customer.id)
      .reduce((acc, sale) => acc + sale.quantity, 0);
    return {
      name: customer.name,
      items: totalItems,
    }
  }).filter(c => c.items > 0);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={customerPurchases}>
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
          allowDecimals={false}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))'
            }}
        />
        <Bar dataKey="items" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
