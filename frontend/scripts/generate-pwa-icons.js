/**
 * PWA Icon Generation Script for CareerNest
 * 
 * This script converts the CareerNest favicon.svg to PNG icons
 * Required for production PWA deployment
 * 
 * Prerequisites:
 * npm install sharp --save-dev
 * 
 * Usage:
 * node scripts/generate-pwa-icons.js
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '..', 'public');
const svgPath = join(publicDir, 'favicon.svg');

// Read the SVG file
const svgBuffer = readFileSync(svgPath);

async function generateIcons() {
  console.log('🎨 Generating CareerNest PWA icons...\n');

  // Standard icons (no padding)
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(join(publicDir, 'pwa-192x192.png'));
  console.log('✅ Generated pwa-192x192.png');

  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(join(publicDir, 'pwa-512x512.png'));
  console.log('✅ Generated pwa-512x512.png');

  // Maskable icons (with 20% safe zone padding)
  // For maskable, we need to add padding around the logo
  const padding192 = Math.floor(192 * 0.1); // 10% padding on each side = 20% safe zone
  const logoSize192 = 192 - (padding192 * 2);

  await sharp(svgBuffer)
    .resize(logoSize192, logoSize192)
    .extend({
      top: padding192,
      bottom: padding192,
      left: padding192,
      right: padding192,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toFile(join(publicDir, 'pwa-maskable-192x192.png'));
  console.log('✅ Generated pwa-maskable-192x192.png (with safe zone)');

  const padding512 = Math.floor(512 * 0.1);
  const logoSize512 = 512 - (padding512 * 2);

  await sharp(svgBuffer)
    .resize(logoSize512, logoSize512)
    .extend({
      top: padding512,
      bottom: padding512,
      left: padding512,
      right: padding512,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toFile(join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('✅ Generated pwa-maskable-512x512.png (with safe zone)');

  console.log('\n✨ All PWA icons generated successfully!');
  console.log('📦 Run "npm run build" to include them in your production build.');
}

generateIcons().catch(err => {
  console.error('❌ Error generating icons:', err);
  process.exit(1);
});
