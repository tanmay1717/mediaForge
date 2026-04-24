import { PostConfirmationTriggerEvent, Context } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { EventType } from '@media-forge/core';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const sns = new SNSClient({});

const USERS_TABLE = process.env.USERS_TABLE!;
const FOLDERS_TABLE = process.env.FOLDERS_TABLE!;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN!;

/**
 * Cognito Post-Confirmation trigger.
 * Fires after a user confirms their email.
 *
 * 1. Creates a user record in DynamoDB
 * 2. Creates a root folder for the user
 * 3. Publishes USER_CREATED event to SNS → SQS → Email Worker → SES
 */
export async function handler(
  event: PostConfirmationTriggerEvent,
  _context: Context,
): Promise<PostConfirmationTriggerEvent> {
  const { sub: userId } = event.request.userAttributes;
  const email = event.request.userAttributes.email;
  const name = event.request.userAttributes.name || email.split('@')[0];
  const now = new Date().toISOString();

  // Generate a simple folder ID
  const rootFolderId = `root_${userId.substring(0, 8)}`;

  try {
    // 1. Create user record
    await ddb.send(new PutCommand({
      TableName: USERS_TABLE,
      Item: {
        userId,
        email,
        name,
        role: 'member',
        rootFolderId,
        storageUsed: 0,
        storageLimit: 5 * 1024 * 1024 * 1024, // 5 GB default
        createdAt: now,
        updatedAt: now,
      },
    }));

    // 2. Create root folder
    await ddb.send(new PutCommand({
      TableName: FOLDERS_TABLE,
      Item: {
        folderId: rootFolderId,
        userId,
        parentFolderId: 'ROOT',
        name: 'My Files',
        path: '/My Files',
        assetCount: 0,
        totalSize: 0,
        createdAt: now,
        updatedAt: now,
      },
    }));

    // 3. Publish USER_CREATED event to SNS
    await sns.send(new PublishCommand({
      TopicArn: SNS_TOPIC_ARN,
      Message: JSON.stringify({
        eventType: EventType.USER_CREATED,
        userId,
        email,
        name,
        timestamp: now,
        environment: process.env.STAGE || 'dev',
      }),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: EventType.USER_CREATED,
        },
        environment: {
          DataType: 'String',
          StringValue: process.env.STAGE || 'dev',
        },
      },
    }));

    console.log(`User created: ${userId} (${email})`);
  } catch (err) {
    console.error('Post-confirmation error:', err);
    // Don't throw — Cognito will retry and create duplicate users
  }

  // Must return the event for Cognito to proceed
  return event;
}
