// amplify/functions/processPayment/handler.ts
import Stripe from 'stripe';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

// Initialize Stripe and DynamoDB clients
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' });
const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  const { jobId, payment } = JSON.parse(event.body);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: payment.amount * 100, // Convert to cents
      currency: 'usd',
      payment_method: payment.paymentMethod,
      customer: payment.customerId,
      metadata: payment.metadata,
      capture_method: 'manual', // Hold in escrow
    });

    await dynamodb.send(
      new PutCommand({
        TableName: process.env.PAYMENT_TABLE!,
        Item: {
          id: paymentIntent.id,
          jobId,
          amount: payment.amount,
          status: 'escrow_held',
          paymentMethod: payment.paymentMethod,
          customerId: payment.customerId,
          createdAt: Math.floor(Date.now() / 1000),
          metadata: payment.metadata,
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ payment: paymentIntent }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};