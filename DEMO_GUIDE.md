# Complete Demo Recording Guide

This guide walks you through recording a comprehensive demo video showing all the WhatsApp-style notification features.

## 🎬 Recording Setup

### Prerequisites
- Physical Android/iOS device (notifications work better on real devices)
- Screen recording software (OBS, QuickTime, or built-in screen recorder)
- Terminal access for backend commands
- Two browser tabs: one for the app, one for API testing

### Recording Tools
- **Mobile**: Use built-in screen recorder
- **Desktop**: OBS Studio, QuickTime (Mac), or Windows Game Bar
- **Audio**: Record your voice explaining each step

## 📱 Step-by-Step Demo Script

### 1. App Launch & Setup (30 seconds)

**What to show:**
```bash
# Start the app
npm run dev
```

**Recording steps:**
1. Open terminal and run `npm run dev`
2. Show the app loading in browser/device
3. Navigate through the three tabs: Calls, Notifications, Settings
4. Say: "This is a WhatsApp-style notification app with real-time push notifications"

### 2. Foreground Notifications (45 seconds)

**What to show:**
- Notifications while app is open and active

**Recording steps:**
1. Go to the Calls tab
2. Tap "Voice Call" button in the simulation section
3. Show the notification appearing
4. Tap "Video Call" button
5. Show the full-screen incoming call interface
6. Tap "Answer" to see the active call screen
7. Say: "Notifications work perfectly when the app is in the foreground"

### 3. Backend Server Setup (30 seconds)

**What to show:**
```bash
# In a new terminal
cd backend
npm install
npm start
```

**Recording steps:**
1. Open new terminal window
2. Navigate to backend folder: `cd backend`
3. Install dependencies: `npm install`
4. Start server: `npm start`
5. Show server running on port 3001
6. Say: "The backend server simulates real push notification delivery"

### 4. Background Notifications (60 seconds)

**What to show:**
- Notifications when app is minimized

**Recording steps:**
1. Minimize the app (don't close it)
2. In terminal, run:
   ```bash
   curl -X POST http://localhost:3001/api/send-call-notification \
     -H "Content-Type: application/json" \
     -d '{"caller":"John Doe","type":"voice"}'
   ```
3. Show notification appearing in system tray
4. Tap the notification
5. Show app opening to incoming call screen
6. Repeat with video call:
   ```bash
   curl -X POST http://localhost:3001/api/send-call-notification \
     -H "Content-Type: application/json" \
     -d '{"caller":"Jane Smith","type":"video"}'
   ```
7. Say: "Background notifications work seamlessly and open the correct screen"

### 5. Killed App Notifications (60 seconds)

**What to show:**
- Notifications when app is completely closed

**Recording steps:**
1. Force close the app completely (swipe away from recent apps)
2. Wait 5 seconds to ensure app is killed
3. Send notification via terminal:
   ```bash
   curl -X POST http://localhost:3001/api/send-call-notification \
     -H "Content-Type: application/json" \
     -d '{"caller":"Emergency Call","type":"voice"}'
   ```
4. Show notification appearing
5. Tap notification
6. Show app launching fresh and opening to incoming call screen
7. Say: "Even when the app is killed, notifications restart the app and navigate correctly"

### 6. Deep Linking Demo (45 seconds)

**What to show:**
- How notifications open specific screens

**Recording steps:**
1. Send multiple different notifications
2. Show each notification opening the correct screen:
   - Voice call → Voice call interface
   - Video call → Video call interface with camera icon
3. Show the URL scheme in action
4. Say: "Deep linking ensures users land on the exact right screen for each notification type"

### 7. Notification History & Storage (30 seconds)

**What to show:**
- Local storage and notification management

**Recording steps:**
1. Go to Notifications tab
2. Show list of received notifications with timestamps
3. Tap a notification to mark it as read
4. Show unread count decreasing
5. Say: "All notifications are stored locally with full history and read status"

### 8. Badge Count Demo (30 seconds)

**What to show:**
- App icon badge count

**Recording steps:**
1. Send 3-4 notifications rapidly:
   ```bash
   curl -X POST http://localhost:3001/api/send-call-notification \
     -H "Content-Type: application/json" \
     -d '{"caller":"Contact 1","type":"voice"}'
   
   curl -X POST http://localhost:3001/api/send-call-notification \
     -H "Content-Type: application/json" \
     -d '{"caller":"Contact 2","type":"video"}'
   ```
2. Show badge count on app icon increasing
3. Open app and show notifications
4. Mark some as read
5. Show badge count decreasing
6. Say: "Badge counts update automatically with unread notifications"

### 9. Settings & Controls (30 seconds)

**What to show:**
- Notification preferences and controls

**Recording steps:**
1. Go to Settings tab
2. Toggle notification settings on/off
3. Show "Test Notification" button
4. Tap it and show test notification
5. Show "Clear History" option
6. Say: "Users have full control over notification preferences and history"

### 10. Advanced Features Demo (45 seconds)

**What to show:**
- Call controls and advanced UI

**Recording steps:**
1. Trigger an incoming call notification
2. Answer the call
3. Show active call screen with:
   - Mute/unmute button
   - Video on/off toggle
   - Speaker toggle
   - Call duration timer
4. End the call
5. Show outgoing call simulation
6. Say: "Full call interface with all standard controls like WhatsApp"

## 🔧 Backend API Testing Commands

### Quick Test Commands
```bash
# Test server is running
curl http://localhost:3001/api/test

# Send voice call
curl -X POST http://localhost:3001/api/send-call-notification \
  -H "Content-Type: application/json" \
  -d '{"caller":"John Doe","type":"voice"}'

# Send video call
curl -X POST http://localhost:3001/api/send-call-notification \
  -H "Content-Type: application/json" \
  -d '{"caller":"Jane Smith","type":"video"}'

# Send message notification
curl -X POST http://localhost:3001/api/send-message-notification \
  -H "Content-Type: application/json" \
  -d '{"sender":"Alice","message":"Hello there!"}'

# Check registered tokens
curl http://localhost:3001/api/tokens
```

### Batch Testing Script
Create a file `test-notifications.sh`:
```bash
#!/bin/bash
echo "Sending multiple test notifications..."

curl -X POST http://localhost:3001/api/send-call-notification \
  -H "Content-Type: application/json" \
  -d '{"caller":"Mom","type":"voice"}' &

sleep 2

curl -X POST http://localhost:3001/api/send-call-notification \
  -H "Content-Type: application/json" \
  -d '{"caller":"Boss","type":"video"}' &

sleep 2

curl -X POST http://localhost:3001/api/send-message-notification \
  -H "Content-Type: application/json" \
  -d '{"sender":"Friend","message":"Are you free tonight?"}' &

echo "All notifications sent!"
```

Run with: `chmod +x test-notifications.sh && ./test-notifications.sh`

## 📋 Demo Checklist

### Before Recording
- [ ] App is running (`npm run dev`)
- [ ] Backend server is running (`cd backend && npm start`)
- [ ] Screen recorder is ready
- [ ] Device has notifications enabled
- [ ] Terminal is ready with curl commands

### During Recording
- [ ] Show app launch and navigation
- [ ] Demonstrate foreground notifications
- [ ] Show backend server setup
- [ ] Test background notifications
- [ ] Test killed app notifications
- [ ] Show deep linking working
- [ ] Display notification history
- [ ] Show badge count changes
- [ ] Demonstrate settings controls
- [ ] Show advanced call features

### After Recording
- [ ] Edit video to highlight key features
- [ ] Add captions explaining each feature
- [ ] Include terminal commands in video
- [ ] Show both mobile and desktop views
- [ ] Export in high quality (1080p minimum)

## 🎯 Key Points to Emphasize

1. **Real-time delivery** - Notifications appear instantly
2. **Background reliability** - Works when app is minimized
3. **Killed app recovery** - Restarts app and navigates correctly
4. **WhatsApp-like UI** - Professional call interface
5. **Deep linking** - Smart navigation from notifications
6. **Local storage** - Persistent notification history
7. **Badge management** - Accurate unread counts
8. **User control** - Comprehensive settings

## 🚀 Pro Tips for Great Demo

1. **Speak clearly** and explain what you're doing
2. **Show terminal commands** so viewers can replicate
3. **Test on real device** for authentic experience
4. **Use realistic contact names** (John, Jane, Mom, Boss)
5. **Show both success and edge cases**
6. **Keep good pacing** - not too fast or slow
7. **Highlight unique features** that make it WhatsApp-like
8. **End with summary** of all features demonstrated

## 📱 Mobile-Specific Recording Tips

### Android
- Use built-in screen recorder (swipe down → Screen Record)
- Enable "Show touches" in Developer Options
- Test on Android 15 if possible

### iOS
- Use Control Center screen recording
- Enable microphone for voice-over
- Test notification permissions carefully

### Web Browser
- Use browser's built-in recording or OBS
- Show both desktop and mobile responsive views
- Demonstrate cross-platform compatibility

## 🎬 Final Video Structure (5-7 minutes total)

1. **Intro** (30s) - App overview and features
2. **Setup** (30s) - Starting app and backend
3. **Foreground** (45s) - In-app notifications
4. **Background** (60s) - Minimized app notifications
5. **Killed App** (60s) - Closed app notifications
6. **Deep Linking** (45s) - Navigation from notifications
7. **Storage & History** (30s) - Local data management
8. **Badge Counts** (30s) - Icon badge updates
9. **Settings** (30s) - User controls
10. **Advanced Features** (45s) - Call interface
11. **Conclusion** (30s) - Summary and next steps

This comprehensive demo will showcase all the WhatsApp-style notification features and prove the app works in all scenarios!