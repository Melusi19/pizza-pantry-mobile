import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createApiResponse, createErrorResponse } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    const { db } = await connectToDatabase();
    
    // Test database connection
    await db.command({ ping: 1 });
    
    // Test authentication
    const authStatus = userId ? 'authenticated' : 'unauthenticated';
    
    // Get some basic stats if authenticated
    let userStats = null;
    if (userId) {
      const inventoryCount = await db.collection('inventory').countDocuments({ userId });
      const preferences = await db.collection('userPreferences').findOne({ userId });
      
      userStats = {
        inventoryCount,
        hasPreferences: !!preferences,
      };
    }

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        authentication: 'operational',
        clerk: 'operational',
      },
      auth: {
        status: authStatus,
        userId: userId || null,
      },
      userStats,
    };

    return NextResponse.json(
      createApiResponse(healthStatus, 'Auth health check successful')
    );
  } catch (error: any) {
    console.error('GET /api/auth/health error:', error);
    
    const healthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'disconnected',
        authentication: 'degraded',
        clerk: 'unknown',
      },
      error: error.message,
    };

    return NextResponse.json(
      createErrorResponse('Auth health check failed', 500, healthStatus),
      { status: 500 }
    );
  }
}