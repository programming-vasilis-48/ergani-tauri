const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const packageJson = require('./package.json');

// Configuration
const appName = 'Ergani Schedule Manager';
const version = packageJson.version || '1.0.0';
const platforms = ['windows', 'macos', 'linux'];

// Create build directory if it doesn't exist
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Helper functions
function log(message) {
  console.log(`\n\x1b[36m${message}\x1b[0m`);
}

function execute(command) {
  try {
    log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`\x1b[31mCommand failed: ${command}\x1b[0m`);
    console.error(error.toString());
    return false;
  }
}

function buildApp() {
  log('Building React application...');
  if (!execute('npm run build')) {
    throw new Error('Failed to build React application');
  }
}

function buildTauri(platform) {
  const platformFlag = platform ? `--target ${platform}` : '';
  log(`Building Tauri application for ${platform || 'current platform'}...`);
  
  if (!execute(`npm run tauri build ${platformFlag}`)) {
    throw new Error(`Failed to build Tauri application for ${platform || 'current platform'}`);
  }
}

function createWindowsInstaller() {
  log('Creating Windows installer with NSIS...');
  // Check if NSIS is installed
  try {
    execSync('makensis -VERSION', { stdio: 'ignore' });
  } catch (error) {
    console.error('\x1b[31mNSIS not found. Please install NSIS to create Windows installers.\x1b[0m');
    return false;
  }
  
  return execute('makensis installer.nsi');
}

function createMacDmg() {
  log('Creating macOS DMG...');
  // This would typically use create-dmg or similar tools
  // For this example, we'll assume the Tauri build creates the DMG
  return true;
}

function createLinuxPackages() {
  log('Creating Linux packages...');
  // This would typically create deb, rpm, AppImage, etc.
  // For this example, we'll assume the Tauri build creates the AppImage
  return true;
}

function copyArtifacts() {
  log('Copying build artifacts to build directory...');
  
  // This would copy the built artifacts to the build directory
  // Structure: build/{platform}/{artifacts}
  
  // For Windows
  if (platforms.includes('windows')) {
    const windowsDir = path.join(buildDir, 'windows');
    if (!fs.existsSync(windowsDir)) {
      fs.mkdirSync(windowsDir, { recursive: true });
    }
    
    // Copy Windows installer
    try {
      fs.copyFileSync(
        path.join(__dirname, `${appName} Setup ${version}.exe`),
        path.join(windowsDir, `${appName} Setup ${version}.exe`)
      );
    } catch (error) {
      console.warn(`Warning: Could not copy Windows installer: ${error.message}`);
    }
  }
  
  // For macOS
  if (platforms.includes('macos')) {
    const macosDir = path.join(buildDir, 'macos');
    if (!fs.existsSync(macosDir)) {
      fs.mkdirSync(macosDir, { recursive: true });
    }
    
    // Copy macOS DMG
    try {
      fs.copyFileSync(
        path.join(__dirname, 'src-tauri', 'target', 'release', 'bundle', 'dmg', `${appName}_${version}_x64.dmg`),
        path.join(macosDir, `${appName}_${version}.dmg`)
      );
    } catch (error) {
      console.warn(`Warning: Could not copy macOS DMG: ${error.message}`);
    }
  }
  
  // For Linux
  if (platforms.includes('linux')) {
    const linuxDir = path.join(buildDir, 'linux');
    if (!fs.existsSync(linuxDir)) {
      fs.mkdirSync(linuxDir, { recursive: true });
    }
    
    // Copy Linux AppImage
    try {
      fs.copyFileSync(
        path.join(__dirname, 'src-tauri', 'target', 'release', 'bundle', 'appimage', `${appName}_${version}_amd64.AppImage`),
        path.join(linuxDir, `${appName}_${version}.AppImage`)
      );
    } catch (error) {
      console.warn(`Warning: Could not copy Linux AppImage: ${error.message}`);
    }
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const targetPlatform = args[0];
  
  if (targetPlatform && !platforms.includes(targetPlatform)) {
    console.error(`\x1b[31mInvalid platform: ${targetPlatform}. Available platforms: ${platforms.join(', ')}\x1b[0m`);
    process.exit(1);
  }
  
  log(`Building ${appName} v${version}`);
  
  // Build React application
  buildApp();
  
  // Build for specific platform or all platforms
  if (targetPlatform) {
    buildForPlatform(targetPlatform);
  } else {
    // Build for the current platform by default
    const currentPlatform = getPlatform();
    buildForPlatform(currentPlatform);
  }
  
  log('Build completed successfully!');
}

function buildForPlatform(platform) {
  buildTauri(platform);
  
  switch (platform) {
    case 'windows':
      createWindowsInstaller();
      break;
    case 'macos':
      createMacDmg();
      break;
    case 'linux':
      createLinuxPackages();
      break;
  }
  
  copyArtifacts();
}

function getPlatform() {
  const platform = os.platform();
  if (platform === 'win32') return 'windows';
  if (platform === 'darwin') return 'macos';
  return 'linux';
}

main().catch(error => {
  console.error(`\x1b[31mBuild failed: ${error.message}\x1b[0m`);
  process.exit(1);
}); 