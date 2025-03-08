// amplify/functions/startJobTimer/handler.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

// Initialize the DynamoDB client
const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  const { jobId } = JSON.parse(event.body);

  const timer = {
    jobId,
    estimatedDuration: 120, // Example: 2 hours in minutes
    startTime: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
    status: 'running',
  };

  try {
    await dynamodb.send(
      new PutCommand({
        TableName: process.env.TIMER_TABLE!,
        Item: timer,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(timer),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};