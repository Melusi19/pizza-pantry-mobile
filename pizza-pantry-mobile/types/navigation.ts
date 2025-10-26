import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type TabParamList = {
  Inventory: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  '(tabs)': NavigatorScreenParams<TabParamList>;
  'item-detail': { itemId: string };
  'add-item': undefined;
  'edit-item': { itemId: string };
  'adjust-quantity': { itemId: string };
};