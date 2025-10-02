"use client"

import * as React from "react"
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
import { Customer, StockItem } from "@/lib/types"

import jsPDF from "jspdf"
import "jspdf-autotable"

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export default function BillingPage() {
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string>("");
  const [selectedItemId, setSelectedItemId] = React.useState<string>("");
  const [quantity, setQuantity] = React.useState<number>(1);
  const [discount, setDiscount] = React.useState<number>(0);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const selectedItem = stockItems.find(i => i.id === selectedItemId);

  const calculateTotal = () => {
    if (selectedItem) {
      const subtotal = selectedItem.price * quantity;
      const discountAmount = (subtotal * discount) / 100;
      return subtotal - discountAmount;
    }
    return 0;
  };

  const total = calculateTotal();

  const handleGenerateInvoice = () => {
    if (!selectedCustomer || !selectedItem) {
      alert("Please select a customer and an item.");
      return;
    }

    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.text("Invoice", 20, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #${new Date().getTime()}`, 20, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 35);
    
    doc.text("Bill To:", 20, 50);
    doc.text(selectedCustomer.name, 20, 55);
    doc.text(selectedCustomer.address, 20, 60);
    doc.text(selectedCustomer.email, 20, 65);

    doc.autoTable({
      startY: 80,
      head: [['Item', 'Quantity', 'Price', 'Discount', 'Total']],
      body: [
        [
          selectedItem.name,
          quantity,
          `₹${selectedItem.price.toFixed(2)}`,
          `${discount}%`,
          `₹${total.toFixed(2)}`
        ],
      ],
    });

    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ₹${total.toFixed(2)}`, 14, finalY + 10);

    doc.save(`invoice-${selectedCustomer.id}-${new Date().getTime()}.pdf`);
  };

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
            <Select onValueChange={setSelectedCustomerId}>
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
             <Select onValueChange={setSelectedItemId}>
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
            <Input 
              id="quantity" 
              type="number" 
              placeholder="e.g. 1" 
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="discount">Discount (%)</Label>
            <Input 
              id="discount" 
              type="number" 
              placeholder="e.g. 10" 
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              />
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
            <p className="text-lg font-bold">Total: ₹{total.toFixed(2)}</p>
          </div>
          <Button onClick={handleGenerateInvoice}>Generate Invoice</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
