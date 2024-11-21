// server/cron/tokenNotifications.js
const cron = require('node-cron');
const { logger } = require('~/config');
const User = require('~/models/User');
const NotificationService = require('../services/Notifications/NotificationService');

// Run every minute for testing
cron.schedule('* * * * *', async () => {
  const appAuthor = process.env.VITE_APP_AUTHOR || 'Application Author';
  try {
    logger.info(`[cron] Starting ${appAuthor}'s token claim notification job`);

    // For testing, get users with lastTokenClaim older than 1 minute
    const users = await User.find({
      lastTokenClaim: {
        $lt: new Date(Date.now() - 60 * 1000), // 1 minute ago
      },
    }).lean();

    logger.info(`[cron] Found ${users.length} users eligible for token claims`);

    for (const user of users) {
      try {
        logger.info(`[cron] Processing user ${user._id}`);
        await NotificationService.sendTokenClaimNotification(user._id);
        logger.info(`[cron] Successfully processed user ${user._id}`);
      } catch (error) {
        logger.error(`[cron] Failed to send notification to user ${user._id}:`, error);
      }
    }

    logger.info(`[cron] ${appAuthor}'s token claim notification job completed`);
  } catch (error) {
    logger.error(`[cron] Error in ${appAuthor}'s token claim notification job:`, error);
  }
});

logger.info(
  `[cron] ${
    process.env.VITE_APP_AUTHOR || 'Application Author'
  }'s token claim notification job initialized`,
);
