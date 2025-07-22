import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PhoneOff, Video, Phone } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function OutgoingCallScreen() {
  const { type } = useLocalSearchParams();
  const [status, setStatus] = useState('Calling...');
  const [rotateAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    startConnectingAnimation();
    
    // Simulate connection after 3 seconds
    const timer = setTimeout(() => {
      setStatus('Connecting...');
      setTimeout(() => {
        router.replace(`/call/active?caller=Contact&type=${type}&status=connected`);
      }, 2000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const startConnectingAnimation = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  };

  const cancelCall = () => {
    router.back();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.callType}>
            {type === 'video' ? 'Video call' : 'Voice call'}
          </Text>
        </View>

        <View style={styles.callerSection}>
          <Animated.View
            style={[
              styles.avatarContainer,
              { transform: [{ rotate: spin }] }
            ]}
          >
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300'
              }}
              style={styles.avatar}
            />
          </Animated.View>
          
          <Text style={styles.callerName}>Contact</Text>
          <Text style={styles.status}>{status}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={cancelCall}
          >
            <PhoneOff size={32} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
  },
  callType: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  callerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  avatarContainer: {
    marginBottom: 30,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: 'rgba(37, 211, 102, 0.5)',
  },
  callerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  status: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  actionsContainer: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  cancelButton: {
    backgroundColor: '#FF4444',
  },
});