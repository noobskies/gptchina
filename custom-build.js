// custom-build.js
const { execSync } = require('child_process');
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

// Build the web assets
runCommand('npm run build:web');

// Generate assets for Capacitor
runCommand('npm run generate-assets');

// Sync Capacitor
runCommand('npx cap sync');

// Platform-specific builds
if (os.platform() === 'darwin' && os.arch() === 'arm64') {
  console.log('Running on macOS ARM64, installing specific dependencies...');
  runCommand('npm install @rollup/rollup-darwin-arm64 --no-save');
} else {
  console.log('Not running on macOS ARM64, skipping specific dependencies.');
}

// Run the actual build command
runCommand('npm run frontend');