import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

export async function authenticateRequest(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      throw new Error('Unauthorized');
    }
    
    return userId;
  } catch (error) {
    throw new Error('Authentication failed');
  }
}

export function createApiResponse<T>(
  data: T,
  message?: string,
  status: number = 200
) {
  return {
    success: status < 400,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

export function createErrorResponse(
  message: string,
  status: number = 400
) {
  return {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  };
}