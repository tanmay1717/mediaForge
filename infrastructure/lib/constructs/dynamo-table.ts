import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';

/**
 * Base DynamoDB table construct with MediaForge defaults.
 *
 * TODO:
 * - On-demand billing (pay per request — best for unpredictable traffic)
 * - Point-in-time recovery enabled
 * - Removal policy: RETAIN in prod, DESTROY in dev
 * - TTL attribute support (for soft-deleted assets cleanup)
 */
export interface MediaForgeTableProps {
  partitionKey: { name: string; type: dynamodb.AttributeType };
  sortKey?: { name: string; type: dynamodb.AttributeType };
  gsis?: dynamodb.GlobalSecondaryIndexProps[];
  ttlAttribute?: string;
  stage: string;
}

export class MediaForgeTable extends Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props: MediaForgeTableProps) {
    super(scope, id);

    this.table = new dynamodb.Table(this, 'Table', {
      partitionKey: props.partitionKey,
      sortKey: props.sortKey,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      removalPolicy: props.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      timeToLiveAttribute: props.ttlAttribute,
    });

    // Add GSIs
    if (props.gsis) {
      for (const gsi of props.gsis) {
        this.table.addGlobalSecondaryIndex(gsi);
      }
    }
  }
}
