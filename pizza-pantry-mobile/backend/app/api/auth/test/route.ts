import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createApiResponse, createErrorResponse, rateLimit } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Simple rate limiting for test endpoint
    const identifier = request.ip || 'anonymous';
    if (!rateLimit(identifier, 5, 60000)) { // 5 requests per minute
      return NextResponse.json(
        createErrorResponse('Rate limit exceeded', 429),
        { status: 429 }
      );
    }

    const { userId, sessionId } = getAuth(request);
    
    const testData = {
      authentication: {
        isAuthenticated: !!userId,
        userId: userId || null,
        sessionId: sessionId || null,
      },
      headers: {
        userAgent: request.headers.get('user-agent'),
        contentType: request.headers.get('content-type'),
        authorization: request.headers.get('authorization') ? 'present' : 'missing',
      },
      server: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      },
    };

    return NextResponse.json(
      createApiResponse(testData, 'Auth test completed successfully')
    );
  } catch (error: any) {
    console.error('GET /api/auth/test error:', error);
    return NextResponse.json(
      createErrorResponse(error.message || 'Auth test failed', 500),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        createErrorResponse('Authentication required', 401),
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const testResult = {
      authenticated: true,
      userId,
      receivedData: body,
      processedAt: new Date().toISOString(),
      message: 'Successfully processed authenticated request',
    };

    return NextResponse.json(
      createApiResponse(testResult, 'Authenticated test completed')
    );
  } catch (error: any) {
    console.error('POST /api/auth/test error:', error);
    return NextResponse.json(
      createErrorResponse(error.message || 'Authenticated test failed', 500),
      { status: 500 }
    );
  }
}