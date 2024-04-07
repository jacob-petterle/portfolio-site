import { typescript, JsonPatch } from 'projen';
import {
  NodePackageManager,
  TypeScriptModuleResolution,
  TypeScriptJsxMode,
} from 'projen/lib/javascript';

const README_TEMPLATE = `
# Project Title

A brief one or two sentence description of the project.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

## Installation

Step-by-step instructions on how to install and set up the project locally. This may include:

- Prerequisites (e.g., Node.js version, package manager)
- Cloning the repository
- Installing dependencies
- Setting up environment variables
- Running a development server

## Usage

Instructions on how to use the project, including:

- Main features and functionality
- Examples or code snippets
- Configuration options
- Deployment instructions

## Contributing

Guidelines for contributing to the project, such as:

- Reporting issues
- Opening pull requests
- Code style and conventions
- Testing instructions

## Credits

List of contributors, resources, libraries, or assets used in the project.

## License

Information about the license under which the project is distributed.
`;

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'Portfolio Frontend',
  description: 'Frontend app for Jacob Petterle\'s portfolio',
  projenrcTs: true,
  readme: {
    filename: 'README.md',
    contents: README_TEMPLATE,
  },
  projenVersion: '0.80.19',
  autoMerge: true,
  autoMergeOptions: {},
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
    exclude: ['node_modules'],
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
project.try

const tsConfig = project.tryFindObjectFile('tsconfig.json');
if (tsConfig) {
  tsConfig.patch(JsonPatch.add('/compilerOptions/plugins', [{ name: 'next' }]));
} else {
  throw new Error('Could not find tsconfig.json');
}

project.synth();
