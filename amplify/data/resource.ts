import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { v4 as uuidv4 } from 'uuid'; // For generating IDs if needed in custom resolvers

// Reusable authorization function to apply global-like rules
const commonAuth = (allow: any) => [
  allow.owner(), // Owner has full access to their records
  allow.group('Maids').to(['read', 'update']), // Maids group can read and update
  allow.guest().to(['read']), // Guests can read
];

const schema = a.schema({
  Maid: a.model({
    email: a.string().required(), // Partition key, e.g., maid's email
    firstName: a.string().required(),
    lastName: a.string().required(),
    phone: a.string(), // Optional phone number
    zipCode: a.string(), // Optional zip code
  }).authorization(commonAuth),

  Bid: a
    .model({
      jobId: a.id().required(),
      maidId: a.string().required(), // References Maid.email
      amount: a.float().required(),
      status: a.string().required(), // e.g., "pending", "accepted", "paid"
      createdAt: a.timestamp().required(),
      payment: a.hasOne('Payment', 'paymentId'), // One Bid has one Payment, paymentId in Payment
    })
    .authorization(commonAuth),

  Payment: a
    .model({
      id: a.id().required(), // Stripe PaymentIntent or Charge ID
      jobId: a.id().required(),
      amount: a.float().required(), // Amount in USD
      status: a.string().required(), // e.g., "escrow_held", "released", "refunded"
      paymentMethod: a.string(), // e.g., "card", "wallet", "ach"
      customerId: a.string().required(), // Stripe Customer ID (homeowner)
      createdAt: a.timestamp().required(),
      metadata: a.json(), // Optional JSON metadata
      paymentId: a.id(), // Foreign key to Bid.id (renamed for clarity, was bidId)
      bid: a.belongsTo('Bid', 'paymentId'), // Payment belongs to a Bid via paymentId
    })
    .authorization(commonAuth),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool', // Uses Cognito User Pool
    apiKeyAuthorizationMode: {
      expiresInDays: 30, // Optional API key access
    },
  },
});