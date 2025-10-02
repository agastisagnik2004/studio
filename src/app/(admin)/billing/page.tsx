import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { customers, stockItems } from "@/lib/data"

export default function BillingPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Create Invoice</CardTitle>
          <CardDescription>
            Generate a new invoice for a customer.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <Select>
              <SelectTrigger id="customer">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="item">Stock Item</Label>
             <Select>
              <SelectTrigger id="item">
                <SelectValue placeholder="Select an item" />
              </SelectTrigger>
              <SelectContent>
                {stockItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" type="number" placeholder="e.g. 1" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="discount">Discount (%)</Label>
            <Input id="discount" type="number" placeholder="e.g. 10" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes for the invoice."
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <p className="text-lg font-bold">Total: ₹0.00</p>
          </div>
          <Button>Generate Invoice</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
