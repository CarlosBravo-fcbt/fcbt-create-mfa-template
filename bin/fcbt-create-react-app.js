#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const repoName = args[0];
// const appNameIndex = args.findIndex(arg => arg === '--app-name');
// const appName = appNameIndex !== -1 ? args[appNameIndex + 1] : 'default-app';
// const useTypeScript = args.includes('--typescript');
// const uiOnly = args.includes('--ui-only');
// const apiOnly = args.includes('--api-only');
// const includeParentFolder = args.includes('--include-parent-folder');

if (!repoName) {
  console.error('Please provide a repository name --repo-name <name>');
  process.exit(1);
}

let appName = repoName;
let imageName = repoName.replace('fvhome', '').replace(/-/g, '');

const currentDir = process.cwd();
let projectDir = path.join(currentDir, repoName);

// Create project directory
fs.mkdirSync(projectDir, { recursive: true });

// Navigate to project directory
process.chdir(projectDir);


const createFolderStructure = (baseDir, folders) => {
  folders.forEach(folder => {
    const fullPath = path.join(baseDir, folder);
    fs.mkdirSync(fullPath, { recursive: true });
  });
};

// Determine which folders to create
let folders = ['devops', 'devops/cue', 'src'];
createFolderStructure(projectDir, folders);

const uiDir = path.join(projectDir, `src`);
process.chdir(uiDir);

console.log('Creating UI project...');
console.log('When prompted, set the same name you choose at the beginning, IMPORTANT!!!');


const { spawnSync } = require('child_process');
spawnSync('npx', ['create-mf-app@1.1.8', '--name', 'ui'], { stdio: 'inherit', shell: true });


// Function to replace placeholders in a file
function replaceInFile(filePath, appName) {
  try {
    let data = fs.readFileSync(filePath, 'utf8'); // Read file synchronously
    let appNameUpper = appName.replace(/-/g, '_').toUpperCase();
    data = data.replace(/{{appName}}/g, appName).replace(/{{appName_upper}}/g, appNameUpper).replace(/{{imageName}}/g, imageName);
    fs.writeFileSync(filePath, data, 'utf8'); // Write file synchronously
    console.log(`Updated file: ${filePath}`);
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err);
  }
}
fs.renameSync(path.join(uiDir, appName), path.join(uiDir, 'ui'));

// Determine which folders to create
folders = ['src/api', 'src/ui/test'];
createFolderStructure(projectDir, folders);

// Copy and replace placeholders in CUE file
const cueFilePath = path.join(projectDir, 'devops/cue', `${appName}.cue`);
fs.copyFileSync(path.join(__dirname, 'default.cue'), cueFilePath);
replaceInFile(cueFilePath, appName);

// Copy and replace placeholders in build yaml config
const buildFilePath = path.join(projectDir, 'devops', 'build.yaml');
fs.copyFileSync(path.join(__dirname, 'build.yaml'), buildFilePath);
replaceInFile(buildFilePath, appName);

// Copy and replace placeholders in build yaml config
const deployFilePath = path.join(projectDir, 'devops', 'deploy.yaml');
fs.copyFileSync(path.join(__dirname, 'deploy.yaml'), deployFilePath);
replaceInFile(deployFilePath, appName);

// Copy and replace placeholders in Webpack config
const webpackFilePath = path.join(projectDir, 'src/ui', 'webpack.config.js');
fs.copyFileSync(path.join(__dirname, 'webpack.config.js'), webpackFilePath);
replaceInFile(webpackFilePath, appName);

// Copy .npmrc file to project directory to avoid issues with npm install
fs.copyFileSync(path.join(__dirname, '.npmrc'), path.join(projectDir + '/src/ui', '.npmrc'));
fs.copyFileSync(path.join(__dirname, 'jest.config.js'), path.join(projectDir + '/src/ui', 'jest.config.js'));
fs.copyFileSync(path.join(__dirname, '.env'), path.join(projectDir + '/src/ui', '.env'));
fs.copyFileSync(path.join(__dirname, '.gitignore'), path.join(projectDir + '/src/ui', '.gitignore'));
fs.copyFileSync(path.join(__dirname, 'setupTests.ts'), path.join(projectDir + '/src/ui/src', 'setupTests.ts'));


// Change directory to the UI project folder
const uiProjectDir = path.join(uiDir, 'ui');
console.log('UI project directory:', uiProjectDir);
// Change to the UI project directory
process.chdir(uiProjectDir);

// Install UI dependencies
const uiDeps = [
  'react-router-dom',
  'react-redux',
  'redux-micro-frontend',
  '@reduxjs/toolkit',
];
execSync(`npm install ${uiDeps.join(' ')}`, { stdio: 'inherit' });

// Install TypeScript-related dependencies if using TypeScript

const tsDeps = [
  '@types/react',
  '@types/react-dom',
  '@types/react-redux',
  'dotenv',
  'ts-node',
  'sass-loader',
  'sass'
];
execSync(`npm install -D ${tsDeps.join(' ')}`, { stdio: 'inherit' });

// Install Jest dependencies for adding unit tests

const jestDeps = [
  'jest',
  'jest-environment-jsdom',
  '@testing-library/react',
  '@testing-library/jest-dom',
  '@testing-library/user-event',
  '@types/jest',
];
execSync(`npm install -D ${jestDeps.join(' ')}`, { stdio: 'inherit' });


// Update package.json 
const fcbtDeps = [
  '@fcbt-react/fvhome-auth',
];
execSync(`npm install ${fcbtDeps.join(' ')}`, { stdio: 'inherit' });

fs.rmSync(path.join(uiProjectDir, 'webpack.config.js'), { force: true });

// Add initial folder structure for 
const uiFolderStructure = path.join(uiProjectDir,'src');

// Create folder structure
const uiFolders = ["components", "pages", "store", "styles", "utils", "hooks", "services", "types",];
createFolderStructure(uiFolderStructure, uiFolders);

console.log(`Project setup complete for ${appName}!`);
console.log(`
Project structure:
${repoName}/
├── devops/
│   ├── build.yaml
│   ├── cue/
│   │   └── ${appName}.cue
│   └── deploy.yaml
├── src/
│   ├── ui/
│   │   └── (React project files)
`);

// Usage:
// create-custom-react-app app-name 