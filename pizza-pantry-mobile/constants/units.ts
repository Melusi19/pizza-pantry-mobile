export const UNITS = [
  'units',
  'kg',
  'g',
  'lbs',
  'oz',
  'liters',
  'ml',
  'gallons',
  'pack',
  'box',
  'case',
  'bottle',
  'can',
  'jar'
] as const;

export type Unit = typeof UNITS[number];

export const UNIT_CONVERSIONS: Record<Unit, { baseUnit: Unit; factor: number }> = {
  'kg': { baseUnit: 'g', factor: 1000 },
  'g': { baseUnit: 'g', factor: 1 },
  'lbs': { baseUnit: 'oz', factor: 16 },
  'oz': { baseUnit: 'oz', factor: 1 },
  'liters': { baseUnit: 'ml', factor: 1000 },
  'ml': { baseUnit: 'ml', factor: 1 },
  'gallons': { baseUnit: 'ml', factor: 3785.41 },
  'units': { baseUnit: 'units', factor: 1 },
  'pack': { baseUnit: 'units', factor: 1 },
  'box': { baseUnit: 'units', factor: 1 },
  'case': { baseUnit: 'units', factor: 1 },
  'bottle': { baseUnit: 'units', factor: 1 },
  'can': { baseUnit: 'units', factor: 1 },
  'jar': { baseUnit: 'units', factor: 1 },
};