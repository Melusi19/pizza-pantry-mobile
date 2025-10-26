import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, getInventoryCollection, getAdjustmentsCollection } from '../../../../../lib/mongodb';
import { authenticateRequest, createApiResponse, createErrorResponse } from '../../../../../lib/auth';
import { toObjectId, sanitizeInventoryItem, validateObjectId } from '../../../../../lib/utils';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await authenticateRequest(request);
    
    if (!validateObjectId(params.id)) {
      return NextResponse.json(
        createErrorResponse('Invalid item ID format'),
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const inventoryCollection = getInventoryCollection(db);
    const adjustmentsCollection = getAdjustmentsCollection(db);

    const item = await inventoryCollection.findOne({
      _id: toObjectId(params.id),
      userId,
    });

    if (!item) {
      return NextResponse.json(
        createErrorResponse('Item not found'),
        { status: 404 }
      );
    }

    // Get recent adjustments for this item
    const adjustments = await adjustmentsCollection
      .find({ itemId: toObjectId(params.id) })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();

    const sanitizedItem = sanitizeInventoryItem(item);
    const responseData = {
      ...sanitizedItem,
      adjustments: adjustments.map(adj => ({
        id: adj._id.toString(),
        previousQuantity: adj.previousQuantity,
        newQuantity: adj.newQuantity,
        adjustment: adj.adjustment,
        reason: adj.reason,
        timestamp: adj.timestamp,
      })),
    };

    return NextResponse.json(
      createApiResponse(responseData, 'Item fetched successfully')
    );
  } catch (error: any) {
    console.error(`GET /api/inventory/${params.id} error:`, error);
    return NextResponse.json(
      createErrorResponse(error.message || 'Failed to fetch item'),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await authenticateRequest(request);
    
    if (!validateObjectId(params.id)) {
      return NextResponse.json(
        createErrorResponse('Invalid item ID format'),
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const inventoryCollection = getInventoryCollection(db);

    const data = await request.json();

    // Validate data types for provided fields
    if (data.quantity !== undefined && (typeof data.quantity !== 'number' || data.quantity < 0)) {
      return NextResponse.json(
        createErrorResponse('Quantity must be a non-negative number'),
        { status: 400 }
      );
    }

    if (data.minStock !== undefined && (typeof data.minStock !== 'number' || data.minStock < 0)) {
      return NextResponse.json(
        createErrorResponse('Minimum stock must be a non-negative number'),
        { status: 400 }
      );
    }

    if (data.price !== undefined && (typeof data.price !== 'number' || data.price < 0)) {
      return NextResponse.json(
        createErrorResponse('Price must be a non-negative number'),
        { status: 400 }
      );
    }

    const updateData = {
      ...data,
      lastUpdated: new Date(),
    };

    const result = await inventoryCollection.updateOne(
      {
        _id: toObjectId(params.id),
        userId,
      },
      {
        $set: updateData,
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        createErrorResponse('Item not found'),
        { status: 404 }
      );
    }

    const updatedItem = await inventoryCollection.findOne({
      _id: toObjectId(params.id),
    });
    const sanitizedItem = sanitizeInventoryItem(updatedItem);

    return NextResponse.json(
      createApiResponse(sanitizedItem, 'Item updated successfully')
    );
  } catch (error: any) {
    console.error(`PUT /api/inventory/${params.id} error:`, error);
    return NextResponse.json(
      createErrorResponse(error.message || 'Failed to update item'),
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await authenticateRequest(request);
    
    if (!validateObjectId(params.id)) {
      return NextResponse.json(
        createErrorResponse('Invalid item ID format'),
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const inventoryCollection = getInventoryCollection(db);
    const adjustmentsCollection = getAdjustmentsCollection(db);

    const result = await inventoryCollection.deleteOne({
      _id: toObjectId(params.id),
      userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        createErrorResponse('Item not found'),
        { status: 404 }
      );
    }

    // Delete related adjustments
    await adjustmentsCollection.deleteMany({
      itemId: toObjectId(params.id),
    });

    return NextResponse.json(
      createApiResponse(null, 'Item deleted successfully')
    );
  } catch (error: any) {
    console.error(`DELETE /api/inventory/${params.id} error:`, error);
    return NextResponse.json(
      createErrorResponse(error.message || 'Failed to delete item'),
      { status: 500 }
    );
  }
}