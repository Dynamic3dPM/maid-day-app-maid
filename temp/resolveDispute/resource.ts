// amplify/functions/resolveDispute/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const resolveDispute = defineFunction({
  name: 'resolveDispute',
  entry: './handler.ts',
  environment: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '', // For potential refunds
  },
  timeoutSeconds: 60, // Longer timeout for complex dispute logic
  memoryMB: 512, // More memory for DB queries and decision logic
});