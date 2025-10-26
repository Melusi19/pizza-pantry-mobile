import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createApiResponse, createErrorResponse } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        createErrorResponse('Unauthorized'),
        { status: 401 }
      );
    }

    // In a real application, you might fetch additional user data from your database
    const userProfile = {
      userId,
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: 'light',
        notifications: true,
      },
    };

    return NextResponse.json(
      createApiResponse(userProfile, 'User profile fetched successfully')
    );
  } catch (error: any) {
    console.error('GET /api/user/profile error:', error);
    return NextResponse.json(
      createErrorResponse(error.message || 'Failed to fetch user profile'),
      { status: 500 }
    );
  }
}