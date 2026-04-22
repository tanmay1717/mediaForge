import {
  CognitoIdentityProviderClient, SignUpCommand, ConfirmSignUpCommand,
  InitiateAuthCommand, ForgotPasswordCommand, ConfirmForgotPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { AuthTokens } from '@media-forge/core';

const cognito = new CognitoIdentityProviderClient({});
const CLIENT_ID = process.env.COGNITO_CLIENT_ID!;

/**
 * Cognito SDK wrapper for auth operations.
 *
 * TODO for each method:
 * - signup: SignUpCommand with email + password + name attribute
 * - confirmSignup: ConfirmSignUpCommand with verification code
 * - login: InitiateAuthCommand with USER_PASSWORD_AUTH flow → return tokens
 * - refreshToken: InitiateAuthCommand with REFRESH_TOKEN_AUTH flow
 * - forgotPassword: ForgotPasswordCommand → sends reset code to email
 * - confirmForgotPassword: ConfirmForgotPasswordCommand with code + new password
 */
export class CognitoService {
  async signup(email: string, password: string, name: string): Promise<{ userSub: string }> {
    const result = await cognito.send(new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name },
      ],
    }));
    return { userSub: result.UserSub! };
  }

  async confirmSignup(email: string, code: string): Promise<void> {
    await cognito.send(new ConfirmSignUpCommand({
      ClientId: CLIENT_ID, Username: email, ConfirmationCode: code,
    }));
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    const result = await cognito.send(new InitiateAuthCommand({
      ClientId: CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: { USERNAME: email, PASSWORD: password },
    }));
    const auth = result.AuthenticationResult!;
    return {
      accessToken: auth.AccessToken!, idToken: auth.IdToken!,
      refreshToken: auth.RefreshToken!, expiresIn: auth.ExpiresIn!,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const result = await cognito.send(new InitiateAuthCommand({
      ClientId: CLIENT_ID,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: { REFRESH_TOKEN: refreshToken },
    }));
    const auth = result.AuthenticationResult!;
    return {
      accessToken: auth.AccessToken!, idToken: auth.IdToken!,
      refreshToken, expiresIn: auth.ExpiresIn!,
    };
  }

  async forgotPassword(email: string): Promise<void> {
    await cognito.send(new ForgotPasswordCommand({ ClientId: CLIENT_ID, Username: email }));
  }

  async confirmForgotPassword(email: string, code: string, newPassword: string): Promise<void> {
    await cognito.send(new ConfirmForgotPasswordCommand({
      ClientId: CLIENT_ID, Username: email,
      ConfirmationCode: code, Password: newPassword,
    }));
  }
}
