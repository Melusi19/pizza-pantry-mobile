import { ObjectId } from 'mongodb';

export function validateObjectId(id: string): boolean {
  return ObjectId.isValid(id);
}

export function toObjectId(id: string): ObjectId {
  if (!validateObjectId(id)) {
    throw new Error('Invalid ID format');
  }
  return new ObjectId(id);
}

export function sanitizeInventoryItem(item: any) {
  const { _id, userId, ...rest } = item;
  return {
    id: _id.toString(),
    ...rest,
  };
}

export function calculateNewQuantity(
  currentQuantity: number,
  adjustment: number
): number {
  const newQuantity = currentQuantity + adjustment;
  if (newQuantity < 0) {
    throw new Error('Quantity cannot be negative');
  }
  return newQuantity;
}

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}