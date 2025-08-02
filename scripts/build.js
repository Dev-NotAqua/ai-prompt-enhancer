#!/usr/bin/env node
/**
 * Build script for AI Prompt Enhancer
 * Creates a production-ready extension package
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const BUILD_DIR = path.join(__dirname, '..', 'dist');
const ROOT_DIR = path.join(__dirname, '..');

/**
 * Copy files to build directory
 */
async function copyFiles() {
  console.log('📁 Copying files...');
  
  // Create build directory
  await fs.mkdir(BUILD_DIR, { recursive: true });
  
  // Files to copy
  const filesToCopy = [
    'manifest.json',
    'background.js',
    'content.js',
    'popup.html',
    'popup.js',
    'popup.css',
    'options.html',
    'options.js',
    'options.css',
    'LICENSE',
    'README.md'
  ];
  
  // Directories to copy
  const dirsToCopy = [
    'src',
    'data',
    'icons'
  ];
  
  // Copy files
  for (const file of filesToCopy) {
    const srcPath = path.join(ROOT_DIR, file);
    const destPath = path.join(BUILD_DIR, file);
    
    try {
      await fs.copyFile(srcPath, destPath);
      console.log(`  ✓ ${file}`);
    } catch (error) {
      if (await fileExists(srcPath)) {
        console.warn(`  ⚠ Warning: Could not copy ${file}`);
      }
    }
  }
  
  // Copy directories
  for (const dir of dirsToCopy) {
    const srcPath = path.join(ROOT_DIR, dir);
    const destPath = path.join(BUILD_DIR, dir);
    
    try {
      await copyDir(srcPath, destPath);
      console.log(`  ✓ ${dir}/`);
    } catch (error) {
      console.warn(`  ⚠ Warning: Could not copy ${dir}/`);
    }
  }
}

/**
 * Copy directory recursively
 */
async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Check if file exists
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Minify CSS files
 */
async function minifyCSS() {
  console.log('🎨 Minifying CSS...');
  
  const cssFiles = [
    'popup.css',
    'options.css',
    'src/ui/overlay.css',
    'src/ui/panel.css'
  ];
  
  for (const cssFile of cssFiles) {
    const filePath = path.join(BUILD_DIR, cssFile);
    
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const minified = minifyCSS(content);
      await fs.writeFile(filePath, minified);
      console.log(`  ✓ ${cssFile}`);
    } catch (error) {
      console.warn(`  ⚠ Warning: Could not minify ${cssFile}`);
    }
  }
}

/**
 * Simple CSS minification
 */
function minifyCSSContent(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
    .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
    .replace(/;\s*/g, ';') // Remove spaces after semicolon
    .replace(/,\s*/g, ',') // Remove spaces after comma
    .trim();
}

/**
 * Create ZIP package
 */
async function createZip() {
  console.log('📦 Creating ZIP package...');
  
  const version = JSON.parse(await fs.readFile(path.join(ROOT_DIR, 'package.json'), 'utf8')).version;
  const zipName = `ai-prompt-enhancer-v${version}.zip`;
  const zipPath = path.join(ROOT_DIR, zipName);
  
  try {
    // Change to build directory and create zip
    process.chdir(BUILD_DIR);
    execSync(`zip -r "${zipPath}" .`, { stdio: 'inherit' });
    console.log(`  ✓ Created ${zipName}`);
  } catch (error) {
    console.error('  ✗ Failed to create ZIP package');
    throw error;
  }
}

/**
 * Validate the build
 */
async function validateBuild() {
  console.log('✅ Validating build...');
  
  const requiredFiles = [
    'manifest.json',
    'background.js',
    'content.js'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(BUILD_DIR, file);
    if (!(await fileExists(filePath))) {
      throw new Error(`Required file missing: ${file}`);
    }
  }
  
  // Validate manifest
  const manifestPath = path.join(BUILD_DIR, 'manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  
  if (manifest.manifest_version !== 3) {
    throw new Error('Manifest must be version 3');
  }
  
  if (!manifest.version) {
    throw new Error('Manifest must have version');
  }
  
  console.log('  ✓ All required files present');
  console.log('  ✓ Manifest is valid');
}

/**
 * Clean build directory
 */
async function clean() {
  console.log('🧹 Cleaning build directory...');
  
  try {
    await fs.rm(BUILD_DIR, { recursive: true, force: true });
    console.log('  ✓ Build directory cleaned');
  } catch (error) {
    // Directory might not exist, which is fine
  }
}

/**
 * Main build function
 */
async function build() {
  console.log('🚀 Building AI Prompt Enhancer Extension\n');
  
  try {
    await clean();
    await copyFiles();
    await minifyCSS();
    await validateBuild();
    await createZip();
    
    console.log('\n✅ Build completed successfully!');
    console.log(`📍 Build output: ${BUILD_DIR}`);
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run build if this script is executed directly
if (require.main === module) {
  build();
}

module.exports = { build, clean, validateBuild };