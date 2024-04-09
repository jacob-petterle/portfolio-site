import {
  App,
  GitHubSourceCodeProvider,
  Platform,
} from '@aws-cdk/aws-amplify-alpha';
import { SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
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
      platform: Platform.WEB_COMPUTE,
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: '1.0',
        applications: [
          {
            appRoot: mergedProps.basePath,
            frontend: {
              phases: {
                preBuild: {
                  commands: ['npm install -g pnpm', 'pnpm install'],
                },
                build: {
                  commands: ['pnpm run build'],
                },
              },
              artifacts: {
                baseDirectory: '.next',
                files: ['**/*'],
              },
              cache: {
                paths: ['node_modules/**/*'],
              },
            },
          },
        ],
      }),
      sourceCodeProvider: new GitHubSourceCodeProvider({
        owner: mergedProps.repoOwner,
        repository: mergedProps.repoName,
        oauthToken: SecretValue.secretsManager(
          mergedProps.githubOauthTokenSecretName,
        ),
      }),
      autoBranchCreation: {
        pullRequestPreview: true,
      },
      autoBranchDeletion: true,
      environmentVariables: {
        AMPLIFY_MONOREPO_APP_ROOT: mergedProps.basePath,
        AMPLIFY_DIFF_DEPLOY: 'true',
        AMPLIFY_DIFF_DEPLOY_ROOT: mergedProps.basePath + '/.next',
      },
    });

    this.app.addBranch('main', {
      branchName: 'main',
    });
  }
}
