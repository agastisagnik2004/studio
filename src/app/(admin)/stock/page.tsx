"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDataContext } from "@/context/data-context"
import * as XLSX from "xlsx"

export default function StockPage() {
  const { stockItems, addStockItem } = useDataContext();

  const [itemName, setItemName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [costPrice, setCostPrice] = React.useState("");
  const [sellingPrice, setSellingPrice] = React.useState("");
  const [supplier, setSupplier] = React.useState("");

  const handleAddItem = () => {
    if(!itemName || !category || !quantity || !costPrice || !sellingPrice || !supplier) {
      alert("Please fill out all fields.");
      return;
    }
    addStockItem({
      name: itemName,
      category,
      quantity: Number(quantity),
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      supplier,
    });
    setItemName("");
    setCategory("");
    setQuantity("");
    setCostPrice("");
    setSellingPrice("");
    setSupplier("");
  };

  const handleExport = () => {
    const dataToExport = stockItems.map(item => ({
      "ID": item.id,
      "Name": item.name,
      "Category": item.category,
      "Quantity": item.quantity,
      "Cost Price": `₹${item.costPrice.toFixed(2)}`,
      "Selling Price": `₹${item.sellingPrice.toFixed(2)}`,
      "Supplier": item.supplier,
      "Added Date": item.addedDate,
      "Cost Value": `₹${(item.quantity * item.costPrice).toFixed(2)}`,
      "Sell Value": `₹${(item.quantity * item.sellingPrice).toFixed(2)}`
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock Report");
    XLSX.writeFile(wb, "stock_report.xlsx");
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Add Stock Item</CardTitle>
            <CardDescription>
              Add a new item to your inventory.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input id="item-name" placeholder="e.g. Wireless Mouse" value={itemName} onChange={(e) => setItemName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="e.g. Electronics" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="e.g. 50" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost-price">Cost Price (₹)</Label>
              <Input id="cost-price" type="number" placeholder="e.g. 18.00" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="selling-price">Selling Price (₹)</Label>
              <Input id="selling-price" type="number" placeholder="e.g. 25.99" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input id="supplier" placeholder="e.g. TechGear Inc." value={supplier} onChange={(e) => setSupplier(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddItem}>Add Item</Button>
          </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Stock</CardTitle>
          <CardDescription>
            Manage your products and view their inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Cost Price</TableHead>
                <TableHead className="text-right">Selling Price</TableHead>
                <TableHead className="text-right">Cost Value</TableHead>
                <TableHead className="text-right">Sell Value</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.quantity < 10 ? (
                      <Badge variant="destructive">{item.quantity}</Badge>
                    ) : (
                      item.quantity
                    )}
                  </TableCell>
                  <TableCell className="text-right">₹{item.costPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">₹{item.sellingPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">₹{(item.quantity * item.costPrice).toFixed(2)}</TableCell>
                  <TableCell className="text-right">₹{(item.quantity * item.sellingPrice).toFixed(2)}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExport}>Download Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
