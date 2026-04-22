import { Stack, StackProps, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { MediaForgeConfig } from './config';

/**
 * DashboardHostingStack — S3 static site + CloudFront for the Next.js dashboard.
 *
 * TODO:
 * - S3 bucket for the static export (next build → out/)
 * - CloudFront distribution with:
 *   - S3 origin via OAC
 *   - Custom domain: app.yourdomain.com
 *   - ACM certificate
 *   - SPA routing: custom error response → 200 /index.html (for client-side routing)
 * - Export bucket name and distribution ID (for CI/CD pipeline)
 */
export class DashboardHostingStack extends Stack {
  public readonly dashboardBucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, config: MediaForgeConfig, props?: StackProps) {
    super(scope, id, props);

    this.dashboardBucket = new s3.Bucket(this, 'DashboardBucket', {
      bucketName: `mediaforge-${config.stage}-dashboard`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: config.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoDeleteObjects: config.stage !== 'prod',
    });

    this.distribution = new cloudfront.Distribution(this, 'DashboardCdn', {
      defaultBehavior: {
        origin: new origins.S3Origin(this.dashboardBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        { httpStatus: 404, responsePagePath: '/index.html', responseHttpStatus: 200 },
        { httpStatus: 403, responsePagePath: '/index.html', responseHttpStatus: 200 },
      ],
      // TODO: Add custom domain + ACM cert
    });

    new CfnOutput(this, 'DashboardBucketName', { value: this.dashboardBucket.bucketName });
    new CfnOutput(this, 'DashboardDistributionId', { value: this.distribution.distributionId });
    new CfnOutput(this, 'DashboardUrl', { value: `https://${this.distribution.distributionDomainName}` });
  }
}
