import { awscdk, JsonPatch } from 'projen';
import { NodePackageManager } from 'projen/lib/javascript';

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.136.0',
  defaultReleaseBranch: 'main',
  name: 'Portfolio site IAC',
  projenrcTs: true,
  projenVersion: '0.80.19',
  license: 'MIT',
  copyrightOwner: 'Jacob Petterle',
  deps: ['@aws-cdk/aws-amplify-alpha@2.39.1-alpha.0'],
  packageManager: NodePackageManager.PNPM,
  pnpmVersion: '8.15.6',
  jest: true,
  testdir: 'tests',
});

project.tryRemoveFile('.gitignore');
project.tryRemoveFile('.gitattributes');
project.tryRemoveFile('.mergify.yml');

// patch the eslint file to extend teh top level eslint.json config and add the parser option
// to use the tsconfig in this directory
const eslintConfig = project.tryFindObjectFile('.eslintrc.json');
if (eslintConfig) {
  eslintConfig.patch(JsonPatch.add('/extends', ['../.eslintrc.json']));
  eslintConfig.patch(
    // not sure why we need to go from the root here, but it works
    JsonPatch.add('/parserOptions/project', './iac/tsconfig.dev.json'),
  );
} else {
  throw new Error('Could not find .eslintrc.json');
}

project.synth();

// remove src directory forcefully using typescript file system
const fs = require('fs');
fs.rmdirSync('.github', { recursive: true });
