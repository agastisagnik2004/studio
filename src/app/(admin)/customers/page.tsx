"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { customers as initialCustomers } from "@/lib/data"
import { Customer } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [address, setAddress] = React.useState("")

  const handleAddCustomer = () => {
    const newCustomer: Customer = {
      id: `CUS${String(customers.length + 1).padStart(3, '0')}`,
      name,
      email,
      phone,
      address,
      joinDate: new Date().toISOString().split('T')[0],
      avatar: `https://i.pravatar.cc/40?u=${Math.random()}`
    }
    setCustomers([...customers, newCustomer])
    // Reset form
    setName("")
    setEmail("")
    setPhone("")
    setAddress("")
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Add Customer</CardTitle>
          <CardDescription>
            Add a new customer to your records.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customer-name">Name</Label>
            <Input id="customer-name" placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-email">Email</Label>
            <Input id="customer-email" placeholder="e.g. john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-phone">Phone</Label>
            <Input id="customer-phone" placeholder="e.g. 123-456-7890" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-address">Address</Label>
            <Textarea id="customer-address" placeholder="e.g. 123 Main St, Anytown USA" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddCustomer}>Add Customer</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Customers</CardTitle>
          <CardDescription>
            Manage your customers and view their purchase history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.joinDate}</TableCell>
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
