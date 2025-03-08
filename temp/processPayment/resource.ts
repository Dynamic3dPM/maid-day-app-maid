// amplify/functions/processPayment/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const processPayment = defineFunction({
  name: 'processPayment',
  entry: './handler.ts',
  environment: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '', // Set in .env or Amplify console
  },
  timeoutSeconds: 30, // Allow time for payment API calls
  memoryMB: 256, // Extra memory for Stripe processing
});