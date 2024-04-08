import { typescript } from 'projen';
import { NodePackageManager } from 'projen/lib/javascript';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'Portfolio Site for Jacob Petterle',
  description: 'My personal portfolio site',
  projenrcTs: true,
  projenVersion: '0.80.19',
  autoMerge: true,
  autoMergeOptions: {},
  testdir: '.', // we don't have tests in the top level
  license: 'MIT',
  copyrightOwner: 'Jacob Petterle',
  devDeps: ['eslint@9.0', 'nx@^18.2', 'typescript@^5.4'],
  packageManager: NodePackageManager.PNPM,
  github: true,
  pnpmVersion: '8.15.6',
  disableTsconfig: true,
  eslintOptions: {
    dirs: ['**/*.ts', '**/*.tsx'],
    prettier: true,
    ignorePatterns: [
      '*.js',
      '*.d.ts',
      '**/node_modules/**',
      '*.generated.ts',
      'coverage',
    ],
  },
  prettier: true,
  prettierOptions: {
    settings: {
      singleQuote: true,
      tabWidth: 2,
    },
  },
});

project.gitignore.exclude('.pnpm-store', '.nx', '.next');

const removeScripts = (
  scriptNames: string[],
  proj: typescript.TypeScriptProject,
) => {
  scriptNames.forEach((scriptName) => {
    proj.removeScript(scriptName);
  });
};
const scriptsToRemove = [
  'build',
  'bump',
  'clobber',
  'compile',
  'default',
  'eject',
  'eslint',
  'package',
  'post-compile',
  'post-upgrade',
  'pre-compile',
  'release',
  'test',
  'test:watch',
  'unbump',
  'upgrade',
  'watch',
  'projen',
];
removeScripts(scriptsToRemove, project);

project.synth();
// remove src directory forcefully using typescript file system
const fs = require('fs');
fs.rmdirSync('src', { recursive: true });
