import { ObjectId } from 'mongodb';

export interface InventoryItem {
  _id?: ObjectId;
  id?: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
  price: number;
  supplier: string;
  lastUpdated: Date;
  createdAt: Date;
  userId: string;
}

export interface QuantityAdjustment {
  _id?: ObjectId;
  itemId: ObjectId;
  previousQuantity: number;
  newQuantity: number;
  adjustment: number;
  reason: string;
  userId: string;
  timestamp: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface CreateInventoryItemRequest {
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
  price: number;
  supplier: string;
}

export interface UpdateInventoryItemRequest {
  name?: string;
  category?: string;
  quantity?: number;
  minStock?: number;
  unit?: string;
  price?: number;
  supplier?: string;
}

export interface AdjustQuantityRequest {
  adjustment: number;
  reason: string;
}