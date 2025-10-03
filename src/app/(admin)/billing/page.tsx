
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
import { Customer } from "@/lib/types"

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
  taxableValue: number;
  cgst: number;
  sgst: number;
  total: number;
}

const GST_RATE = 18; // 18% total GST

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
  const [grandTotalDiscount, setGrandTotalDiscount] = React.useState<number>(0);
  const [notes, setNotes] = React.useState<string>("");

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const selectedItem = stockItems.find(i => i.id === selectedItemId);

  const handleAddItem = () => {
    if (selectedItem) {
       if (quantity > selectedItem.quantity) {
        alert("Insufficient Stock, modify Sales");
        return;
      }
      const subtotal = selectedItem.sellingPrice * quantity;
      const discountAmount = (subtotal * discount) / 100;
      const taxableValue = subtotal - discountAmount;

      const cgstRate = GST_RATE / 2;
      const sgstRate = GST_RATE / 2;
      const cgstAmount = (taxableValue * cgstRate) / 100;
      const sgstAmount = (taxableValue * sgstRate) / 100;
      const total = taxableValue + cgstAmount + sgstAmount;
      
      const newItem: InvoiceItem = {
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        quantity,
        price: selectedItem.sellingPrice,
        discount,
        taxableValue,
        cgst: cgstAmount,
        sgst: sgstAmount,
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

  const calculateSubtotal = () => {
    return invoiceItems.reduce((acc, item) => acc + item.taxableValue, 0);
  };
  const calculateTotalCGST = () => {
      return invoiceItems.reduce((acc, item) => acc + item.cgst, 0);
  }
   const calculateTotalSGST = () => {
      return invoiceItems.reduce((acc, item) => acc + item.sgst, 0);
  }
  
  const subtotal = calculateSubtotal();
  const totalCGST = calculateTotalCGST();
  const totalSGST = calculateTotalSGST();

  const grandTotalDiscountAmount = (subtotal * grandTotalDiscount) / 100;
  const grandTotal = subtotal + totalCGST + totalSGST - grandTotalDiscountAmount;

  const handleGenerateInvoice = () => {
    if (!selectedCustomer || invoiceItems.length === 0) {
      alert("Please select a customer and add at least one item.");
      return;
    }

    // Check for sufficient stock
    for (const item of invoiceItems) {
      const stockItem = stockItems.find(si => si.id === item.itemId);
      if (!stockItem || stockItem.quantity < item.quantity) {
        alert(`Insufficient Stock for ${item.itemName}, modify Sales.`);
        return;
      }
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
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    // Header
    doc.setFillColor(244, 244, 244); // Light Gray
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("INVOICE", pageWidth - margin, 20, { align: 'right' });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("BERA BASTRALAYA", margin, 12);
    doc.text("Nandigram Bazar, Purba Medinipur, West Bengal", margin, 17);
    doc.text("PIN: 721631", margin, 22);

    // Billing Info
    const billToY = 45;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("Bill To:", margin, billToY);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(selectedCustomer.name, margin, billToY + 5);
    doc.text(selectedCustomer.address, margin, billToY + 10);
    doc.text(selectedCustomer.email, margin, billToY + 15);
    doc.text(selectedCustomer.phone, margin, billToY + 20);

    const invoiceDetailsY = 45;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("Invoice No: ", pageWidth - margin - 40, invoiceDetailsY, { align: 'left'});
    doc.text("Date: ", pageWidth - margin - 40, invoiceDetailsY + 5, { align: 'left'});

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    const invoiceId = `#${new Date().getTime()}`;
    doc.text(invoiceId, pageWidth - margin - 15, invoiceDetailsY, { align: 'left'});
    doc.text(new Date().toLocaleDateString(), pageWidth - margin - 15, invoiceDetailsY + 5, { align: 'left'});
    
    // Items Table
    doc.autoTable({
      startY: billToY + 30,
      head: [['Item Description', 'Qty', 'Price', 'Discount', 'Taxable Value', 'CGST', 'SGST', 'Total']],
      body: invoiceItems.map(item => [
        item.itemName,
        item.quantity,
        `₹${item.price.toFixed(2)}`,
        `${item.discount}%`,
        `₹${item.taxableValue.toFixed(2)}`,
        `₹${item.cgst.toFixed(2)}`,
        `₹${item.sgst.toFixed(2)}`,
        `₹${item.total.toFixed(2)}`
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [50, 50, 50],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' },
        7: { halign: 'right' },
      }
    });

    let finalY = (doc as any).lastAutoTable.finalY + 10;
    
    // Totals Section
    const totalsX = pageWidth - margin - 60;
    const valueX = pageWidth - margin;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);

    doc.text("Subtotal:", totalsX, finalY, { align: 'right' });
    doc.text(`₹${subtotal.toFixed(2)}`, valueX, finalY, { align: 'right' });
    finalY += 7;

    doc.text(`CGST (${(GST_RATE / 2).toFixed(1)}%):`, totalsX, finalY, { align: 'right' });
    doc.text(`+ ₹${totalCGST.toFixed(2)}`, valueX, finalY, { align: 'right' });
    finalY += 7;

    doc.text(`SGST (${(GST_RATE / 2).toFixed(1)}%):`, totalsX, finalY, { align: 'right' });
    doc.text(`+ ₹${totalSGST.toFixed(2)}`, valueX, finalY, { align: 'right' });
    finalY += 7;

    if (grandTotalDiscount > 0) {
      doc.text(`Discount (${grandTotalDiscount}%):`, totalsX, finalY, { align: 'right' });
      doc.text(`- ₹${grandTotalDiscountAmount.toFixed(2)}`, valueX, finalY, { align: 'right' });
      finalY += 7;
    }

    doc.setDrawColor(50,50,50);
    doc.line(totalsX - 10, finalY - 3, valueX, finalY - 3);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text("Grand Total:", totalsX, finalY + 3, { align: 'right' });
    doc.text(`₹${grandTotal.toFixed(2)}`, valueX, finalY + 3, { align: 'right' });
    
    // Notes and Footer
    let notesY = pageHeight - 50;
    if (notes) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("Notes:", margin, notesY - 5);
      const splitNotes = doc.splitTextToSize(notes, pageWidth - margin * 2 - 20);
      doc.text(splitNotes, margin, notesY);
      notesY += (splitNotes.length * 5) + 5; // Adjust Y for footer
    }
    
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("THANK YOU. VISIT AGAIN", pageWidth / 2, pageHeight - 20, { align: 'center' });


    doc.save(`invoice-${selectedCustomer.id}-${new Date().getTime()}.pdf`);
    setInvoiceItems([]);
    setSelectedCustomerId("");
    setGrandTotalDiscount(0);
    setNotes("");
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
            Generate a new invoice for a customer with GST.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
           <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="customer">Customer</Label>
               <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setIsAddCustomerOpen(true)}>Add New</Button>
              <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
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
                  <Label htmlFor="discount">Item Discount (%)</Label>
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
                      <TableHead className="text-right">CGST</TableHead>
                      <TableHead className="text-right">SGST</TableHead>
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
                            <TableCell className="text-right">₹{item.cgst.toFixed(2)}</TableCell>
                            <TableCell className="text-right">₹{item.sgst.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-medium">₹{item.total.toFixed(2)}</TableCell>
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
           {invoiceItems.length > 0 && (
            <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                    id="notes"
                    placeholder="Add any notes for the invoice."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="grand-total-discount">Grand Total Discount (%)</Label>
                        <Input 
                            id="grand-total-discount" 
                            type="number" 
                            placeholder="e.g. 5" 
                            value={grandTotalDiscount}
                            onChange={(e) => setGrandTotalDiscount(Number(e.target.value) || 0)}
                            min="0"
                        />
                    </div>
                     <div className="text-right space-y-1">
                        <p className="text-muted-foreground">Subtotal: ₹{subtotal.toFixed(2)}</p>
                        <p className="text-muted-foreground">CGST ({(GST_RATE / 2).toFixed(1)}%): +₹{totalCGST.toFixed(2)}</p>
                        <p className="text-muted-foreground">SGST ({(GST_RATE / 2).toFixed(1)}%): +₹{totalSGST.toFixed(2)}</p>
                        <p className="text-muted-foreground">Discount: -₹{grandTotalDiscountAmount.toFixed(2)}</p>
                        <p className="text-xl font-bold">Grand Total: ₹{grandTotal.toFixed(2)}</p>
                    </div>
                </div>
            </div>
           )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleGenerateInvoice} disabled={invoiceItems.length === 0 || !selectedCustomerId}>Generate Invoice</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

    