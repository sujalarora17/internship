import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, PhoneOff, Video, MessageSquare } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

export default function IncomingCallScreen() {
  const { caller, type } = useLocalSearchParams();
  const [pulseAnim] = useState(new Animated.Value(1));
  const [sound, setSound] = useState<Audio.Sound>();

  useEffect(() => {
    startPulseAnimation();
    playRingtone();
    
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const playRingtone = async () => {
    try {
      // In a real app, you would load an actual ringtone file
      console.log('Playing ringtone...');
    } catch (error) {
      console.error('Error playing ringtone:', error);
    }
  };

  const acceptCall = () => {
    router.replace(`/call/active?caller=${caller}&type=${type}&status=connected`);
  };

  const declineCall = () => {
    router.back();
  };

  const sendMessage = () => {
    // In a real app, this would open the messaging interface
    router.back();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.callType}>
            Incoming {type === 'video' ? 'video' : 'voice'} call
          </Text>
        </View>

        <View style={styles.callerSection}>
          <Animated.View
            style={[
              styles.avatarContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300'
              }}
              style={styles.avatar}
            />
          </Animated.View>
          
          <Text style={styles.callerName}>{caller}</Text>
          <Text style={styles.callerNumber}>+1 (555) 123-4567</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.messageButton]}
            onPress={sendMessage}
          >
            <MessageSquare size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={declineCall}
          >
            <PhoneOff size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={acceptCall}
          >
            {type === 'video' ? (
              <Video size={32} color="white" />
            ) : (
              <Phone size={32} color="white" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomActions}>
          <Text style={styles.actionHint}>
            Swipe up for more options
          </Text>
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
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  callerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  callerNumber: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
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
  messageButton: {
    backgroundColor: '#8B9DC3',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  declineButton: {
    backgroundColor: '#FF4444',
  },
  acceptButton: {
    backgroundColor: '#25D366',
  },
  bottomActions: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  actionHint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});