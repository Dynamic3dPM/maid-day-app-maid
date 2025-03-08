

// amplify/functions/postSignUp/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const postSignUp = defineFunction({
  name: 'postSignUp',
  entry: './handler.ts',
  timeoutSeconds: 15, // Short timeout for post-sign-up tasks
  memoryMB: 128, // Minimal memory for DB writes or notifications
});