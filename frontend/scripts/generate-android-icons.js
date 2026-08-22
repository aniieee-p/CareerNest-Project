/**
 * Android Launcher Icon Generation Script for CareerNest
 * 
 * Generates all required Android launcher icon densities from favicon.svg
 * 
 * Prerequisites:
 * npm install sharp (already installed)
 * 
 * Usage:
 * node scripts/generate-android-icons.js
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '..', 'public');
const androidResDir = join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
const svgPath = join(publicDir, 'favicon.svg');

// Android icon densities
const densities = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

// Read the SVG file
const svgBuffer = readFileSync(svgPath);

async function generateAndroidIcons() {
  console.log('🎨 Generating CareerNest Android launcher icons...\n');

  for (const [folder, size] of Object.entries(densities)) {
    const outputDir = join(androidResDir, folder);
    
    // Create directory if it doesn't exist
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Generate ic_launcher.png (standard launcher icon)
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(outputDir, 'ic_launcher.png'));
    
    console.log(`✅ Generated ${folder}/ic_launcher.png (${size}x${size})`);

    // Generate ic_launcher_round.png (round launcher icon for API 25+)
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(outputDir, 'ic_launcher_round.png'));
    
    console.log(`✅ Generated ${folder}/ic_launcher_round.png (${size}x${size})`);

    // Generate ic_launcher_foreground.png (adaptive icon foreground for API 26+)
    // For adaptive icons, we need to add padding (safe zone)
    const adaptivePadding = Math.floor(size * 0.25); // 25% padding for safe zone
    const logoSize = size - (adaptivePadding * 2);

    await sharp(svgBuffer)
      .resize(logoSize, logoSize)
      .extend({
        top: adaptivePadding,
        bottom: adaptivePadding,
        left: adaptivePadding,
        right: adaptivePadding,
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
      })
      .png()
      .toFile(join(outputDir, 'ic_launcher_foreground.png'));
    
    console.log(`✅ Generated ${folder}/ic_launcher_foreground.png (${size}x${size} with safe zone)`);
  }

  console.log('\n✨ All Android launcher icons generated successfully!');
  console.log('📦 Run "npm run build && npx cap sync android" to update the app.');
}

generateAndroidIcons().catch(err => {
  console.error('❌ Error generating Android icons:', err);
  process.exit(1);
});
