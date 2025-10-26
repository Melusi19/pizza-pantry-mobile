import { z } from 'zod';

// Inventory Item Schema
export const inventoryItemSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-&]+$/, 'Name can only contain letters, numbers, spaces, hyphens, and ampersands'),
  
  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),
  
  quantity: z.number()
    .min(0, 'Quantity cannot be negative')
    .max(1000000, 'Quantity is too large'),
  
  minStock: z.number()
    .min(0, 'Minimum stock cannot be negative')
    .max(100000, 'Minimum stock is too large'),
  
  unit: z.string()
    .min(1, 'Unit is required')
    .max(20, 'Unit must be less than 20 characters'),
  
  price: z.number()
    .min(0, 'Price cannot be negative')
    .max(1000000, 'Price is too large')
    .refine(val => val * 100 % 1 === 0, 'Price can only have up to 2 decimal places'),
  
  supplier: z.string()
    .min(1, 'Supplier is required')
    .max(100, 'Supplier must be less than 100 characters'),
}).refine(
  (data) => data.minStock <= data.quantity || data.quantity === 0,
  {
    message: "Minimum stock should not exceed current quantity",
    path: ["minStock"],
  }
);

// Quantity Adjustment Schema
export const quantityAdjustmentSchema = z.object({
  adjustment: z.number()
    .refine(val => val !== 0, 'Adjustment cannot be zero')
    .refine(val => Math.abs(val) <= 100000, 'Adjustment is too large'),
  
  reason: z.string()
    .min(1, 'Reason is required')
    .max(200, 'Reason must be less than 200 characters')
    .regex(/^[a-zA-Z0-9\s\-.,!?]+$/, 'Reason contains invalid characters'),
});

// User Profile Schema
export const userProfileSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'First name contains invalid characters'),
  
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Last name contains invalid characters'),
});

// Search Schema
export const searchSchema = z.object({
  query: z.string().max(100, 'Search query is too long'),
  category: z.string().optional(),
});

// Export types
export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;
export type QuantityAdjustmentData = z.infer<typeof quantityAdjustmentSchema>;
export type UserProfileData = z.infer<typeof userProfileSchema>;
export type SearchData = z.infer<typeof searchSchema>;

// Validation functions
export const validateInventoryItem = (data: unknown): InventoryItemFormData => {
  return inventoryItemSchema.parse(data);
};

export const validateQuantityAdjustment = (data: unknown): QuantityAdjustmentData => {
  return quantityAdjustmentSchema.parse(data);
};

export const validateUserProfile = (data: unknown): UserProfileData => {
  return userProfileSchema.parse(data);
};

// Partial validation for updates
export const partialInventoryItemSchema = inventoryItemSchema.partial();
export type PartialInventoryItemFormData = z.infer<typeof partialInventoryItemSchema>;

export const validatePartialInventoryItem = (data: unknown): PartialInventoryItemFormData => {
  return partialInventoryItemSchema.parse(data);
};