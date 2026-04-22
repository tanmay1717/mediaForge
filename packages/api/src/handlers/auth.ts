import { RequestContext } from '../middleware/request-context';
import { CognitoService } from '../services/cognito-service';
import { createSuccessResponse, createErrorResponse } from '../middleware/error-handler';
import { APIGatewayProxyResult } from 'aws-lambda';
import { SignupRequest, LoginRequest } from '@media-forge/core';

const cognito = new CognitoService();

/**
 * Auth handlers — public endpoints (no JWT required).
 *
 * TODO:
 * - signup: Validate email/password/name, call cognito.signup
 * - confirmSignup: Validate email/code, call cognito.confirmSignup
 * - login: Validate email/password, call cognito.login, return tokens
 * - refresh: Validate refreshToken, call cognito.refreshToken
 * - forgotPassword: Validate email, call cognito.forgotPassword
 * - confirmPassword: Validate email/code/newPassword, call cognito.confirmForgotPassword
 */
export async function handleSignup(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const { email, password, name } = ctx.body as SignupRequest;
  // TODO: Validate input fields
  const result = await cognito.signup(email, password, name);
  return createSuccessResponse(result, 201);
}

export async function handleLogin(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const { email, password } = ctx.body as LoginRequest;
  const tokens = await cognito.login(email, password);
  return createSuccessResponse(tokens);
}

export async function handleRefresh(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const { refreshToken } = ctx.body as { refreshToken: string };
  const tokens = await cognito.refreshToken(refreshToken);
  return createSuccessResponse(tokens);
}

export async function handleForgotPassword(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const { email } = ctx.body as { email: string };
  await cognito.forgotPassword(email);
  return createSuccessResponse({ message: 'Reset code sent' });
}

export async function handleConfirmPassword(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const { email, code, newPassword } = ctx.body as { email: string; code: string; newPassword: string };
  await cognito.confirmForgotPassword(email, code, newPassword);
  return createSuccessResponse({ message: 'Password reset successful' });
}
