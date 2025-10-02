import { StockItem, Customer, Sale } from './types';

export const stockItems: StockItem[] = [
  { id: 'STK001', name: 'Wireless Mouse', category: 'Electronics', quantity: 45, price: 25.99, supplier: 'TechGear Inc.', addedDate: '2023-10-01' },
  { id: 'STK002', name: 'Mechanical Keyboard', category: 'Electronics', quantity: 20, price: 120.00, supplier: 'GamerZChoice', addedDate: '2023-10-05' },
  { id: 'STK003', name: 'Organic Coffee Beans', category: 'Groceries', quantity: 150, price: 18.50, supplier: 'PureBean Co.', addedDate: '2023-10-02' },
  { id: 'STK004', name: 'Yoga Mat', category: 'Sports', quantity: 8, price: 30.00, supplier: 'FitLife', addedDate: '2023-09-28' },
  { id: 'STK005', name: 'The Art of Programming', category: 'Books', quantity: 30, price: 45.00, supplier: 'Knowledge Pubs', addedDate: '2023-10-10' },
  { id: 'STK006', name: 'LED Desk Lamp', category: 'Home Goods', quantity: 60, price: 15.75, supplier: 'BrightHome', addedDate: '2023-10-11' },
  { id: 'STK007', name: 'Bluetooth Speaker', category: 'Electronics', quantity: 2, price: 79.99, supplier: 'SoundWave', addedDate: '2023-10-12' },
];

export const customers: Customer[] = [
  { id: 'CUS001', name: 'KOUSIK AGASTI', email: 'kousik.a@example.com', phone: '123-456-7890', address: '123 Maple St, Springfield', joinDate: '2023-01-15', avatar: '/avatars/01.png' },
  { id: 'CUS002', name: 'SAGNIK AGASTI', email: 'sagnik.a@example.com', phone: '234-567-8901', address: '456 Oak Ave, Metropolis', joinDate: '2023-02-20', avatar: '/avatars/02.png' },
  { id: 'CUS003', name: 'GOURANGA PRADHAN', email: 'gouranga.p@example.com', phone: '345-678-9012', address: '789 Pine Ln, Gotham', joinDate: '2023-03-10', avatar: '/avatars/03.png' },
  { id: 'CUS004', name: 'KINGSHUK AGASTI', email: 'kingshuk.a@example.com', phone: '456-789-0123', address: '101 Amazon Cir, Themyscira', joinDate: '2023-04-05', avatar: '/avatars/04.png' },
  { id: 'CUS005', name: 'HARI MAHATO', email: 'hari.m@example.com', phone: '567-890-1234', address: '221B Baker St, London', joinDate: '2023-05-12', avatar: '/avatars/05.png' },
];

export const sales: Sale[] = [
  { id: 'SALE001', itemId: 'STK001', itemName: 'Wireless Mouse', customerId: 'CUS001', customerName: 'KOUSIK AGASTI', customerAvatar: 'https://i.pravatar.cc/40?u=a042581f4e29026024d', quantity: 2, price: 25.99, discount: 0, total: 51.98, date: '2023-10-15T10:30:00Z' },
  { id: 'SALE002', itemId: 'STK003', itemName: 'Organic Coffee Beans', customerId: 'CUS002', customerName: 'SAGNIK AGASTI', customerAvatar: 'https://i.pravatar.cc/40?u=a042581f4e29026704d', quantity: 1, price: 18.50, discount: 0, total: 18.50, date: '2023-10-15T11:00:00Z' },
  { id: 'SALE003', itemId: 'STK002', itemName: 'Mechanical Keyboard', customerId: 'CUS003', customerName: 'GOURANGA PRADHAN', customerAvatar: 'https://i.pravatar.cc/40?u=a04258114e29026702d', quantity: 1, price: 120.00, discount: 10, total: 110.00, date: '2023-10-14T14:20:00Z' },
  { id: 'SALE004', itemId: 'STK004', itemName: 'Yoga Mat', customerId: 'CUS001', customerName: 'KOUSIK AGASTI', customerAvatar: 'https://i.pravatar.cc/40?u=a042581f4e29026024d', quantity: 1, price: 30.00, discount: 0, total: 30.00, date: '2023-10-14T16:45:00Z' },
  { id: 'SALE005', itemId: 'STK005', itemName: 'The Art of Programming', customerId: 'CUS004', customerName: 'KINGSHUK AGASTI', customerAvatar: 'https://i.pravatar.cc/40?u=a042581f4e29026708c', quantity: 1, price: 45.00, discount: 5, total: 40.00, date: '2023-10-13T09:05:00Z' },
];
