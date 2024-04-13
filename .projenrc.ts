import { typescript, awscdk, JsonPatch } from 'projen';
import {
  NodePackageManager,
  TypeScriptJsxMode,
  TypeScriptModuleResolution,
} from 'projen/lib/javascript';
import { TypeScriptProjectOptions } from 'projen/lib/typescript';

type ProjectOptions = TypeScriptProjectOptions & {
  scriptOverrides?: { [key: string]: string };
};

function configureProject(
  options: ProjectOptions,
): typescript.TypeScriptProject {
  const project = new typescript.TypeScriptProject({
    ...options,
    license: 'MIT',
    copyrightOwner: 'Jacob Petterle',
    defaultReleaseBranch: 'main',
    autoMerge: true,
    autoMergeOptions: {},
    projenrcTs: true,
    projenVersion: '0.80.19',
    packageManager: NodePackageManager.PNPM,
    pnpmVersion: '8.15.6',
    prettier: true,
  });

  if (options.scriptOverrides) {
    Object.entries(options.scriptOverrides).forEach(([key, value]) => {
      project.setScript(key, value);
    });
  }

  return project;
}

const rootProject = configureProject({
  defaultReleaseBranch: 'main',
  name: '@portfolio/web-app',
  description: 'My personal portfolio site',
  testdir: '.',
  devDeps: [
    'eslint@9.0',
    'nx@^18.2',
    'typescript@^5.4',
    '@nx/eslint@^18.2',
    '@nx/jest@^18.2',
    '@nx/next@^18.2',
    '@nx/plugin@^18.2',
  ],
  deps: [],
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
  prettierOptions: {
    settings: {
      singleQuote: true,
      tabWidth: 2,
    },
  },
  scriptOverrides: {
    lint: 'nx run-many --target=lint --all && npx eslint .projenrc.ts --fix',
    build: 'nx run-many --target=build --all',
    typecheck:
      'nx run-many --target=typecheck --all && npx tsc --noEmit -p tsconfig.dev.json',
    package: 'nx run-many --target=package --all',
    test: 'nx run-many --target=test --all',
    frontend: 'nx dev @portfolio/frontend',
  },
});
rootProject.gitignore.exclude('.pnpm-store', '.nx', '.next', '**/**/cdk.out');

rootProject.compileTask.updateStep(0, {
  exec: 'pnpm run build',
});
rootProject.testTask.updateStep(1, {
  exec: 'pnpm lint',
});
rootProject.packageTask.reset('pnpm package');
rootProject.npmrc.addConfig('node-linker', 'hoisted');
rootProject.eslint?.addRules({
  'quote-props': 'off',
});

const frontend = configureProject({
  parent: rootProject,
  outdir: 'frontend',
  defaultReleaseBranch: 'main',
  name: '@portfolio/frontend',
  description: "Frontend app for Jacob Petterle's portfolio",
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
  scriptOverrides: {
    preinstall: 'npx only-allow pnpm',
    dev: 'next dev',
    build: 'next build',
    start: 'next start',
    typecheck: 'npx tsc --noEmit -p tsconfig.json',
    lint: 'npx eslint --fix "**/*.{js,jsx,ts,tsx}"',
  },
});

frontend.npmrc.addConfig('public-hoist-pattern[]', '*@nextui-org/*');

const tsConfig = frontend.tryFindObjectFile('tsconfig.json');
if (tsConfig) {
  tsConfig.patch(JsonPatch.add('/compilerOptions/plugins', [{ name: 'next' }]));
} else {
  throw new Error('Could not find tsconfig.json');
}

// patch the eslint file to extend teh top level eslint.json config and add the parser option
// to use the tsconfig in this directory
let eslintConfig = frontend.tryFindObjectFile('.eslintrc.json');
if (eslintConfig) {
  eslintConfig.patch(JsonPatch.add('/extends', ['../.eslintrc.json']));
  eslintConfig.patch(
    JsonPatch.add('/parserOptions/project', './tsconfig.dev.json'),
  );
} else {
  throw new Error('Could not find .eslintrc.json');
}

const backend = configureProject({
  parent: rootProject,
  defaultReleaseBranch: 'main',
  outdir: 'backend',
  name: '@portfolio/backend',
  description: "Backend for Jacob Petterle's personal portfolio site",
  devDeps: ['prettier@^3.2'],
  jest: true,
  testdir: 'tests',
  scriptOverrides: {
    preinstall: 'npx only-allow pnpm',
    dev: 'next dev',
    build: 'next build',
    start: 'next start',
    typecheck: 'npx tsc --noEmit -p tsconfig.json',
    lint: 'npx eslint --fix "**/*.{js,jsx,ts,tsx}"',
  },
});

// patch the eslint file to extend teh top level eslint.json config and add the parser option
// to use the tsconfig in this directory
eslintConfig = backend.tryFindObjectFile('.eslintrc.json');
if (eslintConfig) {
  eslintConfig.patch(JsonPatch.add('/extends', ['../.eslintrc.json']));
  eslintConfig.patch(
    JsonPatch.add('/parserOptions/project', './tsconfig.dev.json'),
  );
} else {
  throw new Error('Could not find .eslintrc.json');
}

const iac = new awscdk.AwsCdkTypeScriptApp({
  parent: rootProject,
  outdir: 'iac',
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

iac.addScripts({
  typecheck: 'npx tsc --noEmit -p tsconfig.json',
  lint: 'npx eslint --fix "**/*.{js,jsx,ts,tsx}"',
});

// patch the eslint file to extend teh top level eslint.json config and add the parser option
// to use the tsconfig in this directory
eslintConfig = iac.tryFindObjectFile('.eslintrc.json');
if (eslintConfig) {
  eslintConfig.patch(JsonPatch.add('/extends', ['../.eslintrc.json']));
  eslintConfig.patch(
    // not sure why we need to go from the root here, but it works
    JsonPatch.add('/parserOptions/project', './tsconfig.dev.json'),
  );
} else {
  throw new Error('Could not find .eslintrc.json');
}

rootProject.synth();
