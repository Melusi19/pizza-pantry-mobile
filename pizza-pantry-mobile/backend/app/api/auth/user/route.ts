import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createApiResponse, createErrorResponse } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        createErrorResponse('Unauthorized', 401),
        { status: 401 }
      );
    }

    // In a real application, you might fetch additional user data from your database
    const { db } = await connectToDatabase();
    
    // Get user's inventory stats
    const inventoryStats = await db.collection('inventory').aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          lowStockItems: {
            $sum: {
              $cond: [
                { $and: [
                  { $lte: ['$quantity', '$minStock'] },
                  { $gt: ['$quantity', 0] }
                ] },
                1,
                0
              ]
            }
          },
          outOfStockItems: {
            $sum: {
              $cond: [
                { $eq: ['$quantity', 0] },
                1,
                0
              ]
            }
          },
          totalValue: {
            $sum: {
              $multiply: ['$quantity', '$price']
            }
          }
        }
      }
    ]).toArray();

    const stats = inventoryStats[0] || {
      totalItems: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      totalValue: 0
    };

    const userInfo = {
      userId,
      profile: {
        lastActive: new Date().toISOString(),
        inventoryStats: {
          totalItems: stats.totalItems,
          lowStockItems: stats.lowStockItems,
          outOfStockItems: stats.outOfStockItems,
          totalValue: stats.totalValue
        }
      }
    };

    return NextResponse.json(
      createApiResponse(userInfo, 'User info fetched successfully')
    );
  } catch (error: any) {
    console.error('GET /api/auth/user error:', error);
    return NextResponse.json(
      createErrorResponse(error.message || 'Failed to fetch user info', 500),
      { status: 500 }
    );
  }
}