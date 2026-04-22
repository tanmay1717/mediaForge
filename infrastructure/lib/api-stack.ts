import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { MediaForgeConfig } from './config';
import { MediaForgeFunction } from './constructs/lambda-function';

/**
 * ApiStack — API Gateway + Backend Lambda.
 *
 * TODO:
 * - Create REST API with Cognito authorizer
 * - Create Lambda function with env vars pointing to S3/DynamoDB/Cognito/SNS
 * - Grant Lambda permissions: S3 read/write, DynamoDB CRUD, SNS publish, Cognito admin
 * - Add API Gateway proxy resource: ANY /{proxy+} → Lambda
 * - Add CORS configuration on the API
 * - Enable API Gateway stage logging + X-Ray
 * - Set throttling limits (default: 100 rps burst, 50 rps steady)
 */
export interface ApiStackProps extends StackProps {
  userPool: cognito.UserPool;
  bucket: s3.Bucket;
  assetsTable: dynamodb.Table;
  foldersTable: dynamodb.Table;
  usersTable: dynamodb.Table;
  apiKeysTable: dynamodb.Table;
  snsTopicArn?: string;
}

export class ApiStack extends Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, config: MediaForgeConfig, props: ApiStackProps) {
    super(scope, id, props);

    // Lambda function
    const apiFn = new MediaForgeFunction(this, 'ApiFunction', {
      entry: '../packages/api/src/index.ts',
      memorySize: 512,
      environment: {
        S3_BUCKET_NAME: props.bucket.bucketName,
        ASSETS_TABLE: props.assetsTable.tableName,
        FOLDERS_TABLE: props.foldersTable.tableName,
        USERS_TABLE: props.usersTable.tableName,
        API_KEYS_TABLE: props.apiKeysTable.tableName,
        COGNITO_USER_POOL_ID: props.userPool.userPoolId,
        CDN_DOMAIN: config.cdnDomain,
        DASHBOARD_DOMAIN: config.dashboardDomain,
        SNS_TOPIC_ARN: props.snsTopicArn ?? '',
        STAGE: config.stage,
      },
    });

    // Grant permissions
    props.bucket.grantReadWrite(apiFn.fn);
    props.assetsTable.grantReadWriteData(apiFn.fn);
    props.foldersTable.grantReadWriteData(apiFn.fn);
    props.usersTable.grantReadWriteData(apiFn.fn);
    props.apiKeysTable.grantReadWriteData(apiFn.fn);

    // TODO: Grant SNS publish permission
    // TODO: Grant Cognito admin actions permission

    // Cognito authorizer
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'CognitoAuth', {
      cognitoUserPools: [props.userPool],
    });

    // REST API
    this.api = new apigateway.RestApi(this, 'Api', {
      restApiName: `mediaforge-${config.stage}`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
      },
    });

    // Proxy integration: ANY /{proxy+} → Lambda
    const proxy = this.api.root.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(apiFn.fn),
      anyMethod: true,
      defaultMethodOptions: {
        authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      },
    });

    // TODO: Override auth to NONE for /v1/auth/* routes (public endpoints)

    new CfnOutput(this, 'ApiUrl', { value: this.api.url });
  }
}
