import { typescript, JsonPatch } from 'projen';
import {
  NodePackageManager,
  TypeScriptModuleResolution,
  TypeScriptJsxMode,
} from 'projen/lib/javascript';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: '@portfolio/frontend',
  description: "Frontend app for Jacob Petterle's portfolio",
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
  deps: [
    'react@^18',
    'react-dom@^18',
    'next@^14.1',
    '@nextui-org/button@^2',
    '@nextui-org/code@^2',
    '@nextui-org/input@^2',
    '@nextui-org/kbd@^2',
    '@nextui-org/link@^2',
    '@nextui-org/navbar@^2',
    '@nextui-org/snippet@^2',
    '@nextui-org/switch@^2',
    '@nextui-org/system@^2',
    '@nextui-org/theme@^2',
    '@react-aria/ssr@^3.8',
    '@react-aria/visually-hidden@^3.8',
    '@types/node@^20',
    '@types/react@^18',
    '@types/react-dom@^18',
    'autoprefixer@^10.4',
    'clsx@^2',
    'eslint@^8',
    'eslint-config-next@^14',
    'framer-motion@^10.16',
    'intl-messageformat@^10.5',
    'next-themes@^0.2',
    'postcss@^8.4',
    'tailwind-variants@^0.1',
    'tailwindcss@^3.3',
    'typescript@^5',
  ],
  packageManager: NodePackageManager.PNPM,
  pnpmVersion: '8.15.6',
  jest: true,
  testdir: 'tests',
  tsconfig: {
    compilerOptions: {
      rootDir: '.',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: TypeScriptModuleResolution.BUNDLER,
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: TypeScriptJsxMode.PRESERVE,
      incremental: true,
      paths: {
        '@/*': ['./src/*'],
      },
    },
    include: [
      'next-env.d.ts',
      'src/**/*.ts',
      'src/**/*.tsx',
      '.next/types/**/*.ts',
    ],
  },
  // projen uses the dev tsconfig when reading the the .projenrc.ts file,
  tsconfigDev: {
    compilerOptions: {
      module: 'CommonJS',
    },
    include: ['tailwind.config.ts'],
  },
});

project.addScripts({
  preinstall: 'npx only-allow pnpm',
  dev: 'next dev',
  build: 'next build',
  start: 'next start',
  typecheck: 'tsc --noEmit -p tsconfig.json',
  lint: 'eslint . --fix',
});

project.tryRemoveFile('.gitignore');
project.tryRemoveFile('.gitattributes');
project.tryRemoveFile('.mergify.yml');

project.npmrc.addConfig('public-hoist-pattern[]', '*@nextui-org/*');

const tsConfig = project.tryFindObjectFile('tsconfig.json');
if (tsConfig) {
  tsConfig.patch(JsonPatch.add('/compilerOptions/plugins', [{ name: 'next' }]));
} else {
  throw new Error('Could not find tsconfig.json');
}

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
