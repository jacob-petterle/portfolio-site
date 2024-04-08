import { App, GitHubSourceCodeProvider } from '@aws-cdk/aws-amplify-alpha';
import { SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export type WebAppProps = StackProps & {
  repoOwner: string;
  repoName: string;
  githubOauthTokenSecretName?: string;
  basePath?: string;
};

const defaultWebAppProps = {
  githubOauthTokenSecretName: 'github-oauth-token',
  basePath: '/',
};

export class WebAppStack extends Stack {
  public app: App;

  constructor(scope: Construct, id: string, props: WebAppProps) {
    const mergedProps = { ...defaultWebAppProps, ...props };
    super(scope, id, props);

    this.app = new App(this, 'amplify-frontend', {
      appName: 'portfolio-site',
      sourceCodeProvider: new GitHubSourceCodeProvider({
        owner: mergedProps.repoOwner,
        repository: mergedProps.repoName,
        oauthToken: SecretValue.secretsManager(
          mergedProps.githubOauthTokenSecretName,
        ),
      }),
      autoBranchCreation: {
        patterns: ['main'],
      },
      autoBranchDeletion: true,
      environmentVariables: {
        AMPLIFY_MONOREPO_APP_ROOT: mergedProps.basePath,
        AMPLIFY_DIFF_DEPLOY: 'true',
        AMPLIFY_DIFF_DEPLOY_ROOT: mergedProps.basePath + '/dist',
      },
    });
  }
}
