import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { MediaForgeConfig } from './config';
import { MediaForgeFunction } from './constructs/lambda-function';

export interface ApiStackProps extends StackProps {
  userPool: cognito.UserPool;
  bucket: s3.Bucket;
  assetsTable: dynamodb.Table;
  foldersTable: dynamodb.Table;
  usersTable: dynamodb.Table;
  apiKeysTable: dynamodb.Table;
  snsTopicArn?: string;
  cognitoClientId: string;
}

export class ApiStack extends Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, config: MediaForgeConfig, props: ApiStackProps) {
    super(scope, id, props);

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
        COGNITO_CLIENT_ID: props.cognitoClientId,
        CDN_DOMAIN: config.cdnDomain,
        DASHBOARD_DOMAIN: config.dashboardDomain,
        SNS_TOPIC_ARN: props.snsTopicArn ?? '',
        STAGE: config.stage,
      },
    });

    props.bucket.grantReadWrite(apiFn.fn);
    props.assetsTable.grantReadWriteData(apiFn.fn);
    props.foldersTable.grantReadWriteData(apiFn.fn);
    props.usersTable.grantReadWriteData(apiFn.fn);
    props.apiKeysTable.grantReadWriteData(apiFn.fn);

    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'CognitoAuth', {
      cognitoUserPools: [props.userPool],
    });

    const lambdaIntegration = new apigateway.LambdaIntegration(apiFn.fn);

    this.api = new apigateway.RestApi(this, 'Api', {
      restApiName: `mediaforge-${config.stage}`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
      },
    });

    // CORS headers on ALL error responses (4xx, 5xx)
    // Without this, Cognito authorizer 401s block the browser
    this.api.addGatewayResponse('cors-4xx', {
      type: apigateway.ResponseType.DEFAULT_4XX,
      responseHeaders: {
        'Access-Control-Allow-Origin': "'*'",
        'Access-Control-Allow-Headers': "'Content-Type,Authorization,x-api-key'",
        'Access-Control-Allow-Methods': "'GET,POST,PUT,DELETE,OPTIONS'",
      },
    });
    this.api.addGatewayResponse('cors-5xx', {
      type: apigateway.ResponseType.DEFAULT_5XX,
      responseHeaders: {
        'Access-Control-Allow-Origin': "'*'",
        'Access-Control-Allow-Headers': "'Content-Type,Authorization,x-api-key'",
        'Access-Control-Allow-Methods': "'GET,POST,PUT,DELETE,OPTIONS'",
      },
    });

    // Public routes: /v1/auth/*
    const v1 = this.api.root.addResource('v1');
    const auth = v1.addResource('auth');
    const authProxy = auth.addResource('{proxy+}');
    authProxy.addMethod('ANY', lambdaIntegration, {
      authorizationType: apigateway.AuthorizationType.NONE,
    });

    // Protected routes
    const protectedResources = ['upload', 'assets', 'folders', 'cache', 'api-keys', 'stats'];
    for (const resource of protectedResources) {
      const res = v1.addResource(resource);
      res.addMethod('ANY', lambdaIntegration, {
        authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      });
      const subProxy = res.addResource('{proxy+}');
      subProxy.addMethod('ANY', lambdaIntegration, {
        authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      });
    }

    new CfnOutput(this, 'ApiUrl', { value: this.api.url });
  }
}
