/**
 * Shared infrastructure configuration.
 * Values come from cdk.json context or environment variables.
 */
export interface MediaForgeConfig {
  stage: string;           // "dev" | "prod"
  cdnDomain: string;       // "cdn.yourdomain.com"
  dashboardDomain: string;  // "app.yourdomain.com"
  sesFromEmail: string;     // "noreply@yourdomain.com"
  region: string;
  account: string;
}

import { App } from 'aws-cdk-lib';

export function getConfig(app: App): MediaForgeConfig {
  return {
    stage: app.node.tryGetContext('stage') || 'dev',
    cdnDomain: app.node.tryGetContext('cdnDomain') || 'cdn.tanmayshetty.com',
    dashboardDomain: app.node.tryGetContext('dashboardDomain') || 'app.tanmayshetty.com',
    sesFromEmail: app.node.tryGetContext('sesFromEmail') || 'noreply@tanmayshetty.com',
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
    account: process.env.CDK_DEFAULT_ACCOUNT || '',
  };
}
