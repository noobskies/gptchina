// src/hooks/Notifications/usePushNotifications.ts
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed,
} from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import notificationStore from '~/store/notifications';
import { useAuthContext } from '../AuthContext';

export function usePushNotifications() {
  const { user } = useAuthContext();
  const setNotificationPermission = useSetRecoilState(notificationStore.notificationPermission);
  const setDeviceToken = useSetRecoilState(notificationStore.deviceToken);

  useEffect(() => {
    if (!user) return;

    const registerPush = async () => {
      try {
        const permStatus = await PushNotifications.requestPermissions();

        setNotificationPermission(permStatus.receive === 'granted');

        if (permStatus.receive === 'granted') {
          await PushNotifications.register();
        }
      } catch (err) {
        console.error('Failed to register push notifications:', err);
      }
    };

    PushNotifications.addListener('registration', async (token: Token) => {
      const deviceTokenData = {
        token: token.value,
        platform: Capacitor.getPlatform() === 'ios' ? 'ios' : 'android',
      };

      setDeviceToken(deviceTokenData);

      try {
        await fetch('/api/device/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deviceTokenData),
        });
      } catch (err) {
        console.error('Failed to send token to backend:', err);
      }
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push notification received:', notification);
      },
    );

    PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
      console.log('Push action performed:', action);
    });

    registerPush();

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [user, setNotificationPermission, setDeviceToken]);
}
