"use client"

import * as React from "react"
import { StockItem, Customer, Sale } from "@/lib/types"
import { 
    stockItems as initialStockItems, 
    customers as initialCustomers, 
    sales as initialSales 
} from "@/lib/data"

interface DataContextType {
  stockItems: StockItem[];
  customers: Customer[];
  sales: Sale[];
  addStockItem: (item: Omit<StockItem, 'id' | 'addedDate'>) => StockItem;
  addCustomer: (customer: Omit<Customer, 'id' | 'joinDate' | 'avatar'>) => Customer;
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
}

const DataContext = React.createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [stockItems, setStockItems] = React.useState<StockItem[]>(initialStockItems);
  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers);
  const [sales, setSales] = React.useState<Sale[]>(initialSales);

  const addStockItem = (item: Omit<StockItem, 'id' | 'addedDate'>) => {
    const newStockItem: StockItem = {
      ...item,
      id: `STK${String(stockItems.length + 1).padStart(3, '0')}`,
      addedDate: new Date().toISOString().split('T')[0],
    };
    setStockItems(prev => [...prev, newStockItem]);
    return newStockItem;
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'joinDate' | 'avatar'>) => {
    const newCustomer: Customer = {
        ...customer,
        id: `CUS${String(customers.length + 1).padStart(3, '0')}`,
        joinDate: new Date().toISOString().split('T')[0],
        avatar: `https://i.pravatar.cc/40?u=${Math.random()}`
    };
    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer;
  };

  const addSale = (sale: Omit<Sale, 'id'| 'date'>) => {
    const newSale: Sale = {
        ...sale,
        id: `SALE${String(sales.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString()
    };
    setSales(prev => [newSale, ...prev]);

    //
    // Deduct stock
    //
    setStockItems(prev => prev.map(item => 
        item.id === sale.itemId 
        ? { ...item, quantity: item.quantity - sale.quantity }
        : item
    ));
  };


  return (
    <DataContext.Provider value={{ stockItems, customers, sales, addStockItem, addCustomer, addSale }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  const context = React.useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
}
