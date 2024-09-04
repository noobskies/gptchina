// custom-build.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    process.exit(1);
  }
}

// Install dependencies
runCommand('npm ci');

// Modify vite.config.ts to use esbuild instead of Rollup
const viteConfigPath = path.join(process.cwd(), 'client', 'vite.config.ts');
let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
viteConfig = viteConfig.replace(
  /import { defineConfig/,
  `import { defineConfig } from 'vite';\nimport { esbuildVersion } from 'vite';\n`
);
viteConfig = viteConfig.replace(
  /export default defineConfig\(/,
  `export default defineConfig(({ mode }) => (`
);
viteConfig = viteConfig.replace(
  /build: {/,
  `build: {
    rollupOptions: {
      plugins: [
        {
          name: 'use-esbuild',
          renderChunk(code, chunk, options) {
            if (options.format === 'es') {
              return {
                code: code.replace('import.meta', 'globalThis.import.meta'),
                map: null
              };
            }
            return null;
          }
        }
      ]
    },
    minify: 'esbuild',
  `
);
fs.writeFileSync(viteConfigPath, viteConfig);

// Update package.json to use the latest version of Vite
const packageJsonPath = path.join(process.cwd(), 'client', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.devDependencies.vite = "^5.1.1";
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Install the updated dependencies
runCommand('cd client && npm install');

// Build the web assets
runCommand('npm run build:web');

// Generate assets for Capacitor
runCommand('npm run generate-assets');

// Sync Capacitor
runCommand('npx cap sync');

// Run the actual build command
runCommand('npm run frontend');