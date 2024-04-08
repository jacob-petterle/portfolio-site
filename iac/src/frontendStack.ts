import { App, GitHubSourceCodeProvider } from '@aws-cdk/aws-amplify-alpha';
import { SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export type FrontendStackProps = StackProps & {
  repoOwner: string;
  repoName: string;
  oauthTokenSecretName?: string;
};

const defaultFrontendStackProps = {
  oauthTokenSecretName: 'github-oauth-token',
};

export class FrontendStack extends Stack {
  public app: App;

  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    const mergedProps = { ...defaultFrontendStackProps, ...props };
    super(scope, id, props);

    this.app = new App(this, 'amplify-frontend', {
      appName: 'portfolio-site',
      sourceCodeProvider: new GitHubSourceCodeProvider({
        owner: mergedProps.repoOwner,
        repository: mergedProps.repoName,
        // oauthToken: mergedProps.oauthTokenSecretName,
        oauthToken: SecretValue.secretsManager(
          mergedProps.oauthTokenSecretName,
        ),
      }),
      autoBranchCreation: {
        patterns: ['main'],
      },
      autoBranchDeletion: true,
    });
  }
}
