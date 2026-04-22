import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { MediaForgeEvent } from '@media-forge/core';

const sns = new SNSClient({});
const TOPIC_ARN = process.env.SNS_TOPIC_ARN!;

/**
 * Publish events to the mediaforge-user-events SNS topic.
 *
 * TODO:
 * - Serialize event payload as JSON message body
 * - Set MessageAttributes for filtering: eventType, environment
 * - Handle publish errors gracefully (log, don't crash the caller)
 */
export class SnsService {
  async publishEvent(event: MediaForgeEvent): Promise<void> {
    await sns.send(new PublishCommand({
      TopicArn: TOPIC_ARN,
      Message: JSON.stringify(event),
      MessageAttributes: {
        eventType: { DataType: 'String', StringValue: event.eventType },
        environment: { DataType: 'String', StringValue: event.environment },
      },
    }));
  }
}
