import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createApiResponse, createErrorResponse } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { userId, sessionId } = getAuth(request);
    
    if (!userId || !sessionId) {
      return NextResponse.json(
        createErrorResponse('No active session', 401),
        { status: 401 }
      );
    }

    const sessionInfo = {
      userId,
      sessionId,
      isAuthenticated: true,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(
      createApiResponse(sessionInfo, 'Session verified successfully')
    );
  } catch (error: any) {
    console.error('GET /api/auth/session error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to verify session', 500),
      { status: 500 }
    );
  }
}