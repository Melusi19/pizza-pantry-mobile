import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  PENDING_ACTIONS: 'pending_actions',
  USER_PREFERENCES: 'user_preferences',
  OFFLINE_DATA: 'offline_data',
  SEARCH_HISTORY: 'search_history',
} as const;

// Generic storage functions
export const storage = {
  // Store data
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Failed to store data for key "${key}":`, error);
      throw new Error(`Storage error: ${error}`);
    }
  },

  // Retrieve data
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Failed to retrieve data for key "${key}":`, error);
      return null;
    }
  },

  // Remove data
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove data for key "${key}":`, error);
      throw new Error(`Storage error: ${error}`);
    }
  },

  // Clear all storage (use with caution)
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw new Error(`Storage error: ${error}`);
    }
  },

  // Get multiple items
  async multiGet<T>(keys: string[]): Promise<[string, T | null][]> {
    try {
      const values = await AsyncStorage.multiGet(keys);
      return values.map(([key, value]) => [
        key,
        value != null ? JSON.parse(value) : null,
      ]);
    } catch (error) {
      console.error('Failed to get multiple items:', error);
      return keys.map(key => [key, null]);
    }
  },

  // Store multiple items
  async multiSet<T>(keyValuePairs: [string, T][]): Promise<void> {
    try {
      const pairs = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(pairs as [string, string][]);
    } catch (error) {
      console.error('Failed to set multiple items:', error);
      throw new Error(`Storage error: ${error}`);
    }
  },
};

// Specialized storage functions for the app
export const appStorage = {
  // Pending actions for offline sync
  async getPendingActions() {
    return storage.getItem<any[]>(STORAGE_KEYS.PENDING_ACTIONS) || [];
  },

  async setPendingActions(actions: any[]) {
    return storage.setItem(STORAGE_KEYS.PENDING_ACTIONS, actions);
  },

  // User preferences
  async getUserPreferences() {
    return storage.getItem(STORAGE_KEYS.USER_PREFERENCES) || {};
  },

  async setUserPreferences(preferences: any) {
    return storage.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  },

  // Search history
  async getSearchHistory(): Promise<string[]> {
    return storage.getItem<string[]>(STORAGE_KEYS.SEARCH_HISTORY) || [];
  },

  async addToSearchHistory(query: string): Promise<void> {
    const history = await appStorage.getSearchHistory();
    const newHistory = [query, ...history.filter(q => q !== query)].slice(0, 10); // Keep last 10
    await storage.setItem(STORAGE_KEYS.SEARCH_HISTORY, newHistory);
  },

  async clearSearchHistory(): Promise<void> {
    await storage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  },

  // Offline data cache
  async getOfflineData(key: string) {
    const allData = await storage.getItem<Record<string, any>>(STORAGE_KEYS.OFFLINE_DATA) || {};
    return allData[key] || null;
  },

  async setOfflineData(key: string, data: any) {
    const allData = await storage.getItem<Record<string, any>>(STORAGE_KEYS.OFFLINE_DATA) || {};
    allData[key] = {
      data,
      timestamp: Date.now(),
    };
    await storage.setItem(STORAGE_KEYS.OFFLINE_DATA, allData);
  },

  async clearExpiredOfflineData(maxAge: number = 24 * 60 * 60 * 1000) { // 24 hours default
    const allData = await storage.getItem<Record<string, any>>(STORAGE_KEYS.OFFLINE_DATA) || {};
    const now = Date.now();
    
    Object.keys(allData).forEach(key => {
      if (now - (allData[key].timestamp || 0) > maxAge) {
        delete allData[key];
      }
    });
    
    await storage.setItem(STORAGE_KEYS.OFFLINE_DATA, allData);
  },
};