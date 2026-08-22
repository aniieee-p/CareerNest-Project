# PWA Icon Generation Instructions

The CareerNest PWA requires PNG icons. Use the existing favicon.svg as the base.

## Required Icons:
1. pwa-192x192.png - 192x192px
2. pwa-512x512.png - 512x512px  
3. pwa-maskable-192x192.png - 192x192px (with safe zone)
4. pwa-maskable-512x512.png - 512x512px (with safe zone)

## Generation Method:
Use any of these tools to convert favicon.svg to PNG:
- Online: https://realfavicongenerator.net/
- ImageMagick: `convert -density 300 -background none favicon.svg -resize 192x192 pwa-192x192.png`
- Inkscape: Export as PNG at desired resolution

## Maskable Icons:
Add 20% padding/safe zone around the logo for maskable versions.

## Temporary Fallback:
For now, the manifest references these icons. They should be created before production deployment.
