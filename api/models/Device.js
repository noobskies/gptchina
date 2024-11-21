// server/models/Device.js
const mongoose = require('mongoose');
const { logger } = require('~/config');

const deviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  platform: {
    type: String,
    enum: ['ios', 'android'],
    required: true,
  },
  lastNotified: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Device = mongoose.model('Device', deviceSchema);

const registerDevice = async (userId, token, platform) => {
  try {
    logger.info('[Device.registerDevice] Attempting to register device:');

    const device = await Device.findOneAndUpdate(
      { token },
      {
        userId,
        platform,
        updatedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      },
    );

    logger.info('[Device.registerDevice] Device registered successfully:');
    return device;
  } catch (error) {
    logger.error('[Device.registerDevice] Error:', error);
    throw error;
  }
};

const getUserDevices = async (userId) => {
  try {
    const devices = await Device.find({ userId }).lean();
    logger.info(`[Device.getUserDevices] Found ${devices.length} devices for user ${userId}`);
    return devices;
  } catch (error) {
    logger.error('[Device.getUserDevices] Error:', error);
    throw error;
  }
};

const updateLastNotified = async (userId) => {
  try {
    const result = await Device.updateMany({ userId }, { $set: { lastNotified: new Date() } });
    logger.info('[Device.updateLastNotified] Updated devices:', result);
    return result;
  } catch (error) {
    logger.error('[Device.updateLastNotified] Error:', error);
    throw error;
  }
};

const removeInvalidTokens = async (tokens) => {
  try {
    const result = await Device.deleteMany({ token: { $in: tokens } });
    logger.info('[Device.removeInvalidTokens] Removed tokens:', result);
    return result.deletedCount;
  } catch (error) {
    logger.error('[Device.removeInvalidTokens] Error:', error);
    throw error;
  }
};

// Add this new function
const findById = async (id) => {
  try {
    const device = await Device.findById(id).lean();
    logger.info(`[Device.findById] ${device ? 'Found' : 'Did not find'} device with id ${id}`);
    return device;
  } catch (error) {
    logger.error('[Device.findById] Error:', error);
    throw error;
  }
};

module.exports = {
  registerDevice,
  getUserDevices,
  updateLastNotified,
  removeInvalidTokens,
  findById, // Add this to exports
};
