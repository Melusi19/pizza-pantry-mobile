import { useState, useEffect } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

// Custom hook to extend Clerk auth functionality
export const useAuth = () => {
  const { isLoaded, isSignedIn, userId, sessionId } = useClerkAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!isSignedIn);
  }, [isSignedIn]);

  // Store auth token in secure storage
  const storeAuthToken = async (token: string) => {
    try {
      await SecureStore.setItemAsync('auth_token', token);
    } catch (error) {
      console.error('Failed to store auth token:', error);
    }
  };

  // Get auth token from secure storage
  const getAuthToken = async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync('auth_token');
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  };

  // Clear auth token from secure storage
  const clearAuthToken = async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
    } catch (error) {
      console.error('Failed to clear auth token:', error);
    }
  };

  return {
    isLoaded,
    isSignedIn: isAuthenticated,
    userId,
    sessionId,
    storeAuthToken,
    getAuthToken,
    clearAuthToken,
  };
};

// Hook for managing user profile
export const useUserProfile = () => {
  const { user } = useClerkAuth();
  const [isLoading, setIsLoading] = useState(false);

  const updateUserProfile = async (updates: {
    firstName?: string;
    lastName?: string;
  }) => {
    if (!user) throw new Error('No user found');

    setIsLoading(true);
    try {
      await user.update(updates);
      return true;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    updateUserProfile,
  };
};