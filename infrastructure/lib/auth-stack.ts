import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { MediaForgeConfig } from './config';

/**
 * AuthStack — AWS Cognito User Pool + App Client.
 *
 * TODO:
 * - Create a Cognito User Pool with:
 *   - Email as the sign-in alias
 *   - Self-signup enabled
 *   - Email verification (Cognito sends the code)
 *   - Password policy: min 8 chars, require uppercase+lowercase+number+symbol
 *   - Standard attributes: email (required), name (optional)
 *
 * - Create an App Client with:
 *   - USER_PASSWORD_AUTH and REFRESH_TOKEN_AUTH flows
 *   - Access token expiry: 1 hour
 *   - Refresh token expiry: 30 days
 *   - No client secret (public client for the SPA dashboard)
 *
 * - Create a post-confirmation Lambda trigger:
 *   - Creates a user record in DynamoDB
 *   - Creates a root folder for the user
 *   - Generates a default API key
 *   - Publishes USER_CREATED event to SNS
 *
 * - Export: userPoolId, userPoolArn, clientId
 */
export class AuthStack extends Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, config: MediaForgeConfig, props?: StackProps) {
    super(scope, id, props);

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
    });

    this.userPoolClient = this.userPool.addClient('DashboardClient', {
      authFlows: { userPassword: true },
      accessTokenValidity: { amount: 1, unit: 'hours' } as any,
      refreshTokenValidity: { amount: 30, unit: 'days' } as any,
    });

    // TODO: Add post-confirmation Lambda trigger
    // this.userPool.addTrigger(cognito.UserPoolOperation.POST_CONFIRMATION, postConfirmFn);

    new CfnOutput(this, 'UserPoolId', { value: this.userPool.userPoolId });
    new CfnOutput(this, 'UserPoolClientId', { value: this.userPoolClient.userPoolClientId });
  }
}
