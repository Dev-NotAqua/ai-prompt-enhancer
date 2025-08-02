#!/usr/bin/env node
/**
 * Manifest validation script for AI Prompt Enhancer
 * Validates the extension manifest against Chrome Web Store requirements
 */

const fs = require('fs').promises;
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '..', 'manifest.json');

/**
 * Validate manifest structure and content
 */
async function validateManifest() {
  console.log('🔍 Validating manifest.json...\n');
  
  try {
    // Read and parse manifest
    const manifestContent = await fs.readFile(MANIFEST_PATH, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    // Validation tests
    const validations = [
      () => validateVersion(manifest),
      () => validateBasicFields(manifest),
      () => validatePermissions(manifest),
      () => validateContentScripts(manifest),
      () => validateBackground(manifest),
      () => validateAction(manifest),
      () => validateIcons(manifest),
      () => validateWebAccessibleResources(manifest)
    ];
    
    let passedTests = 0;
    let totalTests = validations.length;
    
    for (const validation of validations) {
      try {
        validation();
        passedTests++;
      } catch (error) {
        console.error(`❌ ${error.message}`);
      }
    }
    
    console.log(`\n📊 Validation Results: ${passedTests}/${totalTests} tests passed\n`);
    
    if (passedTests === totalTests) {
      console.log('✅ Manifest validation passed!');
      return true;
    } else {
      console.log('❌ Manifest validation failed!');
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Failed to read or parse manifest.json: ${error.message}`);
    return false;
  }
}

/**
 * Validate manifest version and basic structure
 */
function validateVersion(manifest) {
  if (manifest.manifest_version !== 3) {
    throw new Error('Manifest version must be 3');
  }
  console.log('✅ Manifest version 3 ✓');
}

/**
 * Validate required basic fields
 */
function validateBasicFields(manifest) {
  const required = ['name', 'version', 'description'];
  
  for (const field of required) {
    if (!manifest[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  // Validate version format
  if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    throw new Error('Version must be in format X.Y.Z');
  }
  
  // Validate name length
  if (manifest.name.length > 75) {
    throw new Error('Name must be 75 characters or less');
  }
  
  // Validate description length
  if (manifest.description.length > 132) {
    throw new Error('Description must be 132 characters or less');
  }
  
  console.log('✅ Basic fields valid ✓');
}

/**
 * Validate permissions
 */
function validatePermissions(manifest) {
  if (!Array.isArray(manifest.permissions)) {
    throw new Error('Permissions must be an array');
  }
  
  // Check for minimal permissions
  const allowedPermissions = ['storage', 'activeTab', 'scripting'];
  const invalidPermissions = manifest.permissions.filter(p => !allowedPermissions.includes(p));
  
  if (invalidPermissions.length > 0) {
    throw new Error(`Invalid permissions: ${invalidPermissions.join(', ')}`);
  }
  
  // Validate host permissions
  if (manifest.host_permissions && !Array.isArray(manifest.host_permissions)) {
    throw new Error('Host permissions must be an array');
  }
  
  console.log('✅ Permissions valid ✓');
}

/**
 * Validate content scripts
 */
function validateContentScripts(manifest) {
  if (!Array.isArray(manifest.content_scripts)) {
    throw new Error('Content scripts must be an array');
  }
  
  for (const script of manifest.content_scripts) {
    if (!script.matches || !Array.isArray(script.matches)) {
      throw new Error('Content script must have matches array');
    }
    
    if (!script.js || !Array.isArray(script.js)) {
      throw new Error('Content script must have js array');
    }
    
    // Validate match patterns
    for (const match of script.matches) {
      if (!match.startsWith('https://')) {
        throw new Error(`Invalid match pattern: ${match} (must use HTTPS)`);
      }
    }
  }
  
  console.log('✅ Content scripts valid ✓');
}

/**
 * Validate background script
 */
function validateBackground(manifest) {
  if (!manifest.background) {
    throw new Error('Background script is required');
  }
  
  if (!manifest.background.service_worker) {
    throw new Error('Background must use service_worker (Manifest V3)');
  }
  
  console.log('✅ Background script valid ✓');
}

/**
 * Validate action (popup)
 */
function validateAction(manifest) {
  if (!manifest.action) {
    throw new Error('Action is required');
  }
  
  if (!manifest.action.default_popup) {
    throw new Error('Action must have default_popup');
  }
  
  if (!manifest.action.default_title) {
    throw new Error('Action must have default_title');
  }
  
  console.log('✅ Action configuration valid ✓');
}

/**
 * Validate icons
 */
function validateIcons(manifest) {
  if (!manifest.icons) {
    throw new Error('Icons are required');
  }
  
  const requiredSizes = ['16', '32', '48', '128'];
  for (const size of requiredSizes) {
    if (!manifest.icons[size]) {
      throw new Error(`Missing icon size: ${size}x${size}`);
    }
  }
  
  // Validate action icons
  if (manifest.action.default_icon) {
    for (const size of requiredSizes) {
      if (!manifest.action.default_icon[size]) {
        throw new Error(`Missing action icon size: ${size}x${size}`);
      }
    }
  }
  
  console.log('✅ Icons valid ✓');
}

/**
 * Validate web accessible resources
 */
function validateWebAccessibleResources(manifest) {
  if (!manifest.web_accessible_resources) {
    console.log('⚠️  No web accessible resources defined');
    return;
  }
  
  if (!Array.isArray(manifest.web_accessible_resources)) {
    throw new Error('Web accessible resources must be an array');
  }
  
  for (const resource of manifest.web_accessible_resources) {
    if (!resource.resources || !Array.isArray(resource.resources)) {
      throw new Error('Web accessible resource must have resources array');
    }
    
    if (!resource.matches || !Array.isArray(resource.matches)) {
      throw new Error('Web accessible resource must have matches array');
    }
  }
  
  console.log('✅ Web accessible resources valid ✓');
}

/**
 * Generate manifest report
 */
async function generateReport() {
  try {
    const manifestContent = await fs.readFile(MANIFEST_PATH, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    console.log('\n📋 Manifest Report:');
    console.log(`   Name: ${manifest.name}`);
    console.log(`   Version: ${manifest.version}`);
    console.log(`   Manifest Version: ${manifest.manifest_version}`);
    console.log(`   Permissions: ${manifest.permissions?.length || 0}`);
    console.log(`   Host Permissions: ${manifest.host_permissions?.length || 0}`);
    console.log(`   Content Scripts: ${manifest.content_scripts?.length || 0}`);
    console.log(`   Description Length: ${manifest.description?.length || 0}/132`);
    
    if (manifest.content_scripts) {
      console.log('\n🌐 Supported Platforms:');
      manifest.content_scripts[0].matches.forEach(match => {
        const domain = match.replace('https://', '').replace('/*', '');
        console.log(`   • ${domain}`);
      });
    }
    
  } catch (error) {
    console.error(`Failed to generate report: ${error.message}`);
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateManifest().then(isValid => {
    if (isValid) {
      generateReport();
      process.exit(0);
    } else {
      process.exit(1);
    }
  });
}

module.exports = { validateManifest };