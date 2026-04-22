import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as iam from 'aws-cdk-lib/aws-iam';
import { MediaForgeConfig } from './config';
import { MediaForgeFunction } from './constructs/lambda-function';
import { MonitoredQueue } from './constructs/monitored-queue';

/**
 * EmailStack — SNS topic + SQS queue + Email Worker Lambda + SES.
 *
 * TODO:
 * - SNS topic: mediaforge-{stage}-user-events
 * - SQS queue with DLQ (using MonitoredQueue construct)
 * - SQS subscription to SNS with filter policy: { eventType: ["USER_CREATED"] }
 * - Email Worker Lambda triggered by SQS
 * - Grant Lambda permission to SES:SendEmail
 * - SES domain identity (manual verification step — output instructions)
 */
export class EmailStack extends Stack {
  public readonly topic: sns.Topic;

  constructor(scope: Construct, id: string, config: MediaForgeConfig, props?: StackProps) {
    super(scope, id, props);

    // SNS Topic
    this.topic = new sns.Topic(this, 'UserEventsTopic', {
      topicName: `mediaforge-${config.stage}-user-events`,
    });

    // SQS Queue + DLQ
    const emailQueue = new MonitoredQueue(this, 'EmailQueue', {
      queueName: `mediaforge-${config.stage}-email-queue`,
      maxRetries: 3,
    });

    // SNS → SQS subscription with filter
    this.topic.addSubscription(new snsSubscriptions.SqsSubscription(emailQueue.queue, {
      filterPolicy: {
        eventType: sns.SubscriptionFilter.stringFilter({ allowlist: ['USER_CREATED', 'QUOTA_WARNING'] }),
      },
    }));

    // Email Worker Lambda
    const emailWorker = new MediaForgeFunction(this, 'EmailWorker', {
      entry: '../packages/email-worker/src/handler.ts',
      environment: {
        SES_FROM_EMAIL: config.sesFromEmail,
        CDN_DOMAIN: config.cdnDomain,
        DASHBOARD_URL: `https://${config.dashboardDomain}`,
        STAGE: config.stage,
      },
    });

    // SQS → Lambda trigger
    emailWorker.fn.addEventSource(new lambdaEventSources.SqsEventSource(emailQueue.queue, {
      batchSize: 5,
      reportBatchItemFailures: true,
    }));

    // Grant SES send permission
    emailWorker.fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*'], // TODO: Scope to verified domain ARN
    }));

    new CfnOutput(this, 'TopicArn', { value: this.topic.topicArn });
    new CfnOutput(this, 'QueueUrl', { value: emailQueue.queue.queueUrl });
  }
}
