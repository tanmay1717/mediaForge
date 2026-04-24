import {
  CognitoUserPool, CognitoUser, CognitoUserAttribute,
  AuthenticationDetails, CognitoUserSession,
} from 'amazon-cognito-identity-js';

const userPool = new CognitoUserPool({
  UserPoolId: 'us-east-1_nbhp025Zg',
  ClientId: '1f658f7qsn4avvt39m3ihi636v',
});

export function getUserPool() { return userPool; }

export function signUp(email: string, password: string, name: string): Promise<string> {
  const attributes = [new CognitoUserAttribute({ Name: 'name', Value: name })];
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributes, [], (err, result) => {
      if (err) reject(err);
      else resolve(result?.userSub || '');
    });
  });
}

export function confirmSignUp(email: string, code: string): Promise<void> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err) => { if (err) reject(err); else resolve(); });
  });
}

export function signIn(email: string, password: string): Promise<CognitoUserSession> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  user.setAuthenticationFlowType('USER_PASSWORD_AUTH');
  const authDetails = new AuthenticationDetails({ Username: email, Password: password });
  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err),
    });
  });
}

export function signOut(): void { userPool.getCurrentUser()?.signOut(); }

export function getSession(): Promise<CognitoUserSession | null> {
  const user = userPool.getCurrentUser();
  if (!user) return Promise.resolve(null);
  return new Promise((resolve) => {
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session?.isValid()) resolve(null);
      else resolve(session);
    });
  });
}

export function getAccessToken(): Promise<string | null> {
  return getSession().then(s => s?.getAccessToken().getJwtToken() ?? null);
}
