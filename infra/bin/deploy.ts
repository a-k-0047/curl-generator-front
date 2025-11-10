#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import { ReactSiteStack } from '../lib/react-site-stack';

const app = new cdk.App();

// contextからアプリ名・環境名を取得
const appName = app.node.tryGetContext("appName") || "my-react-app";
const envName = app.node.tryGetContext("envName") || "dev";

new ReactSiteStack(app, `${appName}-${envName}-Stack`, {
  env: { region: "ap-northeast-1" },
});
