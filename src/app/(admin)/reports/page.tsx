
"use client"
import { MonthlySalesChart } from "@/components/charts/monthly-sales-chart"
import { MonthlyItemsChart } from "@/components/charts/monthly-items-chart"
import { CostVsSellingPriceChart } from "@/components/charts/cost-vs-selling-price"
import { CustomerPurchasesChart } from "@/components/charts/customer-purchases-chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ReportsPage() {
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Analyze your sales, stock, and customer data.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
            <CardTitle className="font-headline">Month vs Sales Amount</CardTitle>
            <CardDescription>
                Your total sales revenue for each month of the year.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <MonthlySalesChart />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
            <CardTitle className="font-headline">Month vs Items Sold</CardTitle>
            <CardDescription>
                The total number of items you've sold each month.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <MonthlyItemsChart />
            </CardContent>
        </Card>
      </div>
       <div className="grid gap-4 md:grid-cols-2">
         <Card>
            <CardHeader>
            <CardTitle className="font-headline">Cost vs Selling Price</CardTitle>
            <CardDescription>
                A comparison of cost and selling prices for your items.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <CostVsSellingPriceChart />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
            <CardTitle className="font-headline">Customer vs Purchased Items</CardTitle>
            <CardDescription>
                The number of items purchased by each customer.
            </CardDescription>
            </CardHeader>
            <CardContent>
                <CustomerPurchasesChart />
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
