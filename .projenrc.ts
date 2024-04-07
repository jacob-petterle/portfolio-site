import { typescript } from 'projen';
import { NodePackageManager } from 'projen/lib/javascript';

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
  name: 'name',
  description: 'A cool typescript project',
  projenrcTs: true,
  readme: {
    filename: 'README.md',
    contents: README_TEMPLATE,
  },
  autoMerge: true,
  autoMergeOptions: {},
  license: 'MIT',
  copyrightOwner: 'Jacob Petterle',
  devDeps: ['projen@^0.75', 'pnpm@^8.0', 'prettier@^3.2'],
  packageManager: NodePackageManager.PNPM,
  eslintOptions: {
    dirs: ['src'],
    prettier: true,
  },
  prettier: true,
  prettierOptions: {
    settings: {
      singleQuote: true,
    },
  },
  jest: true,
});

project.addScripts({
  preinstall: 'npx only-allow pnpm',
  lint: 'eslint . --fix --max-warnings 0',
});

project.gitignore.exclude('.pnpm-store/');

project.synth();
