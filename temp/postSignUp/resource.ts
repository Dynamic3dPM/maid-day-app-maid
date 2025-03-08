import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

interface UserAttributes {
  email: string;
  given_name: string;
  family_name: string;
  phone_number?: string;
  'custom:zipCode'?: string;
}

interface Event {
  request: {
    userAttributes: UserAttributes;
  };
}

interface DynamoDBParams {
  TableName: string;
  Item: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    zipCode?: string | null;
  };
}

export const handler = async (event: Event) => {
  const { email, given_name, family_name, phone_number, 'custom:zipCode': zipCode } = event.request.userAttributes;

  const params: DynamoDBParams = {
    TableName: process.env.MAID_TABLE_NAME!,
    Item: {
      email,
      firstName: given_name,
      lastName: family_name,
      phone: phone_number || null,
      zipCode: zipCode || null,
    },
  };

  try {
    await dynamoDb.send(new PutCommand(params));
    console.log('User data saved to DynamoDB:', { email });
  } catch (error) {
    console.error('Error saving user data:', error);
  }

  return event;
};
