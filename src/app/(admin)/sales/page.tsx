
"use client"

import * as React from "react"
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { useDataContext } from "@/context/data-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import * as XLSX from "xlsx"

export default function SalesPage() {
  const { sales, removeSale } = useDataContext();
  const router = useRouter();

  const handleViewInvoice = (saleId: string) => {
    router.push(`/sales/${saleId}`);
  }

  const handleExport = () => {
    const dataToExport = sales.map(sale => ({
      "ID": sale.id,
      "Customer": sale.customerName,
      "Item": sale.itemName,
      "Quantity": sale.quantity,
      "Price": `₹${sale.price.toFixed(2)}`,
      "Discount": `${sale.discount}%`,
      "Total": `₹${sale.total.toFixed(2)}`,
      "Date": new Date(sale.date).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
    XLSX.writeFile(wb, "sales_report.xlsx");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Sales</CardTitle>
        <CardDescription>
          Manage your sales and view transaction details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">
                  {sale.customerName}
                </TableCell>
                <TableCell>{sale.itemName}</TableCell>
                <TableCell>₹{sale.total.toFixed(2)}</TableCell>
                <TableCell>
                  {new Date(sale.date).toLocaleDateString()}
                </TableCell>
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
                      <DropdownMenuItem onClick={() => handleViewInvoice(sale.id)}>
                        View Invoice
                      </DropdownMenuItem>
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" className="w-full justify-start font-normal text-sm text-destructive hover:text-destructive p-2 h-auto">
                            Cancel/Refund
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will permanently delete the sale and refund the transaction. The stock will be returned to inventory.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeSale(sale.id, sale.itemId, sale.quantity)} className="bg-destructive hover:bg-destructive/90">
                              Confirm Refund
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
  )
}
