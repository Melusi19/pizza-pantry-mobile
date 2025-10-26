export const CATEGORIES = [
  'Dough & Flour',
  'Sauces',
  'Cheeses', 
  'Meats',
  'Vegetables',
  'Toppings',
  'Spices & Herbs',
  'Packaging',
  'Beverages',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];