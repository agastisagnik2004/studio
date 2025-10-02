"use client"

import * as React from "react"
import { Plus, Trash } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDataContext } from "@/context/data-context"
import { Customer, StockItem } from "@/lib/types"

import jsPDF from "jspdf"
import "jspdf-autotable"

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface InvoiceItem {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

export default function BillingPage() {
  const { customers, stockItems, addSale, addCustomer } = useDataContext();
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string>("");
  
  const [invoiceItems, setInvoiceItems] = React.useState<InvoiceItem[]>([]);
  const [selectedItemId, setSelectedItemId] = React.useState<string>("");
  const [quantity, setQuantity] = React.useState<number>(1);
  const [discount, setDiscount] = React.useState<number>(0);

  const [newCustomerName, setNewCustomerName] = React.useState("");
  const [newCustomerEmail, setNewCustomerEmail] = React.useState("");
  const [newCustomerPhone, setNewCustomerPhone] = React.useState("");
  const [newCustomerAddress, setNewCustomerAddress] = React.useState("");
  const [isAddCustomerOpen, setIsAddCustomerOpen] = React.useState(false);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const selectedItem = stockItems.find(i => i.id === selectedItemId);

  const handleAddItem = () => {
    if (selectedItem) {
      const subtotal = selectedItem.price * quantity;
      const discountAmount = (subtotal * discount) / 100;
      const total = subtotal - discountAmount;
      
      const newItem: InvoiceItem = {
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        quantity,
        price: selectedItem.price,
        discount,
        total,
      }
      setInvoiceItems(prev => [...prev, newItem]);
      
      // Reset fields
      setSelectedItemId("");
      setQuantity(1);
      setDiscount(0);
    }
  }

  const handleRemoveItem = (index: number) => {
    setInvoiceItems(prev => prev.filter((_, i) => i !== index));
  }

  const calculateGrandTotal = () => {
    return invoiceItems.reduce((acc, item) => acc + item.total, 0);
  };

  const grandTotal = calculateGrandTotal();

  const handleGenerateInvoice = () => {
    if (!selectedCustomer || invoiceItems.length === 0) {
      alert("Please select a customer and add at least one item.");
      return;
    }

    invoiceItems.forEach(item => {
        addSale({
          itemId: item.itemId,
          itemName: item.itemName,
          customerId: selectedCustomer.id,
          customerName: selectedCustomer.name,
          customerAvatar: selectedCustomer.avatar,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          total: item.total,
        })
    });


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
      body: invoiceItems.map(item => [
        item.itemName,
        item.quantity,
        `₹${item.price.toFixed(2)}`,
        `${item.discount}%`,
        `₹${item.total.toFixed(2)}`
      ]),
    });

    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ₹${grandTotal.toFixed(2)}`, 14, finalY + 10);

    doc.save(`invoice-${selectedCustomer.id}-${new Date().getTime()}.pdf`);
    setInvoiceItems([]);
    setSelectedCustomerId("");
  };

  const handleAddCustomer = () => {
    if(!newCustomerName || !newCustomerEmail) {
        alert("Please enter name and email.");
        return;
    }
    const newCustomer: Omit<Customer, 'id' | 'joinDate' | 'avatar'> = {
      name: newCustomerName,
      email: newCustomerEmail,
      phone: newCustomerPhone,
      address: newCustomerAddress,
    }
    const addedCustomer = addCustomer(newCustomer);
    setSelectedCustomerId(addedCustomer.id);
    
    // Reset form and close dialog
    setNewCustomerName("");
    setNewCustomerEmail("");
    setNewCustomerPhone("");
    setNewCustomerAddress("");
    setIsAddCustomerOpen(false);
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Create Invoice</CardTitle>
          <CardDescription>
            Generate a new invoice for a customer.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
           <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="customer">Customer</Label>
              <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" size="sm" className="p-0 h-auto">Add New</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-customer-name" className="text-right">Name</Label>
                      <Input id="new-customer-name" value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-customer-email" className="text-right">Email</Label>
                      <Input id="new-customer-email" value={newCustomerEmail} onChange={(e) => setNewCustomerEmail(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-customer-phone" className="text-right">Phone</Label>
                      <Input id="new-customer-phone" value={newCustomerPhone} onChange={(e) => setNewCustomerPhone(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-customer-address" className="text-right">Address</Label>
                      <Textarea id="new-customer-address" value={newCustomerAddress} onChange={(e) => setNewCustomerAddress(e.target.value)} className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddCustomer}>Add Customer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
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

          <div className="border rounded-lg p-4 grid gap-4">
            <h3 className="font-semibold">Invoice Items</h3>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 items-end">
                <div className="space-y-2 md:col-span-2 lg:col-span-2">
                  <Label htmlFor="item">Stock Item</Label>
                   <Select value={selectedItemId} onValueChange={setSelectedItemId}>
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
                    min="1"
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
                    min="0"
                    />
                </div>
                <Button onClick={handleAddItem} disabled={!selectedItemId}>
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>
             {invoiceItems.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead><span className="sr-only">Remove</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceItems.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{item.discount}%</TableCell>
                            <TableCell className="text-right">₹{item.total.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
             )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes for the invoice."
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div>
            <p className="text-lg font-bold">Grand Total: ₹{grandTotal.toFixed(2)}</p>
          </div>
          <Button onClick={handleGenerateInvoice} disabled={invoiceItems.length === 0 || !selectedCustomerId}>Generate Invoice</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

    