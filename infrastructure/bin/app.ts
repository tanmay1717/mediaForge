#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { getConfig } from '../lib/config';
import { AuthStack } from '../lib/auth-stack';
import { StorageStack } from '../lib/storage-stack';
import { ApiStack } from '../lib/api-stack';
import { CdnStack } from '../lib/cdn-stack';
import { EmailStack } from '../lib/email-stack';
import { TransformStack } from '../lib/transform-stack';
import { DashboardHostingStack } from '../lib/dashboard-hosting-stack';

const app = new cdk.App();
const config = getConfig(app);
const env = { account: config.account, region: config.region };

// Storage first (tables + bucket)
const storage = new StorageStack(app, `MediaForge-Storage-${config.stage}`, config, { env });

// Email (SNS topic needed by Auth)
const email = new EmailStack(app, `MediaForge-Email-${config.stage}`, config, { env });

// Auth (needs tables + SNS topic for post-confirmation trigger)
const auth = new AuthStack(app, `MediaForge-Auth-${config.stage}`, config, {
  env,
  usersTable: storage.usersTable,
  foldersTable: storage.foldersTable,
  snsTopic: email.topic,
});

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

// Keep old Cdn stack (Lambda@Edge replicas still cleaning up)
const cdn = new CdnStack(app, `MediaForge-Cdn-${config.stage}`, config, {
  env,
  bucket: storage.bucket,
});

const transform = new TransformStack(app, `MediaForge-Transform-${config.stage}`, config, {
  env,
  bucket: storage.bucket,
});

const dashboard = new DashboardHostingStack(app, `MediaForge-Dashboard-${config.stage}`, config, { env });

// Dependencies
auth.addDependency(storage);
auth.addDependency(email);
api.addDependency(auth);
api.addDependency(storage);
cdn.addDependency(storage);
transform.addDependency(storage);

app.synth();
