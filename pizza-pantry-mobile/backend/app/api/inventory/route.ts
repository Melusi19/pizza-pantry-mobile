import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, getInventoryCollection, getAdjustmentsCollection } from '../../../../lib/mongodb';
import { authenticateRequest, createApiResponse, createErrorResponse } from '../../../../lib/auth';
import { toObjectId, sanitizeInventoryItem } from '../../../../lib/utils';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    const { db } = await connectToDatabase();
    const inventoryCollection = getInventoryCollection(db);

    const inventory = await inventoryCollection
      .find({ userId })
      .sort({ name: 1 })
      .toArray();

    const sanitizedItems = inventory.map(sanitizeInventoryItem);

    return NextResponse.json(
      createApiResponse(sanitizedItems, 'Inventory fetched successfully')
    );
  } catch (error: any) {
    console.error('GET /api/inventory error:', error);
    return NextResponse.json(
      createErrorResponse(error.message || 'Failed to fetch inventory'),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    const { db } = await connectToDatabase();
    const inventoryCollection = getInventoryCollection(db);
    const adjustmentsCollection = getAdjustmentsCollection(db);

    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'category', 'quantity', 'minStock', 'unit', 'price', 'supplier'];
    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        return NextResponse.json(
          createErrorResponse(`Missing required field: ${field}`),
          { status: 400 }
        );
      }
    }

    // Validate data types
    if (typeof data.quantity !== 'number' || data.quantity < 0) {
      return NextResponse.json(
        createErrorResponse('Quantity must be a non-negative number'),
        { status: 400 }
      );
    }

    if (typeof data.minStock !== 'number' || data.minStock < 0) {
      return NextResponse.json(
        createErrorResponse('Minimum stock must be a non-negative number'),
        { status: 400 }
      );
    }

    if (typeof data.price !== 'number' || data.price < 0) {
      return NextResponse.json(
        createErrorResponse('Price must be a non-negative number'),
        { status: 400 }
      );
    }

    const now = new Date();
    const newItem = {
      ...data,
      userId,
      createdAt: now,
      lastUpdated: now,
    };

    const result = await inventoryCollection.insertOne(newItem);

    // Create initial quantity adjustment log
    if (data.quantity > 0) {
      await adjustmentsCollection.insertOne({
        itemId: result.insertedId,
        previousQuantity: 0,
        newQuantity: data.quantity,
        adjustment: data.quantity,
        reason: 'Initial stock',
        userId,
        timestamp: now,
      });
    }

    const createdItem = await inventoryCollection.findOne({ _id: result.insertedId });
    const sanitizedItem = sanitizeInventoryItem(createdItem);

    return NextResponse.json(
      createApiResponse(sanitizedItem, 'Item created successfully'),
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST /api/inventory error:', error);
    return NextResponse.json(
      createErrorResponse(error.message || 'Failed to create item'),
      { status: 500 }
    );
  }
}