import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({});
const FROM_EMAIL = process.env.SES_FROM_EMAIL || 'noreply@yourdomain.com';

/**
 * SES email sending wrapper.
 *
 * TODO:
 * - sendEmail: Use SendEmailCommand with HTML body + plain text fallback
 * - Classify errors as transient vs permanent:
 *   - Transient (SES throttle, temporary failure) → let SQS retry
 *   - Permanent (invalid email, bounce) → log and delete message
 * - Track delivery metrics (optional: publish to CloudWatch)
 */
export async function sendEmail(
  to: string,
  subject: string,
  htmlBody: string,
): Promise<void> {
  await ses.send(new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: {
        Html: { Data: htmlBody, Charset: 'UTF-8' },
        Text: { Data: stripHtml(htmlBody), Charset: 'UTF-8' },
      },
    },
  }));
}

/** Simple HTML tag stripper for plain text fallback */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
