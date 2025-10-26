import { Alert } from 'react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

if (!API_BASE) {
  console.warn('EXPO_PUBLIC_API_URL is not set. API calls will fail.');
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseUrl = API_BASE || 'http://localhost:3000/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP Error: ${response.status} ${response.statusText}`,
      }));
      
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        // You might want to show user-friendly messages here
        console.error(`API Error (${endpoint}):`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Inventory endpoints
  async getInventory() {
    return this.request<{ items: any[] }>('/inventory');
  }

  async getInventoryItem(id: string) {
    return this.request<{ item: any }>(`/inventory/${id}`);
  }

  async createInventoryItem(data: any) {
    return this.request<{ item: any }>('/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInventoryItem(id: string, data: any) {
    return this.request<{ item: any }>(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInventoryItem(id: string) {
    return this.request<{ success: boolean }>(`/inventory/${id}`, {
      method: 'DELETE',
    });
  }

  async adjustQuantity(id: string, data: any) {
    return this.request<{ item: any }>(`/inventory/${id}/adjust`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Utility method for checking API health
  async healthCheck(): Promise<boolean> {
    try {
      await this.request('/health');
      return true;
    } catch {
      return false;
    }
  }
}

export const apiClient = new ApiClient();

// Hook-friendly API functions
export const api = {
  inventory: {
    list: () => apiClient.getInventory(),
    get: (id: string) => apiClient.getInventoryItem(id),
    create: (data: any) => apiClient.createInventoryItem(data),
    update: (id: string, data: any) => apiClient.updateInventoryItem(id, data),
    delete: (id: string) => apiClient.deleteInventoryItem(id),
    adjust: (id: string, data: any) => apiClient.adjustQuantity(id, data),
  },
  health: {
    check: () => apiClient.healthCheck(),
  },
};