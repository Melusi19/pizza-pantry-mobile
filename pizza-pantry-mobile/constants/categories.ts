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
  'Cleaning Supplies',
  'Equipment',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];

export const CATEGORY_ICONS: Record<Category, string> = {
  'Dough & Flour': 'nutrition',
  'Sauces': 'water',
  'Cheeses': 'cube',
  'Meats': 'restaurant',
  'Vegetables': 'leaf',
  'Toppings': 'ellipsis-horizontal',
  'Spices & Herbs': 'flame',
  'Packaging': 'archive',
  'Beverages': 'wine',
  'Cleaning Supplies': 'sparkles',
  'Equipment': 'construct',
  'Other': 'cube'
};