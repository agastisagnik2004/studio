import { Overview } from "@/components/overview"
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
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Monthly Sales</CardTitle>
          <CardDescription>
            A graphical representation of your sales performance over the year.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Overview />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Stock Report</CardTitle>
          <CardDescription>
            Overview of available vs. sold items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Stock report content goes here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
