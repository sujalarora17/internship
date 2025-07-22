# WhatsApp-Style Real-time Notifications App

A React Native Expo app that demonstrates WhatsApp-style real-time push notifications with full-screen call interfaces, background handling, and deep linking.

## Features

### Core Functionality
- 📱 Real-time push notifications using Expo Notifications
- 📞 Full-screen incoming call interface with answer/decline actions
- 🎥 Support for both voice and video call notifications
- 🔔 Background and killed app notification handling
- 🔗 Deep linking to specific screens from notifications
- 💾 Local notification storage and history
- 🏷️ Badge count management
- ⚙️ Comprehensive notification settings

### UI/UX Features
- 🎨 WhatsApp-inspired design with green accent colors
- ✨ Smooth animations and transitions
- 📱 Responsive design for all screen sizes
- 🌙 Dark theme for call screens
- 👤 Profile pictures and caller information
- ⏱️ Call duration tracking
- 🔇 Mute, video toggle, and speaker controls

## Project Structure

```
├── app/
│   ├── (tabs)/                 # Tab navigation
│   │   ├── index.tsx          # Calls screen with simulation
│   │   ├── notifications.tsx   # Notification history
│   │   └── settings.tsx       # App settings
│   ├── call/                  # Call screens
│   │   ├── incoming.tsx       # Incoming call interface
│   │   ├── active.tsx         # Active call interface
│   │   └── outgoing.tsx       # Outgoing call interface
│   └── _layout.tsx            # Root layout with navigation
├── services/
│   ├── notificationService.ts # Notification management
│   └── deepLinkService.ts     # Deep linking handling
├── backend/                   # Node.js backend server
│   ├── server.js             # Express server for notifications
│   └── package.json          # Backend dependencies
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+ installed
- Expo CLI installed globally: `npm install -g @expo/cli`
- Physical device or emulator for testing notifications

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Set up the backend server:**
   ```bash
   cd backend
   npm install
   npm start
   ```

### Testing Notifications

1. **Local Testing:**
   - Use the "Simulate Notifications" buttons in the app
   - Test voice and video call notifications
   - Check notification history and settings

2. **Backend Testing:**
   ```bash
   # Test server
   curl http://localhost:3001/api/test

   # Register device token
   curl -X POST http://localhost:3001/api/register-token \
     -H "Content-Type: application/json" \
     -d '{"token":"ExponentPushToken[YOUR_TOKEN_HERE]"}'

   # Send call notification
   curl -X POST http://localhost:3001/api/send-call-notification \
     -H "Content-Type: application/json" \
     -d '{"caller":"John Doe","type":"voice"}'
   ```

## Production Setup

### For Native Module Support

Since this app uses Expo managed workflow, for full background notification support and native modules:

1. **Create a development build:**
   ```bash
   expo install expo-dev-client
   expo run:android  # or expo run:ios
   ```

2. **Or eject to bare React Native:**
   ```bash
   expo eject
   ```

### Firebase Cloud Messaging (FCM)

1. **Set up Firebase project:**
   - Create a new Firebase project
   - Add Android/iOS app configurations
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)

2. **Install FCM dependencies:**
   ```bash
   npm install @react-native-firebase/app @react-native-firebase/messaging
   ```

3. **Configure native code:**
   - Follow React Native Firebase documentation for setup
   - Configure background message handling
   - Set up notification channels for Android

### Native Android Module (Java/Kotlin)

For full-screen notifications and background handling, create a native module:

```kotlin
// NotificationModule.kt
@ReactModule(name = "NotificationModule")
class NotificationModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "NotificationModule"

    @ReactMethod
    fun showFullScreenNotification(
        title: String,
        body: String,
        promise: Promise
    ) {
        // Implementation for full-screen notification
        // Use NotificationManager.IMPORTANCE_HIGH
        // Set full-screen intent for incoming calls
    }
}
```

## Android 15 Compatibility

The app includes support for Android 15 with:
- Updated notification permission handling
- Proper notification channel configuration
- Full-screen notification support
- Background task optimization

## Deep Linking

The app supports deep links with the custom scheme `myapp://`:

- `myapp://call/incoming?caller=John&type=voice` - Incoming call
- `myapp://call/active?caller=John&type=video` - Active call
- `myapp://notifications` - Notification history

## API Endpoints

### Backend Server (Port 3001)

- `GET /api/test` - Health check
- `POST /api/register-token` - Register device token
- `POST /api/send-call-notification` - Send call notification
- `POST /api/send-message-notification` - Send message notification
- `GET /api/tokens` - List registered tokens

## Environment Variables

Create a `.env` file in the project root:

```env
# Optional: Add your Expo project ID for push notifications from external servers
# You can find this in your Expo dashboard at expo.dev
# EXPO_PROJECT_ID=a1b2c3d4-e5f6-7890-1234-567890abcdef
FCM_SERVER_KEY=your-fcm-server-key
BACKEND_URL=http://localhost:3001
```

**Note:** The `EXPO_PROJECT_ID` is only required if you want to send push notifications from external servers. Local notification testing will work without it.

## Limitations in Expo Managed Workflow

- Background app refresh limitations
- No native module access without development build
- Push notification testing requires physical device
- Some Android notification features require native code

## Next Steps for Production

1. **Eject to bare React Native** or use **Expo Development Build**
2. **Implement Firebase Cloud Messaging** for better reliability
3. **Create native Android module** for full-screen notifications
4. **Add real authentication** and user management
5. **Implement actual voice/video calling** using WebRTC
6. **Add contact integration** and phone number verification
7. **Deploy backend** to production server
8. **Submit to app stores** with proper permissions

## Demo Video Requirements

Record a demo showing:
1. 📱 App launch and permission setup
2. 🔔 Triggering notifications from backend
3. 📞 Full-screen incoming call interface
4. ✅ Accepting/declining calls
5. 📋 Notification history management
6. ⚙️ Settings configuration
7. 🔗 Deep linking from notifications
8. 📊 Background/foreground behavior

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details