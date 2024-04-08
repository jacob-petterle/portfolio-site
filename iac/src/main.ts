import { App } from 'aws-cdk-lib';
import { WebAppStack } from './WebAppStack';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new WebAppStack(app, 'portfolio-stack', {
  env: devEnv,
  repoOwner: 'jacob-petterle',
  repoName: 'portfolio-site',
  githubOauthTokenSecretName: 'github-oauth-token',
  basePath: 'portfolio-site/frontend',
});

app.synth();
