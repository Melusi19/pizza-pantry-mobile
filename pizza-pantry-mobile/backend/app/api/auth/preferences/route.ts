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

    const { db } = await connectToDatabase();
    const preferencesCollection = db.collection('userPreferences');

    // Get user preferences or return defaults
    let preferences = await preferencesCollection.findOne({ userId });
    
    if (!preferences) {
      preferences = {
        userId,
        theme: 'system',
        notifications: {
          lowStock: true,
          outOfStock: true,
          weeklyReport: false,
        },
        inventory: {
          defaultCategory: 'Other',
          defaultUnit: 'units',
          lowStockThreshold: 5,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await preferencesCollection.insertOne(preferences);
    }

    // Remove internal fields from response
    const { _id, ...userPreferences } = preferences;

    return NextResponse.json(
      createApiResponse(userPreferences, 'Preferences fetched successfully')
    );
  } catch (error: any) {
    console.error('GET /api/auth/preferences error:', error);
    return NextResponse.json(
      createErrorResponse(error.message || 'Failed to fetch preferences', 500),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        createErrorResponse('Unauthorized', 401),
        { status: 401 }
      );
    }

    const updates = await request.json();
    
    // Validate updates
    const allowedFields = ['theme', 'notifications', 'inventory'];
    const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));
    
    if (invalidFields.length > 0) {
      return NextResponse.json(
        createErrorResponse(`Invalid fields: ${invalidFields.join(', ')}`, 400),
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const preferencesCollection = db.collection('userPreferences');

    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    const result = await preferencesCollection.updateOne(
      { userId },
      { $set: updateData },
      { upsert: true }
    );

    const updatedPreferences = await preferencesCollection.findOne({ userId });
    const { _id, ...userPreferences } = updatedPreferences!;

    return NextResponse.json(
      createApiResponse(userPreferences, 'Preferences updated successfully')
    );
  } catch (error: any) {
    console.error('PUT /api/auth/preferences error:', error);
    return NextResponse.json(
      createErrorResponse(error.message || 'Failed to update preferences', 500),
      { status: 500 }
    );
  }
}