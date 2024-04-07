import { typescript } from 'projen';
import { NodePackageManager } from 'projen/lib/javascript';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'name',
  description: 'A cool typescript project',
  projenrcTs: true,
  projenVersion: '0.80.19',
  autoMerge: true,
  autoMergeOptions: {},
  license: 'MIT',
  copyrightOwner: 'Jacob Petterle',
  devDeps: ['eslint@9.0', 'nx@^18.2', 'typescript@^5.4'],
  packageManager: NodePackageManager.PNPM,
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
    },
  },
});

project.gitignore.exclude('.pnpm-store', '.nx', '.next');
project.synth();
