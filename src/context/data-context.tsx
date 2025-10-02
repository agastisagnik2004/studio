
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
  updateStockItem: (id: string, updatedItem: Partial<StockItem>) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'joinDate' | 'avatar'>) => Customer;
  updateCustomer: (id: string, updatedCustomer: Partial<Customer>) => void;
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  updateSale: (id: string, updatedSale: Partial<Sale>) => void;
  removeSale: (saleId: string, itemId: string, quantity: number) => void;
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

  const updateStockItem = (id: string, updatedItem: Partial<StockItem>) => {
    setStockItems(prev => prev.map(item => (item.id === id ? { ...item, ...updatedItem } : item)));
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

  const updateCustomer = (id: string, updatedCustomer: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => (customer.id === id ? { ...customer, ...updatedCustomer } : customer)));
  };

  const addSale = (sale: Omit<Sale, 'id'| 'date'>) => {
    const newSale: Sale = {
        ...sale,
        id: `SALE${String(sales.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString()
    };
    setSales(prev => [newSale, ...prev]);

    setStockItems(prev => prev.map(item => 
        item.id === sale.itemId 
        ? { ...item, quantity: item.quantity - sale.quantity }
        : item
    ));
  };
  
  const updateSale = (id: string, updatedSale: Partial<Sale>) => {
    const originalSale = sales.find(s => s.id === id);
    if (!originalSale) return;

    const finalUpdatedSale = { ...originalSale, ...updatedSale };

    // Use current values if not provided in updatedSale
    const quantityDifference = originalSale.quantity - (finalUpdatedSale.quantity);
    const itemPrice = stockItems.find(i => i.id === finalUpdatedSale.itemId)?.sellingPrice || originalSale.price;


    setSales(prev => prev.map(s => (s.id === id ? { ...s, ...finalUpdatedSale, price: itemPrice, total: (itemPrice * finalUpdatedSale.quantity) * (1 - (finalUpdatedSale.discount || 0) / 100) } : s)));
    
    // Adjust stock
    if (updatedSale.itemId && originalSale.itemId !== updatedSale.itemId) {
      // Item has changed, so we need to adjust stock for both old and new items
      setStockItems(prev => prev.map(item => {
        if (item.id === originalSale.itemId) {
          return { ...item, quantity: item.quantity + originalSale.quantity }; // Return stock to old item
        }
        if (item.id === updatedSale.itemId) {
          return { ...item, quantity: item.quantity - finalUpdatedSale.quantity }; // Decrease stock for new item
        }
        return item;
      }));
    } else {
      // Item has not changed, just adjust quantity
       setStockItems(prev => prev.map(item => 
        item.id === finalUpdatedSale.itemId
        ? { ...item, quantity: item.quantity + quantityDifference }
        : item
      ));
    }
  };

  const removeSale = (saleId: string, itemId: string, quantity: number) => {
    // Remove the sale
    setSales(prev => prev.filter(s => s.id !== saleId));
    // Add stock back
    setStockItems(prev => prev.map(item =>
      item.id === itemId
      ? { ...item, quantity: item.quantity + quantity }
      : item
    ));
  };

  return (
    <DataContext.Provider value={{ stockItems, customers, sales, addStockItem, updateStockItem, addCustomer, updateCustomer, addSale, updateSale, removeSale }}>
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
