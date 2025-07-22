import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: 'voice' | 'video' | 'message';
  timestamp: Date;
  read: boolean;
  data?: any;
}

class NotificationService {
  private expoPushToken: string | null = null;

  async initialize() {
    try {
      // Register for push notifications
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          console.log('Failed to get push token for push notification!');
          return;
        }
        
        // Get the Expo push token - handle missing project ID gracefully
        try {
          const token = await Notifications.getExpoPushTokenAsync();
          this.expoPushToken = token.data;
          console.log('Expo Push Token:', this.expoPushToken);
          
          // Store token for backend use
          await AsyncStorage.setItem('expoPushToken', this.expoPushToken);
        } catch (tokenError) {
          console.warn('Could not get Expo push token:', tokenError);
          console.log('Push notifications will work locally but not from external servers');
          // Continue without push token - local notifications will still work
        }
      } else {
        console.log('Must use physical device for Push Notifications');
      }

      // Configure Android notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('call-notifications', {
          name: 'Call Notifications',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#25D366',
          sound: 'default',
          enableLights: true,
          enableVibrate: true,
          showBadge: true,
        });

        await Notifications.setNotificationChannelAsync('message-notifications', {
          name: 'Message Notifications',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250],
          lightColor: '#25D366',
          sound: 'default',
        });
      }
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }

  async scheduleCallNotification(caller: string, type: 'voice' | 'video') {
    try {
      const notificationData: NotificationData = {
        id: `call-${Date.now()}`,
        title: `Incoming ${type} call`,
        body: `${caller} is calling you`,
        type,
        timestamp: new Date(),
        read: false,
        data: {
          caller,
          type,
          action: 'incoming_call',
        },
      };

      // Store notification
      await this.storeNotification(notificationData);

      // Schedule the notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: notificationData.data,
          categoryIdentifier: 'call-actions',
          sound: true,
        },
        trigger: { seconds: 1 },
      });

      return notificationData.id;
    } catch (error) {
      console.error('Error scheduling call notification:', error);
      return null;
    }
  }

  async scheduleMessageNotification(sender: string, message: string) {
    try {
      const notificationData: NotificationData = {
        id: `message-${Date.now()}`,
        title: sender,
        body: message,
        type: 'message',
        timestamp: new Date(),
        read: false,
        data: {
          sender,
          message,
          action: 'new_message',
        },
      };

      await this.storeNotification(notificationData);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: notificationData.data,
          sound: true,
        },
        trigger: { seconds: 1 },
      });

      return notificationData.id;
    } catch (error) {
      console.error('Error scheduling message notification:', error);
      return null;
    }
  }

  private async storeNotification(notification: NotificationData) {
    try {
      const existing = await AsyncStorage.getItem('notifications');
      const notifications = existing ? JSON.parse(existing) : [];
      notifications.unshift(notification);
      
      // Keep only the last 50 notifications
      if (notifications.length > 50) {
        notifications.splice(50);
      }
      
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
      
      // Update badge count
      const unreadCount = notifications.filter((n: NotificationData) => !n.read).length;
      await Notifications.setBadgeCountAsync(unreadCount);
    } catch (error) {
      console.error('Error storing notification:', error);
    }
  }

  async markNotificationAsRead(id: string) {
    try {
      const existing = await AsyncStorage.getItem('notifications');
      if (existing) {
        const notifications = JSON.parse(existing);
        const updated = notifications.map((n: NotificationData) =>
          n.id === id ? { ...n, read: true } : n
        );
        await AsyncStorage.setItem('notifications', JSON.stringify(updated));
        
        const unreadCount = updated.filter((n: NotificationData) => !n.read).length;
        await Notifications.setBadgeCountAsync(unreadCount);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async clearAllNotifications() {
    try {
      await AsyncStorage.removeItem('notifications');
      await Notifications.setBadgeCountAsync(0);
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }

  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }
}

export const notificationService = new NotificationService();