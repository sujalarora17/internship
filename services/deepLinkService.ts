import { Linking } from 'react-native';
import { router } from 'expo-router';

export interface DeepLinkHandler {
  pattern: RegExp;
  handler: (params: any) => void;
}

class DeepLinkService {
  private handlers: DeepLinkHandler[] = [];

  initialize() {
    // Handle initial URL if app was launched from a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleDeepLink(url);
      }
    });

    // Handle deep links when app is already running
    const subscription = Linking.addEventListener('url', (event) => {
      this.handleDeepLink(event.url);
    });

    return () => subscription?.remove();
  }

  registerHandler(pattern: RegExp, handler: (params: any) => void) {
    this.handlers.push({ pattern, handler });
  }

  private handleDeepLink(url: string) {
    console.log('Handling deep link:', url);

    for (const { pattern, handler } of this.handlers) {
      const match = url.match(pattern);
      if (match) {
        const params = this.extractParams(url);
        handler(params);
        return;
      }
    }

    // Default handling
    this.handleDefaultLink(url);
  }

  private extractParams(url: string): any {
    const urlObj = new URL(url);
    const params: any = {};
    
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return params;
  }

  private handleDefaultLink(url: string) {
    // Parse the URL and navigate to appropriate screen
    if (url.includes('/call/')) {
      const params = this.extractParams(url);
      if (params.type && params.caller) {
        router.push(`/call/incoming?caller=${params.caller}&type=${params.type}`);
      }
    } else if (url.includes('/notifications')) {
      router.push('/(tabs)/notifications');
    }
  }

  // Helper methods for common deep link actions
  static navigateToIncomingCall(caller: string, type: 'voice' | 'video') {
    router.push(`/call/incoming?caller=${encodeURIComponent(caller)}&type=${type}`);
  }

  static navigateToActiveCall(caller: string, type: 'voice' | 'video') {
    router.push(`/call/active?caller=${encodeURIComponent(caller)}&type=${type}&status=connected`);
  }

  static navigateToNotifications() {
    router.push('/(tabs)/notifications');
  }
}

export const deepLinkService = new DeepLinkService();

// Register default handlers
deepLinkService.registerHandler(
  /myapp:\/\/call\/incoming/,
  (params) => {
    if (params.caller && params.type) {
      DeepLinkService.navigateToIncomingCall(params.caller, params.type);
    }
  }
);

deepLinkService.registerHandler(
  /myapp:\/\/call\/active/,
  (params) => {
    if (params.caller && params.type) {
      DeepLinkService.navigateToActiveCall(params.caller, params.type);
    }
  }
);

deepLinkService.registerHandler(
  /myapp:\/\/notifications/,
  () => {
    DeepLinkService.navigateToNotifications();
  }
);