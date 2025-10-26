export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password must be at least 8 characters long');
  }

  // Upper case check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one uppercase letter');
  }

  // Lower case check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one lowercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one number');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one special character');
  }

  return {
    isValid: score >= 4, // Require at least 4 out of 5 criteria
    score: score / 5, // Normalize to 0-1
    feedback: feedback.length > 0 ? feedback : ['Password is strong!'],
  };
};

// Inventory-specific validators
export const validateQuantityAdjustment = (
  currentQuantity: number,
  adjustment: number,
  minStock: number = 0
): { isValid: boolean; error?: string } => {
  const newQuantity = currentQuantity + adjustment;

  if (adjustment === 0) {
    return { isValid: false, error: 'Adjustment cannot be zero' };
  }

  if (newQuantity < 0) {
    return { isValid: false, error: 'Resulting quantity cannot be negative' };
  }

  if (newQuantity > 1000000) {
    return { isValid: false, error: 'Resulting quantity is too large' };
  }

  if (adjustment > 0 && newQuantity < minStock) {
    return { 
      isValid: true, 
      error: `Warning: Quantity will still be below minimum stock (${minStock})` 
    };
  }

  return { isValid: true };
};

export const validatePrice = (price: number): { isValid: boolean; error?: string } => {
  if (price < 0) {
    return { isValid: false, error: 'Price cannot be negative' };
  }

  if (price > 1000000) {
    return { isValid: false, error: 'Price is too large' };
  }

  if (price * 100 % 1 !== 0) {
    return { isValid: false, error: 'Price can only have up to 2 decimal places' };
  }

  return { isValid: true };
};

// Form field validators
export const validateRequired = (value: string): string | null => {
  if (!value || value.trim().length === 0) {
    return 'This field is required';
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number): string | null => {
  if (value.length < minLength) {
    return `Must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number): string | null => {
  if (value.length > maxLength) {
    return `Must be less than ${maxLength} characters`;
  }
  return null;
};

export const validateNumberRange = (
  value: number,
  min: number = 0,
  max: number = 1000000
): string | null => {
  if (value < min) {
    return `Must be at least ${min}`;
  }
  if (value > max) {
    return `Must be less than ${max}`;
  }
  return null;
};

// Bulk validation for forms
export const validateForm = (fields: { [key: string]: any }, rules: { [key: string]: (value: any) => string | null }) => {
  const errors: { [key: string]: string } = {};
  
  Object.keys(rules).forEach(field => {
    const error = rules[field](fields[field]);
    if (error) {
      errors[field] = error;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};