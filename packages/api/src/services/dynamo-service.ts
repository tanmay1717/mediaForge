import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient, GetCommand, PutCommand,
  UpdateCommand, DeleteCommand, QueryCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Generic DynamoDB CRUD operations used by all service layers.
 *
 * TODO for each method:
 * - getItem: Get a single item by partition key (and optional sort key)
 * - putItem: Write a full item (create or overwrite)
 * - updateItem: Partial update using UpdateExpression builder
 * - deleteItem: Remove an item by key
 * - query: Query by partition key with optional sort key condition
 *   - Support pagination via ExclusiveStartKey / LastEvaluatedKey
 *   - Support GSI queries via IndexName parameter
 *   - Support ScanIndexForward for sort order
 * - queryAll: Auto-paginate and return all results (use sparingly)
 * - buildUpdateExpression: Helper to build SET/REMOVE expressions from a partial object
 */
export class DynamoService {
  constructor(private tableName: string) {}

  async getItem<T>(key: Record<string, unknown>): Promise<T | null> {
    // TODO: Use GetCommand with this.tableName and key
    // Return item as T or null if not found
    const result = await docClient.send(new GetCommand({
      TableName: this.tableName,
      Key: key,
    }));
    return (result.Item as T) ?? null;
  }

  async putItem<T>(item: T): Promise<T> {
    // TODO: Use PutCommand to write the item
    await docClient.send(new PutCommand({
      TableName: this.tableName,
      Item: item as Record<string, unknown>,
    }));
    return item;
  }

  async updateItem(
    key: Record<string, unknown>,
    updates: Record<string, unknown>,
  ): Promise<void> {
    // TODO: Build UpdateExpression from the updates object
    // TODO: Handle removing attributes when value is null/undefined
    const entries = Object.entries(updates).filter(([_, v]) => v !== undefined);
    const expression = entries.map(([k], i) => `#k${i} = :v${i}`).join(', ');
    const names: Record<string, string> = {};
    const values: Record<string, unknown> = {};
    entries.forEach(([k, v], i) => { names[`#k${i}`] = k; values[`:v${i}`] = v; });

    await docClient.send(new UpdateCommand({
      TableName: this.tableName,
      Key: key,
      UpdateExpression: `SET ${expression}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    }));
  }

  async deleteItem(key: Record<string, unknown>): Promise<void> {
    await docClient.send(new DeleteCommand({
      TableName: this.tableName,
      Key: key,
    }));
  }

  async query<T>(params: {
    keyCondition: string;
    expressionValues: Record<string, unknown>;
    expressionNames?: Record<string, string>;
    indexName?: string;
    limit?: number;
    cursor?: string;
    scanForward?: boolean;
  }): Promise<{ items: T[]; nextCursor?: string }> {
    // TODO: Use QueryCommand with all params
    // TODO: Decode cursor from base64 to ExclusiveStartKey
    // TODO: Encode LastEvaluatedKey to base64 as nextCursor
    const result = await docClient.send(new QueryCommand({
      TableName: this.tableName,
      IndexName: params.indexName,
      KeyConditionExpression: params.keyCondition,
      ExpressionAttributeValues: params.expressionValues,
      ExpressionAttributeNames: params.expressionNames,
      Limit: params.limit,
      ScanIndexForward: params.scanForward ?? false,
      ExclusiveStartKey: params.cursor
        ? JSON.parse(Buffer.from(params.cursor, 'base64').toString())
        : undefined,
    }));

    const nextCursor = result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : undefined;

    return { items: (result.Items as T[]) ?? [], nextCursor };
  }
}
