// src/store/notifications.ts
import { atom } from 'recoil';

export interface DeviceToken {
  token: string;
  platform: 'ios' | 'android';
}

const notificationPermission = atom<boolean>({
  key: 'notificationPermission',
  default: false,
});

const deviceToken = atom<DeviceToken | null>({
  key: 'deviceToken',
  default: null,
});

export default {
  notificationPermission,
  deviceToken,
};
