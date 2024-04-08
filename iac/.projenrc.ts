import { awscdk, JsonPatch } from "projen";
import {
  NodePackageManager,
} from 'projen/lib/javascript';

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: "2.136.0",
  defaultReleaseBranch: "main",
  name: "Portfolio site IAC",
  projenrcTs: true,
  projenVersion: '0.80.19',
  license: 'MIT',
  copyrightOwner: 'Jacob Petterle',
  devDeps: [
    'prettier@^3.2',
    'postcss@^8.4',
    'tailwindcss@^3.4',
    '@types/react@^18',
    'autoprefixer@^10.4',
  ],
  deps: ['react@^18', 'react-dom@^18', 'next@^14.1'],
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
    JsonPatch.add('/parserOptions/project', './tsconfig.dev.json'),
  );
} else {
  throw new Error('Could not find .eslintrc.json');
}

project.synth();

// remove src directory forcefully using typescript file system
const fs = require('fs');
fs.rmdirSync('.github', { recursive: true });