# Neuro Genius Mobile App - APK Build Guide

This project is configured for **Expo EAS**. Follow these steps to generate your Android APK.

### 1. Prerequisites
Ensure you have the EAS CLI installed globally:
```bash
npm install -g eas-cli
```

### 2. Login to Expo
If you don't have an account, create one at [expo.dev](https://expo.dev).
```bash
eas login
```

### 3. Initialize EAS (First Time Only)
Run this command in the `mobile-app` directory:
```bash
eas build:configure
```

### 4. Build the APK
To generate a standalone APK for testing, run:
```bash
eas build -p android --profile preview
```

### 5. Download the APK
Once the build is complete, Expo will provide a URL to download your `.apk` file. You can install this directly on any Android device.

---

### Backend Sync
The app is currently configured to connect to:
`https://neuro-genius-gamma.vercel.app` (Vercel)

To change the backend URL, edit:
`mobile-app/src/services/api.js`
