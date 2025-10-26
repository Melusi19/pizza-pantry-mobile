import { Category, Unit } from '../constants/categories';

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
  categories: {
    [key: string]: number;
  };
}

export interface InventoryFilters {
  category?: string;
  lowStockOnly?: boolean;
  outOfStockOnly?: boolean;
  searchQuery?: string;
}

export interface InventorySearchResult {
  items: InventoryItem[];
  totalCount: number;
  hasMore: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form Data Types (these will be inferred from Zod schemas in lib/validation)
export type { 
  InventoryItemFormData, 
  QuantityAdjustmentData 
} from '../lib/validation';