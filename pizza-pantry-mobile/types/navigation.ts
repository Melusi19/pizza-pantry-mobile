import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

// Tab Navigator
export type TabParamList = {
  Inventory: undefined;
  Profile: undefined;
  Analytics?: undefined;
};

// Main Stack Navigator
export type RootStackParamList = {
  '(tabs)': NavigatorScreenParams<TabParamList>;
  '(auth)': NavigatorScreenParams<AuthStackParamList>;
  'item-detail': { itemId: string };
  'add-item': undefined;
  'edit-item': { itemId: string };
  'adjust-quantity': { itemId: string };
  'search': undefined;
  'settings': undefined;
};

// Screen Props Types
export type InventoryScreenProps = {
  navigation: any;
  route: any;
};

export type ItemDetailScreenProps = {
  navigation: any;
  route: {
    params: {
      itemId: string;
    };
  };
};

export type EditItemScreenProps = {
  navigation: any;
  route: {
    params: {
      itemId: string;
    };
  };
};

export type AdjustQuantityScreenProps = {
  navigation: any;
  route: {
    params: {
      itemId: string;
    };
  };
};

// Route Names for type safety
export type RouteName = 
  | 'Inventory'
  | 'Profile'
  | 'item-detail'
  | 'add-item'
  | 'edit-item'
  | 'adjust-quantity'
  | 'SignIn'
  | 'SignUp';