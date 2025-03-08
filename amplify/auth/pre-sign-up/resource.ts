// amplify/functions/preSignUp/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const preSignUp = defineFunction({
  name: 'preSignUp',
  entry: './handler.ts',
});