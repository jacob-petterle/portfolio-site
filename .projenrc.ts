import { typescript } from 'projen';
import { NodePackageManager } from 'projen/lib/javascript';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: '@portfolio/web-app',
  description: 'My personal portfolio site',
  projenrcTs: true,
  projenVersion: '0.80.19',
  autoMerge: true,
  autoMergeOptions: {},
  testdir: '.', // we don't have tests in the top level
  license: 'MIT',
  copyrightOwner: 'Jacob Petterle',
  devDeps: [
    'eslint@9.0',
    'nx@^18.2',
    'typescript@^5.4',
    '@nx/eslint@^18.2',
    '@nx/jest@^18.2',
    '@nx/next@^18.2',
    '@nx/plugin@^18.2',
  ],
  packageManager: NodePackageManager.PNPM,
  github: true,
  pnpmVersion: '8.15.6',
  disableTsconfig: true,
  eslintOptions: {
    dirs: ['.'],
    prettier: true,
    ignorePatterns: [
      '*.js',
      '*.d.ts',
      '**/node_modules/**',
      '*.generated.ts',
      'coverage',
    ],
  },
  tsconfigDev: {
    include: [],
  },
  prettier: true,
  prettierOptions: {
    settings: {
      singleQuote: true,
      tabWidth: 2,
    },
  },
});

project.gitignore.exclude('.pnpm-store', '.nx', '.next', '**/**/cdk.out');

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

project.addScripts({
  projen: 'nx run-many --target=projen --all && projen',
  lint: 'nx run-many --target=lint --all && npx eslint .projenrc.ts --fix',
  build: 'nx run-many --target=build --all',
  typecheck:
    'nx run-many --target=typecheck --all && npx tsc --noEmit -p tsconfig.dev.json',
  package: 'nx run-many --target=package --all',
  test: 'nx run-many --target=test --all',
  frontend: 'nx dev @portfolio/frontend',
});

project.compileTask.updateStep(0, {
  exec: 'pnpm run build',
});

project.testTask.updateStep(1, {
  exec: 'pnpm lint',
});

project.packageTask.reset('pnpm package');

project.npmrc.addConfig('node-linker', 'hoisted');

project.synth();
// remove src directory forcefully using typescript file system
const fs = require('fs');
fs.rmdirSync('src', { recursive: true });
