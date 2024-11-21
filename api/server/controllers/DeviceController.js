// server/controllers/DeviceController.js
const Device = require('~/models/Device');
const { logger } = require('~/config');

const deviceRegisterController = async (req, res) => {
  try {
    const { token, platform } = req.body;
    const userId = req.user.id;

    console.log('=== Device Registration Debug ===');
    console.log('1. Request received:', { userId, platform, tokenPreview: token.slice(0, 10) });

    if (!token || !platform) {
      console.log('2. Missing required fields');
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    console.log('3. Attempting to save device...');
    const device = await Device.registerDevice(userId, token, platform);
    console.log('4. Device saved:', device);

    // Verify it was saved
    const verifyDevice = await Device.findById(device._id);
    console.log('5. Verify device exists:', verifyDevice ? 'Yes' : 'No');

    // Get all devices for this user
    const userDevices = await Device.getUserDevices(userId);
    console.log('6. All user devices:', userDevices);

    res.status(200).json({
      success: true,
      device: {
        id: device._id,
        platform: device.platform,
        createdAt: device.createdAt,
      },
    });
  } catch (error) {
    logger.error('[DeviceController] Registration error:', error);
    res.status(500).json({
      error: 'Failed to register device',
      message: error.message,
    });
  }
};

const deviceUnregisterController = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user.id;

    logger.info('[DeviceController] Unregistering device:', {
      userId,
      tokenPreview: token ? token.slice(0, 10) : 'missing',
    });

    if (!token) {
      logger.warn('[DeviceController] Missing token in unregister request');
      return res.status(400).json({ error: 'Token is required' });
    }

    await Device.removeInvalidTokens([token]);
    logger.info('[DeviceController] Device unregistered successfully');

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('[DeviceController] Unregister error:', error);
    res.status(500).json({
      error: 'Failed to unregister device',
    });
  }
};

// Add a test notification endpoint for debugging
const testNotificationController = async (req, res) => {
  try {
    const userId = req.user.id;
    logger.info('[DeviceController] Testing notification for user:', userId);

    const devices = await Device.getUserDevices(userId);
    logger.info(`[DeviceController] Found ${devices.length} devices for testing`);

    if (devices.length === 0) {
      return res.status(404).json({
        error: 'No devices found for this user',
      });
    }

    const NotificationService = require('../services/NotificationService');
    await NotificationService.sendTokenClaimNotification(userId);

    logger.info('[DeviceController] Test notification sent successfully');
    res.json({
      success: true,
      deviceCount: devices.length,
    });
  } catch (error) {
    logger.error('[DeviceController] Test notification error:', error);
    res.status(500).json({
      error: 'Failed to send test notification',
      message: error.message,
    });
  }
};

module.exports = {
  deviceRegisterController,
  deviceUnregisterController,
  testNotificationController,
};
