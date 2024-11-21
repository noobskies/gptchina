// server/services/NotificationService.js
const admin = require('firebase-admin');
const { logger } = require('~/config');
const Device = require('~/models/Device');

class NotificationService {
  constructor() {
    if (!admin.apps.length) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
        });
        logger.info('[NotificationService] Firebase initialized successfully');
      } catch (error) {
        logger.error('[NotificationService] Firebase initialization error:', error);
        throw error;
      }
    }
  }

  async sendTokenClaimNotification(userId) {
    try {
      logger.info(`[NotificationService] Starting notification for user ${userId}`);
      const devices = await Device.getUserDevices(userId);

      logger.info(`[NotificationService] Found ${devices.length} devices`);
      if (!devices.length) return;

      const androidDevices = devices.filter((device) => device.platform === 'android');
      logger.info(`[NotificationService] Found ${androidDevices.length} Android devices`);

      if (androidDevices.length > 0) {
        const message = {
          token: androidDevices[0].token,
          android: {
            priority: 'high',
            ttl: 60 * 60 * 1000, // 1 hour
            notification: {
              channelId: 'token_claims',
              title: 'Tokens Available',
              body: 'Your tokens are ready to be claimed',
              icon: '@mipmap/ic_launcher',
              visibility: 'public',
              priority: 'high',
            },
          },
          notification: {
            title: 'Tokens Available',
            body: 'Your tokens are ready to be claimed',
          },
          data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            type: 'TOKEN_CLAIM',
            title: 'Tokens Available',
            body: 'Your tokens are ready to be claimed',
          },
        };

        try {
          logger.info('[NotificationService] Sending notification message:', {
            token: androidDevices[0].token.substring(0, 10) + '...',
            channel: message.android.notification.channelId,
          });

          const response = await admin.messaging().send(message);
          logger.info('[NotificationService] Message sent successfully:', response);

          await Device.updateLastNotified(userId);
        } catch (error) {
          logger.error('[NotificationService] FCM Error:', {
            code: error.code,
            message: error.message,
            status: error.status,
          });

          if (error.code === 'messaging/registration-token-not-registered') {
            logger.info('[NotificationService] Removing invalid token');
            await Device.removeInvalidTokens([androidDevices[0].token]);
          }
        }
      }
    } catch (error) {
      logger.error('[NotificationService] General error:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();
