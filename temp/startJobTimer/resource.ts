// amplify/functions/startJobTimer/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const startJobTimer = defineFunction({
  name: 'startJobTimer',
  entry: './handler.ts',
  timeoutSeconds: 15, // Quick operation for starting a timer
  memoryMB: 128, // Minimal memory for DB write
});