import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { InventoryItem, InventoryItemFormData, QuantityAdjustmentData } from '../types';
import { inventoryItemSchema, quantityAdjustmentSchema } from '../lib/validation';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

// Enhanced error handling
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }
  return response.json();
};

export const useInventory = () => {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: async (): Promise<InventoryItem[]> => {
      const response = await fetch(`${API_BASE}/inventory`);
      return handleApiError(response);
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, 
  });
};

export const useInventoryItem = (itemId: string) => {
  return useQuery({
    queryKey: ['inventory', itemId],
    queryFn: async (): Promise<InventoryItem & { adjustments?: any[] }> => {
      const response = await fetch(`${API_BASE}/inventory/${itemId}`);
      return handleApiError(response);
    },
    enabled: !!itemId,
    retry: 2,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InventoryItemFormData) => {
      // Client-side validation
      inventoryItemSchema.parse(data);
      
      const response = await fetch(`${API_BASE}/inventory`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return handleApiError(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, data }: { itemId: string; data: Partial<InventoryItemFormData> }) => {
      // Validate only provided fields
      if (data.name) inventoryItemSchema.pick({ name: true }).parse(data);
      if (data.quantity !== undefined) inventoryItemSchema.pick({ quantity: true }).parse(data);
      
      const response = await fetch(`${API_BASE}/inventory/${itemId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return handleApiError(response);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', variables.itemId] });
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`${API_BASE}/inventory/${itemId}`, {
        method: 'DELETE',
      });
      return handleApiError(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
  });
};

export const useAdjustQuantity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, data }: { itemId: string; data: QuantityAdjustmentData }) => {
      quantityAdjustmentSchema.parse(data);
      
      const response = await fetch(`${API_BASE}/inventory/${itemId}/adjust`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return handleApiError(response);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', variables.itemId] });
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
  });
};

export const useInventoryStats = () => {
  const { data: inventory } = useInventory();
  
  return useQuery({
    queryKey: ['inventory-stats'],
    queryFn: () => {
      if (!inventory) return null;
      
      const totalItems = inventory.length;
      const lowStockItems = inventory.filter(item => item.quantity <= item.minStock && item.quantity > 0).length;
      const outOfStockItems = inventory.filter(item => item.quantity === 0).length;
      const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      
      return {
        totalItems,
        lowStockItems,
        outOfStockItems,
        totalValue,
      };
    },
    enabled: !!inventory,
  });
};