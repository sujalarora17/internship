import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, Video, MessageSquare } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CallLog {
  id: string;
  name: string;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: Date;
  avatar: string;
}

export default function CallsScreen() {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);

  useEffect(() => {
    loadCallLogs();
  }, []);

  const loadCallLogs = async () => {
    try {
      const saved = await AsyncStorage.getItem('callLogs');
      if (saved) {
        const logs = JSON.parse(saved);
        setCallLogs(logs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        })));
      }
    } catch (error) {
      console.error('Error loading call logs:', error);
    }
  };

  const simulateIncomingCall = () => {
    router.push('/call/incoming?caller=John Doe&type=voice');
  };

  const simulateIncomingVideoCall = () => {
    router.push('/call/incoming?caller=Jane Smith&type=video');
  };

  const makeCall = (type: 'voice' | 'video') => {
    Alert.alert(
      'Make Call',
      `Start a ${type} call?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => router.push(`/call/outgoing?type=${type}`)
        }
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCallIcon = (type: string, direction: string) => {
    const color = direction === 'missed' ? '#FF4444' : '#25D366';
    return type === 'video' ? 
      <Video size={20} color={color} /> : 
      <Phone size={20} color={color} />;
  };

  const renderCallItem = ({ item }: { item: CallLog }) => (
    <TouchableOpacity style={styles.callItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.callDetails}>
        <Text style={styles.callerName}>{item.name}</Text>
        <Text style={styles.callTime}>{formatTime(item.timestamp)}</Text>
      </View>
      <View style={styles.callInfo}>
        {getCallIcon(item.type, item.direction)}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calls</Text>
      </View>

      <View style={styles.simulationSection}>
        <Text style={styles.sectionTitle}>Simulate Notifications</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.voiceButton]} 
            onPress={simulateIncomingCall}
          >
            <Phone size={20} color="white" />
            <Text style={styles.buttonText}>Voice Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.videoButton]} 
            onPress={simulateIncomingVideoCall}
          >
            <Video size={20} color="white" />
            <Text style={styles.buttonText}>Video Call</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => makeCall('voice')}
        >
          <Phone size={24} color="#25D366" />
          <Text style={styles.quickActionText}>Voice</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => makeCall('video')}
        >
          <Video size={24} color="#25D366" />
          <Text style={styles.quickActionText}>Video</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={callLogs}
        renderItem={renderCallItem}
        keyExtractor={(item) => item.id}
        style={styles.callList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Phone size={48} color="#8B9DC3" />
            <Text style={styles.emptyText}>No recent calls</Text>
          </View>
        }
      />
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
  simulationSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
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
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  voiceButton: {
    backgroundColor: '#25D366',
  },
  videoButton: {
    backgroundColor: '#4285F4',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 16,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 1,
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  quickActionText: {
    marginTop: 4,
    fontSize: 12,
    color: '#075E54',
    fontWeight: '500',
  },
  callList: {
    flex: 1,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 2,
    borderRadius: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E1E1E1',
  },
  callDetails: {
    flex: 1,
    marginLeft: 12,
  },
  callerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075E54',
  },
  callTime: {
    fontSize: 14,
    color: '#8B9DC3',
    marginTop: 2,
  },
  callInfo: {
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8B9DC3',
  },
});