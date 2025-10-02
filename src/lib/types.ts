export type StockItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  addedDate: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  avatar: string;
};

export type Sale = {
  id: string;
  itemId: string;
  itemName: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  quantity: number;
  price: number; // This will be the selling price
  discount: number;
  total: number;
  date: string;
};
