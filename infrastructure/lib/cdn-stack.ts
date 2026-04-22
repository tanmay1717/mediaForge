import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { MediaForgeConfig } from './config';

/**
 * CdnStack — CloudFront + ACM + Lambda@Edge.
 *
 * TODO:
 * - ACM certificate for cdn.yourdomain.com (MUST be us-east-1)
 * - Lambda@Edge function attached to origin-request
 *   (bundles from packages/edge-transform/dist)
 * - CloudFront distribution:
 *   - S3 origin with Origin Access Control
 *   - Custom domain via alternate domain name + ACM cert
 *   - Cache policy: cache by URL + Accept header (for f_auto)
 *   - Origin request policy: forward Accept header to Lambda@Edge
 *   - Viewer protocol: redirect HTTP → HTTPS
 *   - Default TTL: 86400 (1 day), Max TTL: 2592000 (30 days)
 * - DNS: CNAME cdn.yourdomain.com → distribution domain
 *   (manual step — output the distribution domain for the user)
 */
export interface CdnStackProps extends StackProps {
  bucket: s3.Bucket;
}

export class CdnStack extends Stack {
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, config: MediaForgeConfig, props: CdnStackProps) {
    super(scope, id, props);

    // TODO: Create or import ACM certificate for config.cdnDomain
    // const cert = new acm.Certificate(this, 'CdnCert', {
    //   domainName: config.cdnDomain,
    //   validation: acm.CertificateValidation.fromDns(),
    // });

    // TODO: Create Lambda@Edge function from packages/edge-transform/dist

    this.distribution = new cloudfront.Distribution(this, 'CdnDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(props.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        // TODO: Add Lambda@Edge to origin-request
        // edgeLambdas: [{ functionVersion: edgeFn.currentVersion, eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST }],
      },
      // TODO: Uncomment when certificate is ready
      // domainNames: [config.cdnDomain],
      // certificate: cert,
    });

    new CfnOutput(this, 'DistributionDomain', { value: this.distribution.distributionDomainName });
    new CfnOutput(this, 'DistributionId', { value: this.distribution.distributionId });
  }
}
