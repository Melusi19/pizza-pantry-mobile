import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function POST(request: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Error occurred -- no svix headers' },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json(
      { error: 'Error occurred -- could not verify webhook' },
      { status: 400 }
    );
  }

  // Handle the webhook
  const eventType = evt.type;

  try {
    const { db } = await connectToDatabase();
    const inventoryCollection = db.collection('inventory');
    const adjustmentsCollection = db.collection('quantityAdjustments');
    const preferencesCollection = db.collection('userPreferences');

    console.log(`Processing webhook event: ${eventType}`);

    switch (eventType) {
      case 'user.created':
        // Create default preferences for new user
        const userId = evt.data.id;
        const userEmail = evt.data.email_addresses?.[0]?.email_address;
        
        await preferencesCollection.insertOne({
          userId,
          email: userEmail,
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
        });
        
        console.log(`Created default preferences for user: ${userId}`);
        break;

      case 'user.updated':
        // Update user preferences if email changed
        const updatedUserId = evt.data.id;
        const updatedEmail = evt.data.email_addresses?.[0]?.email_address;
        
        if (updatedEmail) {
          await preferencesCollection.updateOne(
            { userId: updatedUserId },
            { 
              $set: { 
                email: updatedEmail,
                updatedAt: new Date() 
              } 
            }
          );
          console.log(`Updated email for user: ${updatedUserId}`);
        }
        break;

      case 'user.deleted':
        // Delete all user data when account is deleted
        const deletedUserId = evt.data.id;
        
        await inventoryCollection.deleteMany({ userId: deletedUserId });
        await adjustmentsCollection.deleteMany({ userId: deletedUserId });
        await preferencesCollection.deleteMany({ userId: deletedUserId });
        
        console.log(`Deleted all data for user: ${deletedUserId}`);
        break;

      case 'session.ended':
      case 'session.revoked':
        // You might want to log these events for security monitoring
        const sessionUserId = evt.data.user_id;
        console.log(`Session ended/revoked for user: ${sessionUserId}`);
        break;

      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }

    return NextResponse.json({ 
      success: true, 
      event: eventType,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}