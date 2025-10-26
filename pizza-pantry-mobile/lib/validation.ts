import { z } from 'zod';

export const inventoryItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  minStock: z.number().min(0, 'Minimum stock cannot be negative'),
  unit: z.string().min(1, 'Unit is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  supplier: z.string().min(1, 'Supplier is required'),
});

export const quantityAdjustmentSchema = z.object({
  adjustment: z.number().refine(val => val !== 0, 'Adjustment cannot be zero'),
  reason: z.string().min(1, 'Reason is required').max(200),
});

export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;
export type QuantityAdjustmentData = z.infer<typeof quantityAdjustmentSchema>;