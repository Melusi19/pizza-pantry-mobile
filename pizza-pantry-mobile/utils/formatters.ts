export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Number formatting with units
export const formatQuantity = (quantity: number, unit: string): string => {
  if (quantity === 0) return `0 ${unit}`;
  
  // Handle decimal numbers appropriately
  if (quantity % 1 !== 0) {
    return `${quantity.toFixed(2)} ${unit}`;
  }
  
  return `${quantity} ${unit}`;
};

// Date formatting
export const formatDate = (date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'numeric' : 'short',
    day: 'numeric',
  };
  
  if (format === 'long') {
    options.weekday = 'short';
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return dateObj.toLocaleDateString('en-US', options);
};

export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return formatDate(dateObj, 'short');
};

// Text formatting
export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

// Phone number formatting
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Percentage formatting
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// Inventory-specific formatters
export const formatStockStatus = (quantity: number, minStock: number): { text: string; color: string } => {
  if (quantity === 0) {
    return { text: 'Out of Stock', color: '#FF3B30' };
  }
  if (quantity <= minStock) {
    return { text: 'Low Stock', color: '#FF9500' };
  }
  if (quantity <= minStock * 2) {
    return { text: 'Adequate', color: '#FFCC00' };
  }
  return { text: 'In Stock', color: '#34C759' };
};

export const formatAdjustmentReason = (reason: string): string => {
  const reasons: { [key: string]: string } = {
    'Delivery Received': 'Delivery',
    'Stock Count Correction': 'Count Correction',
    'Waste/Damage': 'Waste/Damage',
    'Theft/Loss': 'Theft/Loss',
    'Production Usage': 'Production',
    'Transfer In': 'Transfer In',
    'Transfer Out': 'Transfer Out',
    'Other': 'Other',
  };
  
  return reasons[reason] || reason;
};