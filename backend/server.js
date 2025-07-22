const express = require('express');
const cors = require('cors');
const { Expo } = require('expo-server-sdk');

const app = express();
const expo = new Expo();

app.use(cors());
app.use(express.json());

// Store device tokens (in production, use a database)
const deviceTokens = new Set();

// Register device token
app.post('/api/register-token', (req, res) => {
  const { token } = req.body;
  
  if (!token || !Expo.isExpoPushToken(token)) {
    return res.status(400).json({ error: 'Invalid token' });
  }
  
  deviceTokens.add(token);
  console.log('Registered token:', token);
  
  res.json({ success: true, message: 'Token registered successfully' });
});

// Send call notification
app.post('/api/send-call-notification', async (req, res) => {
  try {
    const { caller, type = 'voice', targetToken } = req.body;
    
    if (!caller) {
      return res.status(400).json({ error: 'Caller name is required' });
    }

    const messages = [];
    const tokensToSend = targetToken ? [targetToken] : Array.from(deviceTokens);

    for (const pushToken of tokensToSend) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      messages.push({
        to: pushToken,
        sound: 'default',
        title: `Incoming ${type} call`,
        body: `${caller} is calling you`,
        data: {
          caller,
          type,
          action: 'incoming_call',
          deepLink: `myapp://call/incoming?caller=${encodeURIComponent(caller)}&type=${type}`
        },
        categoryId: 'call-actions',
        priority: 'high',
        channelId: 'call-notifications',
      });
    }

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending notification chunk:', error);
      }
    }

    res.json({
      success: true,
      message: `Call notification sent to ${messages.length} device(s)`,
      tickets
    });
  } catch (error) {
    console.error('Error sending call notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Send message notification
app.post('/api/send-message-notification', async (req, res) => {
  try {
    const { sender, message, targetToken } = req.body;
    
    if (!sender || !message) {
      return res.status(400).json({ error: 'Sender and message are required' });
    }

    const messages = [];
    const tokensToSend = targetToken ? [targetToken] : Array.from(deviceTokens);

    for (const pushToken of tokensToSend) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      messages.push({
        to: pushToken,
        sound: 'default',
        title: sender,
        body: message,
        data: {
          sender,
          message,
          action: 'new_message',
          deepLink: 'myapp://notifications'
        },
        channelId: 'message-notifications',
      });
    }

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending notification chunk:', error);
      }
    }

    res.json({
      success: true,
      message: `Message notification sent to ${messages.length} device(s)`,
      tickets
    });
  } catch (error) {
    console.error('Error sending message notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Get registered tokens (for testing)
app.get('/api/tokens', (req, res) => {
  res.json({
    tokens: Array.from(deviceTokens),
    count: deviceTokens.size
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'WhatsApp-style notification server is running!',
    timestamp: new Date().toISOString(),
    registeredDevices: deviceTokens.size
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Notification server running on port ${PORT}`);
  console.log(`📱 Test endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/test`);
  console.log(`   POST http://localhost:${PORT}/api/register-token`);
  console.log(`   POST http://localhost:${PORT}/api/send-call-notification`);
  console.log(`   POST http://localhost:${PORT}/api/send-message-notification`);
  console.log(`   GET  http://localhost:${PORT}/api/tokens`);
});

module.exports = app;