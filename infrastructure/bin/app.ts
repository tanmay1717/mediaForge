#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { getConfig } from '../lib/config';
import { AuthStack } from '../lib/auth-stack';
import { StorageStack } from '../lib/storage-stack';
import { ApiStack } from '../lib/api-stack';
import { CdnStack } from '../lib/cdn-stack';
import { EmailStack } from '../lib/email-stack';
import { DashboardHostingStack } from '../lib/dashboard-hosting-stack';

const app = new cdk.App();
const config = getConfig(app);

const env = { account: config.account, region: config.region };

/**
 * Stack dependency chain:
 *   AuthStack
 *       ↓
 *   StorageStack
 *       ↓
 *   ApiStack (depends on Auth + Storage)
 *       ↓
 *   CdnStack (depends on Storage)
 *       ↓
 *   EmailStack (depends on Auth)
 *       ↓
 *   DashboardHostingStack
 *
 * `cdk deploy --all` respects this order automatically.
 */

const auth = new AuthStack(app, `MediaForge-Auth-${config.stage}`, config, { env });
const storage = new StorageStack(app, `MediaForge-Storage-${config.stage}`, config, { env });
const email = new EmailStack(app, `MediaForge-Email-${config.stage}`, config, { env });

const api = new ApiStack(app, `MediaForge-Api-${config.stage}`, config, {
  env,
  userPool: auth.userPool,
  bucket: storage.bucket,
  assetsTable: storage.assetsTable,
  foldersTable: storage.foldersTable,
  usersTable: storage.usersTable,
  apiKeysTable: storage.apiKeysTable,
  snsTopicArn: email.topic.topicArn,
  cognitoClientId: auth.userPoolClient.userPoolClientId,
});

const cdn = new CdnStack(app, `MediaForge-Cdn-${config.stage}`, config, {
  env,
  bucket: storage.bucket,
});

const dashboard = new DashboardHostingStack(app, `MediaForge-Dashboard-${config.stage}`, config, { env });

// Explicit dependencies
api.addDependency(auth);
api.addDependency(storage);
cdn.addDependency(storage);

app.synth();
