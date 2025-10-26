import { Category, Unit } from '@constants/categories';

export interface InventoryItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  minStock: number;
  unit: Unit;
  price: number;
  supplier: string;
  lastUpdated: Date;
  createdAt: Date;
  userId: string;
}

export interface QuantityAdjustment {
  id: string;
  itemId: string;
  previousQuantity: number;
  newQuantity: number;
  adjustment: number;
  reason: string;
  userId: string;
  timestamp: Date;
}

export interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
}