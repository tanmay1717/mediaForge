import { Stack, StackProps, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as path from 'path';
import { MediaForgeConfig } from './config';

export interface TransformStackProps extends StackProps {
  bucket: s3.Bucket;
}

export class TransformStack extends Stack {
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, config: MediaForgeConfig, props: TransformStackProps) {
    super(scope, id, props);

    const sharpLayer = lambda.LayerVersion.fromLayerVersionArn(
      this, 'SharpLayer',
      'arn:aws:lambda:us-east-1:807737159780:layer:sharp-linux-x64:1',
    );

    const transformFn = new lambdaNode.NodejsFunction(this, 'TransformFn', {
      entry: path.join(__dirname, '../../packages/edge-transform/src/lambda-handler.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.X86_64,
      memorySize: 1536,
      timeout: Duration.seconds(30),
      layers: [sharpLayer],
      environment: {
        S3_BUCKET: props.bucket.bucketName,
        S3_REGION: 'us-east-1',
      },
      bundling: {
        minify: true,
        sourceMap: false,
        forceDockerBundling: false,
        externalModules: ['sharp'],
      },
    });

    props.bucket.grantReadWrite(transformFn);

    const fnUrl = transformFn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    // Import the wildcard certificate
    const cert = acm.Certificate.fromCertificateArn(this, 'WildcardCert',
      'arn:aws:acm:us-east-1:807737159780:certificate/b548d6a5-3c81-4404-bf90-9b17fa3e4be1',
    );

    const fnOrigin = new origins.FunctionUrlOrigin(fnUrl);
    const s3Origin = new origins.S3Origin(props.bucket);

    this.distribution = new cloudfront.Distribution(this, 'MediaCdn', {
      domainNames: ['cdn.tanmayshetty.com'],
      certificate: cert,
      defaultBehavior: {
        origin: s3Origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      additionalBehaviors: {
        '/v1/*': {
          origin: fnOrigin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: new cloudfront.CachePolicy(this, 'TransformCache', {
            cachePolicyName: `mediaforge-${config.stage}-transform-v2`,
            headerBehavior: cloudfront.CacheHeaderBehavior.allowList('Accept'),
            queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
            defaultTtl: Duration.days(30),
            maxTtl: Duration.days(365),
            minTtl: Duration.seconds(0),
          }),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        },
      },
    });

    new CfnOutput(this, 'CdnDomain', { value: this.distribution.distributionDomainName });
    new CfnOutput(this, 'CdnDistributionId', { value: this.distribution.distributionId });
    new CfnOutput(this, 'TransformFnUrl', { value: fnUrl.url });
    new CfnOutput(this, 'CustomDomain', { value: 'cdn.tanmayshetty.com' });
  }
}
