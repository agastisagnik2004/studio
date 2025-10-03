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
  updateStockItem: (id: string, updatedItem: Partial<Omit<StockItem, 'id'>>) => void;
  removeStockItem: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'joinDate' | 'avatar'>) => Customer;
  updateCustomer: (id: string, updatedCustomer: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  updateSale: (id: string, updatedSale: Partial<Sale>) => void;
  removeSale: (saleId: string, itemId: string, quantity: number) => void;
}

const DataContext = React.createContext<DataContextType | undefined>(undefined);

const safelyParseJSON = (item: string | null) => {
  if (item) {
    try {
      return JSON.parse(item);
    } catch (error) {
      console.error("Failed to parse JSON from localStorage", error);
      return null;
    }
  }
  return null;
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [stockItems, setStockItems] = React.useState<StockItem[]>([]);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [sales, setSales] = React.useState<Sale[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const storedStockItems = safelyParseJSON(localStorage.getItem("stockItems")) || initialStockItems;
    const storedCustomers = safelyParseJSON(localStorage.getItem("customers")) || initialCustomers;
    const storedSales = safelyParseJSON(localStorage.getItem("sales")) || initialSales;
    
    setStockItems(storedStockItems);
    setCustomers(storedCustomers);
    setSales(storedSales);
    setIsLoaded(true);
  }, []);

  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("stockItems", JSON.stringify(stockItems));
    }
  }, [stockItems, isLoaded]);

  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("customers", JSON.stringify(customers));
    }
  }, [customers, isLoaded]);

  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("sales", JSON.stringify(sales));
    }
  }, [sales, isLoaded]);


  const addStockItem = (item: Omit<StockItem, 'id' | 'addedDate'>) => {
    const newStockItem: StockItem = {
      ...item,
      id: `STK${String(stockItems.length + 1).padStart(3, '0')}`,
      addedDate: new Date().toISOString().split('T')[0],
    };
    setStockItems(prev => [...prev, newStockItem]);
    return newStockItem;
  };

  const updateStockItem = (id: string, updatedItem: Partial<Omit<StockItem, 'id'>>) => {
    setStockItems(prev => prev.map(item => (item.id === id ? { ...item, ...updatedItem } : item)));
  };

  const removeStockItem = (id: string) => {
    // Also remove associated sales
    const salesOfItem = sales.filter(sale => sale.itemId === id);
    setSales(prev => prev.filter(sale => sale.itemId !== id));
    setStockItems(prev => prev.filter(item => item.id !== id));
  }

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

  const removeCustomer = (id: string) => {
    // Remove customer and their sales
    setSales(prev => prev.filter(sale => sale.customerId !== id));
    setCustomers(prev => prev.filter(customer => customer.id !== id));
  }

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
    <DataContext.Provider value={{ stockItems, customers, sales, addStockItem, updateStockItem, removeStockItem, addCustomer, updateCustomer, removeCustomer, addSale, updateSale, removeSale }}>
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
