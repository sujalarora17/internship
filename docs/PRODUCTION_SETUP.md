# Production Setup Guide

This guide covers setting up the WhatsApp-style notifications app for production use with full native module support.

## Overview

The current Expo managed implementation provides a solid foundation, but for production-level background notifications and full-screen call interfaces, you'll need to either:

1. **Use Expo Development Build** (Recommended)
2. **Eject to bare React Native**

## Option 1: Expo Development Build (Recommended)

### Prerequisites
- Expo CLI 6.0+
- EAS CLI: `npm install -g @expo/eas-cli`
- Expo account

### Setup Steps

1. **Install development build dependencies:**
   ```bash
   expo install expo-dev-client
   ```

2. **Configure app.json for native modules:**
   ```json
   {
     "expo": {
       "plugins": [
         "expo-dev-client",
         "@react-native-firebase/app",
         "@react-native-firebase/messaging"
       ]
     }
   }
   ```

3. **Install Firebase dependencies:**
   ```bash
   npm install @react-native-firebase/app @react-native-firebase/messaging
   ```

4. **Create development build:**
   ```bash
   eas build --profile development --platform android
   ```

## Option 2: Eject to Bare React Native

### Ejecting Process

1. **Backup your project**
2. **Eject from Expo:**
   ```bash
   expo eject
   ```
3. **Follow the post-eject setup** in the generated README

## Firebase Cloud Messaging Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Add Android app with package name
4. Download `google-services.json`

### 2. Configure Android

1. **Place `google-services.json` in `android/app/`**

2. **Update `android/build.gradle`:**
   ```gradle
   dependencies {
       classpath 'com.google.gms:google-services:4.3.15'
   }
   ```

3. **Update `android/app/build.gradle`:**
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   
   dependencies {
       implementation 'com.google.firebase:firebase-messaging:23.1.2'
   }
   ```

### 3. Native Android Module Integration

1. **Add notification module to `MainApplication.java`:**
   ```java
   @Override
   protected List<ReactPackage> getPackages() {
       return Arrays.<ReactPackage>asList(
           new MainReactPackage(),
           new NotificationPackage() // Add this
       );
   }
   ```

2. **Create notification package:**
   ```java
   // NotificationPackage.java
   public class NotificationPackage implements ReactPackage {
       @Override
       public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
           return Arrays.<NativeModule>asList(new NotificationModule(reactContext));
       }

       @Override
       public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
           return Collections.emptyList();
       }
   }
   ```

## Android Manifest Configuration

Add these permissions and components to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.USE_FULL_SCREEN_INTENT" />
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />

<application>
    <!-- Incoming Call Activity -->
    <activity
        android:name=".IncomingCallActivity"
        android:theme="@style/IncomingCallTheme"
        android:launchMode="singleTop"
        android:excludeFromRecents="true"
        android:showWhenLocked="true"
        android:turnScreenOn="true" />

    <!-- Call Action Receiver -->
    <receiver
        android:name=".CallActionReceiver"
        android:exported="false" />

    <!-- Firebase Messaging Service -->
    <service
        android:name=".MyFirebaseMessagingService"
        android:exported="false">
        <intent-filter>
            <action android:name="com.google.firebase.MESSAGING_EVENT" />
        </intent-filter>
    </service>
</application>
```

## Background Notification Handling

### Firebase Messaging Service

Create `MyFirebaseMessagingService.java`:

```java
public class MyFirebaseMessagingService extends FirebaseMessagingService {
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        Map<String, String> data = remoteMessage.getData();
        String action = data.get("action");

        if ("incoming_call".equals(action)) {
            showFullScreenNotification(
                data.get("caller"),
                data.get("type")
            );
        }
    }

    private void showFullScreenNotification(String caller, String type) {
        // Use NotificationModule to show full-screen notification
        NotificationModule.showCallNotification(this, caller, type);
    }
}
```

## Android 15 Compatibility

### Required Changes for Android 15

1. **Update target SDK in `build.gradle`:**
   ```gradle
   compileSdkVersion 34
   targetSdkVersion 34
   ```

2. **Handle notification permission properly:**
   ```java
   if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
       if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) 
           != PackageManager.PERMISSION_GRANTED) {
           ActivityCompat.requestPermissions(this, 
               new String[]{Manifest.permission.POST_NOTIFICATIONS}, 101);
       }
   }
   ```

3. **Configure notification channels for Android 15:**
   ```java
   if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
       NotificationChannel channel = new NotificationChannel(
           CHANNEL_ID,
           "Call Notifications",
           NotificationManager.IMPORTANCE_HIGH
       );
       channel.setBypassDnd(true);
       channel.setShowBadge(true);
   }
   ```

## Testing Production Features

### Local Testing

1. **Build and install development build on physical device**
2. **Test background scenarios:**
   - App in background
   - App completely closed
   - Screen locked
   - Do not disturb mode

### Backend Testing

1. **Start backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Get device token from app logs**

3. **Test notification sending:**
   ```bash
   curl -X POST http://your-server.com/api/send-call-notification \
     -H "Content-Type: application/json" \
     -d '{
       "caller": "John Doe",
       "type": "voice",
       "targetToken": "ExponentPushToken[your-token]"
     }'
   ```

## Deployment

### Backend Deployment

Deploy to platforms like:
- **Heroku:** Easy deployment with git
- **Railway:** Modern hosting platform
- **Vercel:** Serverless functions
- **AWS/GCP:** Full control

### App Store Deployment

1. **Build production APK/AAB:**
   ```bash
   eas build --profile production --platform android
   ```

2. **Test thoroughly on multiple devices**

3. **Submit to Google Play Store**

## Performance Optimization

### Battery Optimization
- Handle Doze mode properly
- Use foreground services for active calls
- Optimize background tasks

### Memory Management
- Properly clean up resources
- Handle activity lifecycle correctly
- Optimize notification display

## Security Considerations

- Validate all notification data
- Use secure communication (HTTPS)
- Implement proper authentication
- Handle sensitive data appropriately

## Monitoring and Analytics

- Implement crash reporting (Crashlytics)
- Monitor notification delivery rates
- Track user engagement metrics
- Set up performance monitoring

## Common Issues and Solutions

### Notifications Not Showing in Background
- Check battery optimization settings
- Verify notification channel configuration
- Test on multiple devices

### Full-Screen Intent Not Working
- Ensure `USE_FULL_SCREEN_INTENT` permission
- Test on different Android versions
- Handle manufacturer-specific restrictions

### Deep Links Not Working
- Verify URL scheme configuration
- Test with different app states
- Check intent filter setup

## Resources

- [Expo Development Build](https://docs.expo.dev/development/build/)
- [React Native Firebase](https://rnfirebase.io/)
- [Android Notification Guide](https://developer.android.com/guide/topics/ui/notifiers/notifications)
- [FCM Documentation](https://firebase.google.com/docs/cloud-messaging)