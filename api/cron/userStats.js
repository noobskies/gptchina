const cron = require('node-cron');
const axios = require('axios');
const { logger } = require('../config');
const User = require('../models/User');
const Balance = require('../models/Balance');

// Ensure environment variables are loaded
require('dotenv').config();

/**
 * Gets user overview statistics
 * @returns {Promise<Object>} User statistics object
 */
async function getUserOverview() {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));

  const totalVerifiedUsers = await User.countDocuments({ emailVerified: true });
  const newVerifiedUsers = await User.countDocuments({
    createdAt: { $gte: startOfDay },
    emailVerified: true,
  });

  // Find verified users with balance changes today
  const activeUsers = await Balance.aggregate([
    {
      $match: {
        updatedAt: { $gte: startOfDay },
      },
    },
    {
      $group: {
        _id: '$user',
        lastUpdate: { $last: '$updatedAt' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo',
      },
    },
    {
      $match: {
        'userInfo.emailVerified': true,
      },
    },
    {
      $count: 'activeVerifiedUsers',
    },
  ]);

  const activeVerifiedUsers = activeUsers.length > 0 ? activeUsers[0].activeVerifiedUsers : 0;

  return {
    totalVerifiedUsers,
    newVerifiedUsers,
    activeVerifiedUsers,
  };
}

/**
 * Sends user stats to Discord webhook
 * @param {Object} overview User statistics overview
 * @returns {Promise<void>}
 */
async function sendUserOverviewToDiscord(overview) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const appAuthor = process.env.VITE_APP_AUTHOR || 'LibreChat';

  // Return early if webhook URL is not configured
  if (!webhookUrl) {
    logger.warn('[cron] Discord webhook URL not configured. Skipping user overview report.');
    return;
  }

  const message = {
    embeds: [
      {
        title: `${appAuthor} - Daily Verified User Overview`,
        color: 3447003, // Blue color
        fields: [
          {
            name: 'Total Verified Users',
            value: overview.totalVerifiedUsers.toString(),
            inline: true,
          },
          {
            name: 'New Verified Users Today',
            value: overview.newVerifiedUsers.toString(),
            inline: true,
          },
          {
            name: 'Active Verified Users Today',
            value: overview.activeVerifiedUsers.toString(),
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    await axios.post(webhookUrl, message);
    logger.info(`[cron] ${appAuthor}'s daily verified user overview sent to Discord successfully`);
  } catch (error) {
    logger.error(
      `[cron] Error sending ${appAuthor}'s daily verified user overview to Discord:`,
      error,
    );
  }
}

/**
 * Runs the user overview job
 * @returns {Promise<void>}
 */
async function runUserOverviewJob() {
  const appAuthor = process.env.VITE_APP_AUTHOR || 'LibreChat';
  try {
    logger.info(`[cron] Starting ${appAuthor}'s daily verified user overview job`);
    const overview = await getUserOverview();
    await sendUserOverviewToDiscord(overview);
    logger.info(`[cron] ${appAuthor}'s daily verified user overview job completed`);
  } catch (err) {
    logger.error(`[cron] Error in ${appAuthor}'s daily verified user overview job:`, err);
  }
}

// Schedule the job to run every day at 9 AM Chicago time
const job = cron.schedule('0 9 * * *', runUserOverviewJob, {
  scheduled: true,
  timezone: 'America/Chicago',
});

/**
 * Checks if the cron job is running
 * @returns {boolean} True if job is running
 */
function isCronJobRunning() {
  return job.getStatus() === 'scheduled';
}

// Log when the cron job is initialized
logger.info(
  `[cron] ${
    process.env.VITE_APP_AUTHOR || 'LibreChat'
  }'s daily verified user overview cron job initialized and scheduled to run every day at 9 AM Chicago time`,
);

// Log the cron job status once a day
cron.schedule('0 0 * * *', () => {
  const appAuthor = process.env.VITE_APP_AUTHOR || 'LibreChat';
  logger.info(
    `[cron] ${appAuthor}'s daily verified user overview cron job status: ${
      isCronJobRunning() ? 'running' : 'stopped'
    }`,
  );
});

// Check for manual execution flag
if (process.argv.includes('--manual')) {
  logger.info('[cron] Manual execution of user overview job triggered');
  runUserOverviewJob()
    .then(() => {
      logger.info('[cron] Manual execution completed');
      // Use a slight delay to ensure all logs are printed before exit
      setTimeout(() => process.exit(0), 1000);
    })
    .catch((err) => {
      logger.error('[cron] Error in manual execution:', err);
      process.exit(1);
    });
}

module.exports = {
  job,
  isCronJobRunning,
  runUserOverviewJob, // Exported for manual execution if needed
};
