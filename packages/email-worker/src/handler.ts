import { SQSEvent, SQSBatchResponse, SQSBatchItemFailure } from 'aws-lambda';
import { MediaForgeEvent, EventType, UserCreatedEvent, QuotaWarningEvent } from '@media-forge/core';
import { renderEmail } from './template-renderer';
import { sendEmail } from './ses-client';

/**
 * SQS consumer Lambda — processes email jobs from the queue.
 *
 * Flow:
 * 1. Receive a batch of SQS messages (each wraps an SNS event)
 * 2. For each message:
 *    a. Parse the SNS notification → extract our event payload
 *    b. Route by eventType → select the right template + variables
 *    c. Render the HTML email
 *    d. Send via SES
 * 3. Return partial batch response:
 *    - Successfully processed messages are deleted from SQS
 *    - Failed messages are returned as batchItemFailures (SQS retries them)
 *
 * TODO:
 * - Add structured logging (JSON) for each email sent/failed
 * - Add CloudWatch metrics: emails_sent, emails_failed
 * - Handle new event types as they're added (just add a case + template)
 */
export async function handler(event: SQSEvent): Promise<SQSBatchResponse> {
  const failures: SQSBatchItemFailure[] = [];

  for (const record of event.Records) {
    try {
      // SQS message body is an SNS notification JSON
      const snsMessage = JSON.parse(record.body);
      const payload: MediaForgeEvent = JSON.parse(snsMessage.Message);

      let to: string;
      let subject: string;
      let html: string;

      switch (payload.eventType) {
        case EventType.USER_CREATED: {
          const evt = payload as UserCreatedEvent;
          to = evt.email;
          subject = 'Welcome to MediaForge!';
          html = renderEmail('welcome', {
            name: evt.name,
            deliveryDomain: process.env.CDN_DOMAIN || 'cdn.yourdomain.com',
            apiKey: 'See your dashboard for API keys',
            dashboardUrl: process.env.DASHBOARD_URL || 'https://app.yourdomain.com',
          });
          break;
        }

        case EventType.QUOTA_WARNING: {
          const evt = payload as QuotaWarningEvent;
          to = evt.email;
          subject = `Storage quota: ${evt.usagePercent}% used`;
          html = renderEmail('quota-warning', {
            name: evt.email,
            usagePercent: evt.usagePercent,
            usedBytes: evt.usedBytes,
            limitBytes: evt.limitBytes,
            dashboardUrl: process.env.DASHBOARD_URL || 'https://app.yourdomain.com',
          });
          break;
        }

        default:
          console.warn(`Unknown event type: ${(payload as any).eventType}`);
          continue; // Skip, don't retry unknown events
      }

      await sendEmail(to, subject, html);
      console.log(`Email sent: ${subject} → ${to}`);
    } catch (err) {
      console.error(`Failed to process message ${record.messageId}:`, err);
      failures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures: failures };
}
