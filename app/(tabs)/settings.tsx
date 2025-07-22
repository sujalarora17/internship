import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  Volume2, 
  Vibrate, 
  Shield, 
  Smartphone,
  ChevronRight,
  TestTube
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

interface Settings {
  notifications: boolean;
  sound: boolean;
  vibration: boolean;
  headsUp: boolean;
  badgeCount: boolean;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    sound: true,
    vibration: true,
    headsUp: true,
    badgeCount: true,
  });

  useEffect(() => {
    loadSettings();
    checkNotificationPermissions();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('appSettings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSetting = (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const checkNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      console.log('Notification permissions not granted');
    }
  };

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      Alert.alert('Success', 'Notification permissions granted!');
      updateSetting('notifications', true);
    } else {
      Alert.alert('Error', 'Notification permissions denied');
    }
  };

  const testNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Notification',
          body: 'This is a test notification from your app!',
          sound: settings.sound,
          vibrate: settings.vibration ? [0, 250, 250, 250] : [],
        },
        trigger: { seconds: 1 },
      });
      Alert.alert('Test Sent', 'Check your notifications in a moment!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const clearNotificationHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all notification history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('notifications');
            Alert.alert('Cleared', 'Notification history has been cleared');
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    description, 
    value, 
    onToggle,
    showChevron = false,
    onPress 
  }: {
    icon: React.ReactNode;
    title: string;
    description?: string;
    value?: boolean;
    onToggle?: (value: boolean) => void;
    showChevron?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress && !onToggle}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>
      {onToggle && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: '#25D366' }}
          thumbColor={value ? '#FFF' : '#f4f3f4'}
        />
      )}
      {showChevron && (
        <ChevronRight size={20} color="#8B9DC3" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <SettingItem
          icon={<Bell size={24} color="#25D366" />}
          title="Enable Notifications"
          description="Receive call and message notifications"
          value={settings.notifications}
          onToggle={(value) => updateSetting('notifications', value)}
        />
        
        <SettingItem
          icon={<Volume2 size={24} color="#25D366" />}
          title="Sound"
          description="Play notification sounds"
          value={settings.sound}
          onToggle={(value) => updateSetting('sound', value)}
        />
        
        <SettingItem
          icon={<Vibrate size={24} color="#25D366" />}
          title="Vibration"
          description="Vibrate for notifications"
          value={settings.vibration}
          onToggle={(value) => updateSetting('vibration', value)}
        />
        
        <SettingItem
          icon={<Smartphone size={24} color="#25D366" />}
          title="Heads-up Notifications"
          description="Show full-screen notifications for calls"
          value={settings.headsUp}
          onToggle={(value) => updateSetting('headsUp', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Permissions</Text>
        
        <SettingItem
          icon={<Shield size={24} color="#4285F4" />}
          title="Notification Permissions"
          description="Manage app notification permissions"
          showChevron={true}
          onPress={requestPermissions}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Testing</Text>
        
        <SettingItem
          icon={<TestTube size={24} color="#FF9500" />}
          title="Test Notification"
          description="Send a test notification"
          showChevron={true}
          onPress={testNotification}
        />
        
        <SettingItem
          icon={<Bell size={24} color="#FF4444" />}
          title="Clear History"
          description="Clear all notification history"
          showChevron={true}
          onPress={clearNotificationHistory}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          For full background notification support, use a development build or eject from Expo.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#075E54',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075E54',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#075E54',
  },
  settingDescription: {
    fontSize: 14,
    color: '#8B9DC3',
    marginTop: 2,
  },
  footer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  footerText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});