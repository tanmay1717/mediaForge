import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { Duration } from 'aws-cdk-lib';

/**
 * Base Lambda construct with MediaForge defaults.
 *
 * TODO:
 * - ARM64 architecture (Graviton — cheaper + faster)
 * - Node.js 20 runtime
 * - 256MB memory default (override for Sharp functions → 1536MB)
 * - 30s timeout default
 * - Structured JSON logging (AWS_LAMBDA_LOG_FORMAT=JSON)
 * - X-Ray tracing enabled
 * - Environment variables from config
 */
export interface MediaForgeFunctionProps {
  entry: string;           // Path to the handler file
  handler?: string;        // Handler export name (default: "handler")
  memorySize?: number;
  timeout?: Duration;
  environment?: Record<string, string>;
  layers?: lambda.ILayerVersion[];
}

export class MediaForgeFunction extends Construct {
  public readonly fn: lambda.Function;

  constructor(scope: Construct, id: string, props: MediaForgeFunctionProps) {
    super(scope, id);

    this.fn = new lambda.Function(this, 'Function', {
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      handler: props.handler || 'index.handler',
      code: lambda.Code.fromAsset(props.entry),
      memorySize: props.memorySize || 256,
      timeout: props.timeout || Duration.seconds(30),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
        ...props.environment,
      },
      layers: props.layers,
      tracing: lambda.Tracing.ACTIVE,
    });
  }
}
