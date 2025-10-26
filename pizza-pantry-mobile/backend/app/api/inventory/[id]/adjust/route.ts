import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, getInventoryCollection, getAdjustmentsCollection } from '../../../../../../lib/mongodb';
import { authenticateRequest, createApiResponse, createErrorResponse } from '../../../../../../lib/auth';
import { toObjectId, validateObjectId, calculateNewQuantity } from '../../../../../../lib/utils';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
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

    const { adjustment, reason } = await request.json();

    // Validate request data
    if (typeof adjustment !== 'number') {
      return NextResponse.json(
        createErrorResponse('Adjustment must be a number'),
        { status: 400 }
      );
    }

    if (adjustment === 0) {
      return NextResponse.json(
        createErrorResponse('Adjustment cannot be zero'),
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return NextResponse.json(
        createErrorResponse('Reason is required'),
        { status: 400 }
      );
    }

    // Get current item
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

    // Calculate new quantity
    const newQuantity = calculateNewQuantity(item.quantity, adjustment);

    // Update item quantity
    const updateResult = await inventoryCollection.updateOne(
      { _id: toObjectId(params.id) },
      {
        $set: {
          quantity: newQuantity,
          lastUpdated: new Date(),
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error('Failed to update item quantity');
    }

    // Log the adjustment
    const adjustmentRecord = {
      itemId: toObjectId(params.id),
      previousQuantity: item.quantity,
      newQuantity,
      adjustment,
      reason: reason.trim(),
      userId,
      timestamp: new Date(),
    };

    await adjustmentsCollection.insertOne(adjustmentRecord);

    // Get updated item
    const updatedItem = await inventoryCollection.findOne({
      _id: toObjectId(params.id),
    });

    const responseData = {
      item: {
        id: updatedItem!._id.toString(),
        name: updatedItem!.name,
        quantity: updatedItem!.quantity,
        unit: updatedItem!.unit,
      },
      adjustment: {
        previousQuantity: item.quantity,
        newQuantity,
        adjustment,
        reason: reason.trim(),
      },
    };

    return NextResponse.json(
      createApiResponse(responseData, 'Quantity adjusted successfully')
    );
  } catch (error: any) {
    console.error(`POST /api/inventory/${params.id}/adjust error:`, error);
    return NextResponse.json(
      createErrorResponse(error.message || 'Failed to adjust quantity'),
      { status: 500 }
    );
  }
}