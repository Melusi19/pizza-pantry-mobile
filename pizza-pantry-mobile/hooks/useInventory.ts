import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InventoryItem, InventoryItemFormData, QuantityAdjustmentData } from '../types';

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
      const response = await fetch(`${API_BASE}/api/inventory`);
      return handleApiError(response);
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useInventoryItem = (itemId: string) => {
  return useQuery({
    queryKey: ['inventory', itemId],
    queryFn: async (): Promise<InventoryItem & { adjustments?: any[] }> => {
      const response = await fetch(`${API_BASE}/api/inventory/${itemId}`);
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
      const response = await fetch(`${API_BASE}/api/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleApiError(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, data }: { itemId: string; data: Partial<InventoryItemFormData> }) => {
      const response = await fetch(`${API_BASE}/api/inventory/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleApiError(response);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', variables.itemId] });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`${API_BASE}/api/inventory/${itemId}`, {
        method: 'DELETE',
      });
      return handleApiError(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

export const useAdjustQuantity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, data }: { itemId: string; data: QuantityAdjustmentData }) => {
      const response = await fetch(`${API_BASE}/api/inventory/${itemId}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleApiError(response);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', variables.itemId] });
    },
  });
};