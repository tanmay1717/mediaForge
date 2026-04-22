import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';

const cf = new CloudFrontClient({});
const DISTRIBUTION_ID = process.env.CLOUDFRONT_DISTRIBUTION_ID!;

/**
 * CloudFront cache invalidation for asset replacement / cache purge.
 *
 * TODO:
 * - invalidatePaths: Create an invalidation with specific path patterns
 *   e.g., "/v1/image/---/products/hero.jpg" to invalidate all transform variants - invalidateAll: Invalidate "/*" (use sparingly — costs apply after 1000/month)
 */
export class CloudFrontService {
  async invalidatePaths(paths: string[]): Promise<void> {
    await cf.send(new CreateInvalidationCommand({
      DistributionId: DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: `inv-${Date.now()}`,
        Paths: { Quantity: paths.length, Items: paths },
      },
    }));
  }

  async invalidateAll(): Promise<void> {
    await this.invalidatePaths(['/*']);
  }
}
