
"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useDataContext } from "@/context/data-context"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const { sales, customers } = useDataContext()
  const router = useRouter()

  const sale = sales.find(s => s.id === id)
  const customer = sale ? customers.find(c => c.id === sale.customerId) : null

  if (!sale || !customer) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Invoice not found.</p>
      </div>
    )
  }

  const subtotal = sale.price * sale.quantity;
  const discountAmount = subtotal * (sale.discount / 100);
  const total = subtotal - discountAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Invoice Details</CardTitle>
        <CardDescription>
          Viewing invoice #{sale.id} for {sale.customerName}.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-4">
            <div>
                <h3 className="font-semibold">Bill To:</h3>
                <p>{customer.name}</p>
                <p>{customer.address}</p>
                <p>{customer.email}</p>
            </div>
             <div className="text-right">
                <p><strong>Invoice ID:</strong> {sale.id}</p>
                <p><strong>Date:</strong> {new Date(sale.date).toLocaleDateString()}</p>
            </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Discount</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{sale.itemName}</TableCell>
              <TableCell className="text-right">{sale.quantity}</TableCell>
              <TableCell className="text-right">₹{sale.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">{sale.discount}%</TableCell>
              <TableCell className="text-right">₹{sale.total.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="flex justify-end">
            <div className="w-full md:w-1/3 text-right space-y-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount ({sale.discount}%):</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between font-bold text-lg">
                    <span>Grand Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={() => router.back()}>Back to Sales</Button>
      </CardFooter>
    </Card>
  )
}
