// server/routes/device.js
const express = require('express');
const router = express.Router();
const {
  deviceRegisterController,
  deviceUnregisterController,
} = require('~/server/controllers/DeviceController');
const { requireJwtAuth } = require('~/server/middleware/');

router.post('/register', requireJwtAuth, deviceRegisterController);
router.delete('/unregister', requireJwtAuth, (req, res) => {
  // Temporary response until we implement unregister
  res.status(200).json({ success: true });
});
router.post('/test', requireJwtAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    logger.info('[DeviceController] Testing notification for user:', userId);

    const devices = await Device.getUserDevices(userId);
    logger.info(`[DeviceController] Found ${devices.length} devices for testing`);

    await NotificationService.sendTokenClaimNotification(userId);

    res.json({
      success: true,
      message: 'Test notification sent',
      deviceCount: devices.length,
    });
  } catch (error) {
    logger.error('[DeviceController] Test error:', error);
    res.status(500).json({
      error: 'Test failed',
      message: error.message,
    });
  }
});

module.exports = router;
