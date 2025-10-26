export const COLORS = {
  // Primary colors
  primary: '#007AFF',
  primaryLight: '#4DA3FF',
  primaryDark: '#0056CC',
  
  // Secondary colors
  secondary: '#5856D6',
  secondaryLight: '#7D7BFF',
  secondaryDark: '#3634A3',
  
  // Status colors
  success: '#34C759',
  successLight: '#5CDB7D',
  successDark: '#28A745',
  
  warning: '#FF9500',
  warningLight: '#FFB340',
  warningDark: '#CC7700',
  
  danger: '#FF3B30',
  dangerLight: '#FF6961',
  dangerDark: '#D70015',
  
  // Neutral colors
  background: '#FFFFFF',
  card: '#F2F2F7',
  text: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C6C6C8',
  border: '#C6C6C8',
  separator: '#E5E5EA',
  
  // Gray scale
  gray: {
    50: '#F9FAFB',
    100: '#F2F2F7',
    200: '#E5E5EA',
    300: '#D1D1D6',
    400: '#C6C6C8',
    500: '#8E8E93',
    600: '#636366',
    700: '#48484A',
    800: '#3A3A3C',
    900: '#1C1C1E',
  },
} as const;

export type Color = keyof typeof COLORS;
export type GrayColor = keyof typeof COLORS.gray;