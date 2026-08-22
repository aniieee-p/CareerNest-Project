# CareerNest Android App (Capacitor)

## Overview
CareerNest has been successfully converted into a native Android application using Capacitor. The app bundles the existing React + Vite PWA inside a native Android shell.

## Architecture

```
CareerNest Android App
         ↓
   Capacitor WebView
         ↓
 React + Vite + PWA Build
         ↓
   HTTPS Backend API
         ↓
      MongoDB
```

## Capacitor Configuration

### App Details
- **App Name**: CareerNest
- **App ID**: com.careernest.app
- **Package Name**: com.careernest.app
- **Version Code**: 1
- **Version Name**: 1.0
- **Web Directory**: dist/

### Android Scheme
- Uses HTTPS scheme for better compatibility with web features

## Build & Run Workflow

### 1. Build Web App
```bash
npm run build
```

### 2. Sync to Android
```bash
npx cap sync android
```

### 3. Open in Android Studio
```bash
npx cap open android
```

### Quick Command (All-in-One)
```bash
npm run android
```

## Android Project Structure

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── AndroidManifest.xml
│   │       ├── assets/
│   │       │   └── public/          (Web build copied here)
│   │       ├── java/
│   │       │   └── com/careernest/app/
│   │       │       └── MainActivity.java
│   │       └── res/
│   │           ├── values/
│   │           │   └── strings.xml   (App name)
│   │           └── mipmap/           (App icons)
│   └── build.gradle
├── capacitor-cordova-android-plugins/
├── build.gradle
├── gradle.properties
└── settings.gradle
```

## Android Permissions

Currently only requests:
- **INTERNET** - Required for API calls

No unnecessary permissions requested.

## Features

### ✅ Working Features
- React + Vite web app bundles correctly
- PWA service worker and manifest preserved
- Navigation with React Router
- All CareerNest pages accessible
- Responsive UI maintained
- Hamburger menu functional
- API connectivity configured

### 🔧 Capacitor-Specific Adaptations
- **Install PWA Prompt**: Disabled inside Capacitor (no redundant "Install CareerNest" when already in native app)
- **PWA Update Prompt**: Still functional for web updates
- **Offline Indicator**: Works in both web and Android

## API Configuration

The Android app uses the same `VITE_API_URL` configuration as the web app.

### Development
- Uses `.env` file with `VITE_API_URL=http://localhost:3000/api/v1`
- Requires running backend on same machine/network

### Production
- Must set `VITE_API_URL` to production HTTPS endpoint before building
- Example: `VITE_API_URL=https://api.careernest.com/api/v1`

**IMPORTANT**: Never use `localhost` or `127.0.0.1` for production Android builds.

## Google OAuth

Google OAuth configuration uses `VITE_GOOGLE_CLIENT_ID`.

For Android app to support Google OAuth:
1. The OAuth client ID must be configured for Android in Google Cloud Console
2. SHA-1 fingerprint of Android signing key must be added
3. Package name `com.careernest.app` must be registered

## Testing

### Android Emulator
1. Build the web app: `npm run build`
2. Sync to Android: `npx cap sync android`
3. Open Android Studio: `npx cap open android`
4. Select an emulator (API 21+ recommended)
5. Click Run ▶️

### Physical Device
1. Enable Developer Options on Android device
2. Enable USB Debugging
3. Connect device via USB
4. Follow same build/sync/open steps
5. Select your device in Android Studio
6. Click Run ▶️

## Debugging

### Web Console in Android
Use Chrome DevTools to debug the WebView:
1. Connect Android device or start emulator
2. Run the app
3. Open Chrome browser on your computer
4. Navigate to `chrome://inspect`
5. Find CareerNest app WebView
6. Click "inspect"

### Android Logs
```bash
npx cap run android -l
```

Or use Android Studio Logcat panel.

## Common Issues

### Issue: Blank screen on Android
**Solution**: Check that `npm run build` succeeded and `dist/` folder has content.

### Issue: API calls fail
**Solution**: Verify `VITE_API_URL` points to accessible network address (not localhost for physical devices).

### Issue: Permission error during sync
**Solution**: Close Android Studio, manually delete `android/app/src/main/assets/public`, then run `npx cap copy android`.

### Issue: Google OAuth doesn't work
**Solution**: Configure Android OAuth client in Google Cloud Console with app's SHA-1 fingerprint.

## Building Release APK

### 1. Generate Signing Key
```bash
keytool -genkey -v -keystore careernest-release-key.keystore -alias careernest -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing in Android Studio
1. Open `android/` folder in Android Studio
2. Build → Generate Signed Bundle / APK
3. Select APK
4. Create or select existing keystore
5. Fill in key details
6. Select "release" build variant
7. Build

### 3. Test Release Build
Install the generated APK on a test device before distribution.

## App Distribution

### Google Play Store
1. Create Google Play Console account
2. Create app listing
3. Complete store listing content
4. Upload release APK/AAB
5. Set up content rating
6. Set pricing & distribution
7. Submit for review

**Note**: Google Play requires App Bundle (.aab) format for new apps.

## Version Management

Current version defined in `android/app/build.gradle`:
- **versionCode**: 1 (increment for each release)
- **versionName**: "1.0" (semantic version)

Update both when releasing new versions.

## Security

### ✅ Security Measures
- No secrets bundled in Android app
- No API credentials in source code
- Only INTERNET permission requested
- HTTPS enforced for production APIs
- Web build security inherited (CSP, etc.)

### ⚠️ Important Notes
- Never commit signing keystore to version control
- Never hardcode API keys in source code
- Always use environment variables for configuration
- Test OAuth flows before production release

## File Uploads

Resume upload functionality uses standard web file picker through WebView. Works on Android without additional configuration.

## Responsive Design

All Phase 1 responsive design features are preserved:
- Mobile layouts: 375px - 767px ✅
- Tablet layouts: 768px - 1023px ✅
- Desktop layouts: 1024px+ ✅
- Hamburger menu: Functional ✅
- No horizontal scrolling ✅

## Android Back Button

Capacitor automatically handles Android back button:
- Navigates back in React Router history
- Exits app when no history remains
- Can be customized via Capacitor plugins if needed

## Status Bar

Capacitor automatically manages Android status bar. No custom configuration needed for CareerNest.

## Splash Screen

Default Capacitor splash screen is configured. To customize:
1. Install `@capacitor/splash-screen` plugin
2. Create splash screen images
3. Configure in `capacitor.config.json`

## App Icons

Android app uses default Capacitor icons. To customize with CareerNest branding:

### Option 1: Manual
Replace icon files in `android/app/src/main/res/mipmap-*/ic_launcher.png`

### Option 2: Automated
Use Android Image Asset Studio in Android Studio:
1. Right-click `res/` folder
2. New → Image Asset
3. Select icon type (Launcher Icons)
4. Choose source image (use CareerNest logo)
5. Generate

## Progressive Web App Features

### In Android App
- ✅ Service worker: Functions normally
- ✅ Offline caching: Works
- ✅ Update notifications: Shows for web content updates
- ❌ Install prompt: Hidden (app already installed)

### On Web
- ✅ All PWA features remain functional
- ✅ Installable from browser
- ✅ Works independently of Android app

## Development Workflow

1. **Make changes** to React/Vite source code
2. **Build**: `npm run build`
3. **Sync**: `npx cap sync android`
4. **Test**: Run in Android Studio

Repeat as needed. Hot reload not available in Capacitor workflow.

## Next Steps

- [ ] Customize Android app icons with CareerNest branding
- [ ] Configure custom splash screen
- [ ] Test on multiple Android devices
- [ ] Configure production API endpoints
- [ ] Set up Google OAuth for Android
- [ ] Generate release signing key
- [ ] Build release APK
- [ ] Test release build thoroughly
- [ ] Prepare Google Play Store listing
- [ ] Submit to Google Play Store

## iOS Support

iOS support can be added later by running:
```bash
npx cap add ios
```

Requires macOS with Xcode installed.

## Support

For Capacitor-specific issues:
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor GitHub](https://github.com/ionic-team/capacitor)
- [Capacitor Community Discord](https://discord.gg/UPYYRhtyzp)

For CareerNest-specific issues:
- Check browser console via `chrome://inspect`
- Verify API configuration
- Test PWA version in browser first

## License

CareerNest Android App © 2026
