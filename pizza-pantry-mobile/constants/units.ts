export const UNITS = [
  'units',
  'kg',
  'g', 
  'lbs',
  'oz',
  'liters',
  'ml',
  'pack',
  'box',
  'case'
] as const;

export type Unit = typeof UNITS[number];