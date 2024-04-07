import { typescript, JsonPatch } from 'projen';
import {
  NodePackageManager,
  TypeScriptModuleResolution,
  TypeScriptJsxMode,
} from 'projen/lib/javascript';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'Portfolio Frontend',
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
  deps: ['react@^18', 'react-dom@^18', 'next@^14.1'],
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
  },
});

project.addScripts({
  preinstall: 'npx only-allow pnpm',
  lint: 'eslint . --fix --max-warnings 0',
  dev: 'next dev',
  build: 'next build',
  start: 'next start',
});

project.tryRemoveFile('.gitignore');
project.tryRemoveFile('.gitattributes');
project.tryRemoveFile('.mergify.yml');

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
