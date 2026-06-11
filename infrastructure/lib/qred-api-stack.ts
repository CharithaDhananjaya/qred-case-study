import * as path from 'path'
import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as ssm from 'aws-cdk-lib/aws-ssm'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import type { Construct } from 'constructs'

interface QredApiStackProps extends cdk.StackProps {
  stage: string
}

export class QredApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: QredApiStackProps) {
    super(scope, id, props)

    const { stage } = props

    // -------------------------------------------------------------------------
    // SSM — secrets (resolved at deploy time via CloudFormation dynamic refs)
    //
    // valueForStringParameter returns a CloudFormation {{resolve:ssm:...}} token.
    // The actual value is never visible in the synthesised template — CloudFormation
    // fetches it from SSM at deploy time when creating/updating the Lambda function.
    // -------------------------------------------------------------------------
    const ssmPath = (key: string) => `/qred/${stage}/${key}`

    const dbHost     = ssm.StringParameter.valueForStringParameter(this, ssmPath('db/host'))
    const dbName     = ssm.StringParameter.valueForStringParameter(this, ssmPath('db/name'))
    const dbUser     = ssm.StringParameter.valueForStringParameter(this, ssmPath('db/user'))
    const dbPassword = ssm.StringParameter.valueForStringParameter(this, ssmPath('db/password'))
    const jwtSecret  = ssm.StringParameter.valueForStringParameter(this, ssmPath('jwt-secret'))

    // -------------------------------------------------------------------------
    // VPC — looked up at synth time using SSM values
    //
    // CDK needs real values (not CloudFormation tokens) to construct VPC/SG/Subnet
    // objects at synthesis time. valueFromLookup fetches from SSM immediately
    // when you run `cdk synth` or `cdk deploy` — it requires valid AWS credentials
    // at that point and caches the result in cdk.context.json.
    //
    // One extra SSM parameter compared to serverless.yml: /vpc/id
    // Add it once: aws ssm put-parameter --name /qred/dev/vpc/id --value vpc-xxxx --type String
    // -------------------------------------------------------------------------
    const vpcId      = ssm.StringParameter.valueFromLookup(this, ssmPath('vpc/id'))
    const lambdaSgId = ssm.StringParameter.valueFromLookup(this, ssmPath('vpc/lambda-sg-id'))
    const subnet1Id  = ssm.StringParameter.valueFromLookup(this, ssmPath('vpc/subnet-id-1'))
    const subnet2Id  = ssm.StringParameter.valueFromLookup(this, ssmPath('vpc/subnet-id-2'))

    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { vpcId })

    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this, 'LambdaSG', lambdaSgId, { mutable: false },
    )

    const vpcSubnets: ec2.SubnetSelection = {
      subnets: [
        ec2.Subnet.fromSubnetId(this, 'Subnet1', subnet1Id),
        ec2.Subnet.fromSubnetId(this, 'Subnet2', subnet2Id),
      ],
    }

    // -------------------------------------------------------------------------
    // Shared Lambda configuration
    //
    // All four functions share the same entry file (handler.ts), runtime,
    // environment, VPC placement, and bundling options. Only the exported
    // handler name differs per function.
    // -------------------------------------------------------------------------
    const sharedBundling: lambdaNodejs.BundlingOptions = {
      minify:    false,
      sourceMap: true,
      target:    'node24',
      // Resolve the @qred/shared workspace package at bundle time.
      // CDK's NodejsFunction uses esbuild under the hood — this is the CDK
      // equivalent of the `alias` option in serverless-esbuild.
      esbuildArgs: {
        '--alias:@qred/shared': path.resolve(__dirname, '../../packages/shared/index.ts'),
      },
    }

    const sharedEnv: Record<string, string> = {
      NODE_ENV:    'production',
      DB_HOST:     dbHost,
      DB_PORT:     '5432',
      DB_NAME:     dbName,
      DB_USER:     dbUser,
      DB_PASSWORD: dbPassword,
      JWT_SECRET:  jwtSecret,
    }

    const handlerEntry = path.resolve(__dirname, '../../apps/backend/src/handler.ts')

    const makeFn = (id: string, handler: string) =>
      new lambdaNodejs.NodejsFunction(this, id, {
        entry:          handlerEntry,
        handler,
        runtime:        lambda.Runtime.NODEJS_20_X,
        environment:    sharedEnv,
        vpc,
        vpcSubnets,
        securityGroups: [securityGroup],
        bundling:       sharedBundling,
        timeout:        cdk.Duration.seconds(30),
        memorySize:     256,
      })

    const dashboardFn   = makeFn('DashboardFn',   'dashboardHandler')
    const transactionsFn = makeFn('TransactionsFn', 'transactionsHandler')
    const invoiceFn     = makeFn('InvoiceFn',     'invoiceHandler')
    const activateCardFn = makeFn('ActivateCardFn', 'activateCardHandler')

    // -------------------------------------------------------------------------
    // API Gateway — REST API (v1)
    //
    // Matches the behaviour of serverless.yml's `http` events, which map to
    // API Gateway REST API. CORS is configured at the API level so every
    // resource automatically gets an OPTIONS preflight handler.
    // -------------------------------------------------------------------------
    const api = new apigateway.RestApi(this, 'QredApi', {
      restApiName: `qred-api-${stage}`,
      description: 'Qred credit card dashboard API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
      deployOptions: {
        stageName: stage,
      },
    })

    // GET /dashboard
    api.root
      .addResource('dashboard')
      .addMethod('GET', new apigateway.LambdaIntegration(dashboardFn))

    // GET /transactions
    api.root
      .addResource('transactions')
      .addMethod('GET', new apigateway.LambdaIntegration(transactionsFn))

    // GET /invoice
    api.root
      .addResource('invoice')
      .addMethod('GET', new apigateway.LambdaIntegration(invoiceFn))

    // POST /cards/activate
    const cards = api.root.addResource('cards')
    cards
      .addResource('activate')
      .addMethod('POST', new apigateway.LambdaIntegration(activateCardFn))

    // -------------------------------------------------------------------------
    // Outputs
    //
    // The API Gateway URL is printed after every deploy and exported as a
    // CloudFormation output. Set it as NEXT_PUBLIC_API_URL in the frontend.
    // -------------------------------------------------------------------------
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value:       api.url,
      description: 'API Gateway base URL — set as NEXT_PUBLIC_API_URL in frontend',
      exportName:  `QredApiUrl-${stage}`,
    })
  }
}
