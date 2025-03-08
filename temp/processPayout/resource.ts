// amplify/functions/processPayout/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const processPayout = defineFunction({
  name: 'processPayout',
  entry: './handler.ts',
  environment: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '', // For Stripe payouts
  },
  timeoutSeconds: 30, // Allow time for payout API calls
  memoryMB: 256, // Similar to processPayment
});