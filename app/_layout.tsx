import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { notificationService } from '@/services/notificationService';
import { deepLinkService } from '@/services/deepLinkService';

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    // Initialize services
    const initializeServices = async () => {
      await notificationService.initialize();
      deepLinkService.initialize();
    };

    initializeServices();

    // Set up notification response listener
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { data } = response.notification.request.content;
        
        if (data?.action === 'incoming_call') {
          // Navigate to incoming call screen
          deepLinkService.registerHandler(
            /call/,
            () => console.log('Notification tapped - navigating to call')
          );
        } else if (data?.action === 'new_message') {
          // Navigate to messages
          console.log('Message notification tapped');
        }
      }
    );

    // Set up notification categories for interactive notifications
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      Notifications.setNotificationCategoryAsync('call-actions', [
        {
          identifier: 'answer',
          buttonTitle: 'Answer',
          options: { isDestructive: false, isAuthenticationRequired: false },
        },
        {
          identifier: 'decline',
          buttonTitle: 'Decline',
          options: { isDestructive: true, isAuthenticationRequired: false },
        },
      ]);
    }

    return () => {
      responseSubscription.remove();
    };
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="call/incoming" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="call/active" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="call/outgoing" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}