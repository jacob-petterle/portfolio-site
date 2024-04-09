import { awscdk, JsonPatch } from 'projen';
import { NodePackageManager } from 'projen/lib/javascript';

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.136.0',
  defaultReleaseBranch: 'main',
  name: '@portfolio/iac',
  projenrcTs: true,
  projenVersion: '0.80.19',
  license: 'MIT',
  copyrightOwner: 'Jacob Petterle',
  deps: ['@aws-cdk/aws-amplify-alpha@2.136.0-alpha.0'],
  packageManager: NodePackageManager.PNPM,
  pnpmVersion: '8.15.6',
  jest: true,
  testdir: 'tests',
});

project.addScripts({
  typecheck: 'tsc --noEmit -p tsconfig.json',
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
    JsonPatch.add('/parserOptions/project', './tsconfig.dev.json'),
  );
} else {
  throw new Error('Could not find .eslintrc.json');
}

project.synth();
