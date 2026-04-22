import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Duration } from 'aws-cdk-lib';

/**
 * SQS queue + dead-letter queue + CloudWatch alarm.
 *
 * TODO:
 * - Main queue: 60s visibility timeout, 4-day retention, long polling
 * - Dead-letter queue: 14-day retention, maxReceiveCount=3
 * - CloudWatch alarm: fires when DLQ has messages (ApproximateNumberOfMessagesVisible > 0)
 * - Optionally wire alarm to an SNS topic for email/Slack notification
 */
export interface MonitoredQueueProps {
  queueName: string;
  maxRetries?: number;
}

export class MonitoredQueue extends Construct {
  public readonly queue: sqs.Queue;
  public readonly dlq: sqs.Queue;
  public readonly alarm: cloudwatch.Alarm;

  constructor(scope: Construct, id: string, props: MonitoredQueueProps) {
    super(scope, id);

    this.dlq = new sqs.Queue(this, 'DLQ', {
      queueName: `${props.queueName}-dlq`,
      retentionPeriod: Duration.days(14),
    });

    this.queue = new sqs.Queue(this, 'Queue', {
      queueName: props.queueName,
      visibilityTimeout: Duration.seconds(60),
      retentionPeriod: Duration.days(4),
      receiveMessageWaitTime: Duration.seconds(20),
      deadLetterQueue: {
        queue: this.dlq,
        maxReceiveCount: props.maxRetries ?? 3,
      },
    });

    this.alarm = new cloudwatch.Alarm(this, 'DLQAlarm', {
      metric: this.dlq.metricApproximateNumberOfMessagesVisible(),
      threshold: 1,
      evaluationPeriods: 1,
      alarmDescription: `Dead letters in ${props.queueName}`,
    });
  }
}
