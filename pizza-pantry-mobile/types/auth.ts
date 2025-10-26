import { User } from '@clerk/clerk-expo';

export interface AuthUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  imageUrl: string;
  createdAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    lowStock: boolean;
    outOfStock: boolean;
    weeklyReport: boolean;
  };
  inventory: {
    defaultCategory: string;
    defaultUnit: string;
    lowStockThreshold: number;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signIn: (params: any) => Promise<any>;
  signUp: (params: any) => Promise<any>;
  signOut: () => Promise<void>;
}