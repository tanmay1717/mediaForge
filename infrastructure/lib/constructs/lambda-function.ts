import { Construct } from 'constructs';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib';

export interface MediaForgeFunctionProps {
  entry: string;
  handler?: string;
  memorySize?: number;
  timeout?: Duration;
  environment?: Record<string, string>;
  layers?: lambda.ILayerVersion[];
}

export class MediaForgeFunction extends Construct {
  public readonly fn: lambda.Function;

  constructor(scope: Construct, id: string, props: MediaForgeFunctionProps) {
    super(scope, id);

    this.fn = new lambdaNode.NodejsFunction(this, 'Function', {
      entry: props.entry,
      handler: props.handler || 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: props.memorySize || 256,
      timeout: props.timeout || Duration.seconds(30),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
        ...props.environment,
      },
      layers: props.layers,
      tracing: lambda.Tracing.ACTIVE,
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: [],
        forceDockerBundling: false,  // Use local esbuild, not Docker
      },
    });
  }
}
