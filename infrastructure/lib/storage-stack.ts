import { Stack, StackProps, CfnOutput, RemovalPolicy, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { MediaForgeConfig } from './config';
import { MediaForgeTable } from './constructs/dynamo-table';

/**
 * StorageStack — S3 bucket + DynamoDB tables.
 *
 * TODO:
 * S3 Bucket:
 * - Versioning enabled
 * - CORS for dashboard uploads (PUT from dashboard domain)
 * - Lifecycle rules: delete temp/ prefix after 1 day, move transforms/ to IA after 90 days
 * - Block all public access (CloudFront uses OAC)
 * - Encryption: S3-managed (SSE-S3)
 *
 * DynamoDB Tables:
 * - Assets: PK=assetId, GSI1=folderId-createdAt, GSI2=userId-createdAt
 * - Folders: PK=folderId, GSI1=parentFolderId-name, GSI2=userId-path
 * - Users: PK=userId, GSI1=email
 * - ApiKeys: PK=keyHash, GSI1=userId
 */
export class StorageStack extends Stack {
  public readonly bucket: s3.Bucket;
  public readonly assetsTable: dynamodb.Table;
  public readonly foldersTable: dynamodb.Table;
  public readonly usersTable: dynamodb.Table;
  public readonly apiKeysTable: dynamodb.Table;

  constructor(scope: Construct, id: string, config: MediaForgeConfig, props?: StackProps) {
    super(scope, id, props);

    // ── S3 Bucket ──
    this.bucket = new s3.Bucket(this, 'AssetBucket', {
      bucketName: `mediaforge-${config.stage}-assets`,
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: config.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoDeleteObjects: config.stage !== 'prod',
      cors: [{
        allowedMethods: [s3.HttpMethods.PUT, s3.HttpMethods.GET],
        allowedOrigins: [`https://${config.dashboardDomain}`],
        allowedHeaders: ['*'],
      }],
      lifecycleRules: [
        { prefix: 'temp/', expiration: Duration.days(1) },
        // TODO: Add Intelligent-Tiering for originals/ and transforms/
      ],
    });

    // ── Assets Table ──
    const assetsConstruct = new MediaForgeTable(this, 'AssetsTable', {
      partitionKey: { name: 'assetId', type: dynamodb.AttributeType.STRING },
      stage: config.stage,
      gsis: [
        { indexName: 'folderId-createdAt-index', partitionKey: { name: 'folderId', type: dynamodb.AttributeType.STRING }, sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING } },
        { indexName: 'userId-createdAt-index', partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING }, sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING } },
      ],
    });
    this.assetsTable = assetsConstruct.table;

    // ── Folders Table ──
    const foldersConstruct = new MediaForgeTable(this, 'FoldersTable', {
      partitionKey: { name: 'folderId', type: dynamodb.AttributeType.STRING },
      stage: config.stage,
      gsis: [
        { indexName: 'parentFolderId-name-index', partitionKey: { name: 'parentFolderId', type: dynamodb.AttributeType.STRING }, sortKey: { name: 'name', type: dynamodb.AttributeType.STRING } },
        { indexName: 'userId-path-index', partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING }, sortKey: { name: 'path', type: dynamodb.AttributeType.STRING } },
      ],
    });
    this.foldersTable = foldersConstruct.table;

    // ── Users Table ──
    const usersConstruct = new MediaForgeTable(this, 'UsersTable', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      stage: config.stage,
      gsis: [
        { indexName: 'email-index', partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING } },
      ],
    });
    this.usersTable = usersConstruct.table;

    // ── ApiKeys Table ──
    const apiKeysConstruct = new MediaForgeTable(this, 'ApiKeysTable', {
      partitionKey: { name: 'keyHash', type: dynamodb.AttributeType.STRING },
      stage: config.stage,
      gsis: [
        { indexName: 'userId-index', partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING } },
      ],
    });
    this.apiKeysTable = apiKeysConstruct.table;

    // ── Outputs ──
    new CfnOutput(this, 'BucketName', { value: this.bucket.bucketName });
    new CfnOutput(this, 'AssetsTableName', { value: this.assetsTable.tableName });
    new CfnOutput(this, 'FoldersTableName', { value: this.foldersTable.tableName });
  }
}
