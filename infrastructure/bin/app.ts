import * as cdk from 'aws-cdk-lib'
import { QredApiStack } from '../lib/qred-api-stack'

const app = new cdk.App()

// Stage is passed via: cdk deploy --context stage=prod
// Falls back to 'dev' if not provided
const stage = app.node.tryGetContext('stage') ?? 'dev'

new QredApiStack(app, `QredApiStack-${stage}`, {
  stage,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region:  'eu-north-1',
  },
  description: `Qred API — Lambda + API Gateway (${stage})`,
})
