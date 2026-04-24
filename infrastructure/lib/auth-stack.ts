import { Stack, StackProps, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { MediaForgeConfig } from './config';

export interface AuthStackProps extends StackProps {
  usersTable?: dynamodb.Table;
  foldersTable?: dynamodb.Table;
  snsTopic?: sns.Topic;
}

export class AuthStack extends Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, config: MediaForgeConfig, props?: AuthStackProps) {
    super(scope, id, props);

    // Post-confirmation Lambda trigger
    const postConfirmFn = new lambdaNode.NodejsFunction(this, 'PostConfirmFn', {
      entry: path.join(__dirname, '../../packages/api/src/triggers/post-confirmation.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 256,
      timeout: Duration.seconds(10),
      environment: {
        USERS_TABLE: props?.usersTable?.tableName || '',
        FOLDERS_TABLE: props?.foldersTable?.tableName || '',
        SNS_TOPIC_ARN: props?.snsTopic?.topicArn || '',
        STAGE: config.stage,
      },
      bundling: {
        minify: true,
        sourceMap: false,
        forceDockerBundling: false,
        externalModules: [],
      },
    });

    // Grant permissions
    if (props?.usersTable) props.usersTable.grantWriteData(postConfirmFn);
    if (props?.foldersTable) props.foldersTable.grantWriteData(postConfirmFn);
    if (props?.snsTopic) props.snsTopic.grantPublish(postConfirmFn);

    this.userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: `mediaforge-${config.stage}-users`,
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      standardAttributes: {
        email: { required: true, mutable: false },
        fullname: { required: false, mutable: true },
      },
      lambdaTriggers: {
        postConfirmation: postConfirmFn,
      },
    });

    this.userPoolClient = this.userPool.addClient('DashboardClient', {
      authFlows: { userPassword: true },
      accessTokenValidity: Duration.hours(1),
      refreshTokenValidity: Duration.days(30),
      idTokenValidity: Duration.hours(1),
    });

    new CfnOutput(this, 'UserPoolId', { value: this.userPool.userPoolId });
    new CfnOutput(this, 'UserPoolClientId', { value: this.userPoolClient.userPoolClientId });
  }
}
