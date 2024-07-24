const cron = require('node-cron');
const { logger } = require('~/config');
const User = require('~/models/User');
const axios = require('axios');

// Ensure environment variables are loaded
require('dotenv').config();

// Function to get user overview
async function getUserOverview() {
  const totalUsers = await User.countDocuments();
  const newUsers = await User.countDocuments({
    createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
  });
  const activeUsers = await User.countDocuments({
    updatedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
  });

  return {
    totalUsers,
    newUsers,
    activeUsers,
  };
}

// Function to send message to Discord
async function sendUserOverviewToDiscord(overview) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const appTitle = process.env.APP_TITLE || 'Application';

  const message = {
    embeds: [
      {
        title: `${appTitle} - User Overview (5-Minute Update)`,
        color: 3447003, // Blue color
        fields: [
          {
            name: 'Total Users',
            value: overview.totalUsers.toString(),
            inline: true,
          },
          {
            name: 'New Users Today',
            value: overview.newUsers.toString(),
            inline: true,
          },
          {
            name: 'Active Users Today',
            value: overview.activeUsers.toString(),
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    await axios.post(webhookUrl, message);
    logger.info(`[cron] ${appTitle} user overview sent to Discord successfully`);
  } catch (error) {
    logger.error(`[cron] Error sending ${appTitle} user overview to Discord:`, error);
  }
}

// Function to run the user overview job
async function runUserOverviewJob() {
  const appTitle = process.env.APP_TITLE || 'Application';
  try {
    logger.info(`[cron] Starting ${appTitle} user overview job`);
    const overview = await getUserOverview();
    await sendUserOverviewToDiscord(overview);
    logger.info(`[cron] ${appTitle} user overview job completed`);
  } catch (err) {
    logger.error(`[cron] Error in ${appTitle} user overview job:`, err);
  }
}

// Schedule the job to run every 5 minutes
const job = cron.schedule('*/5 * * * *', runUserOverviewJob);

// Log when the cron job is initialized
logger.info(
  `[cron] ${
    process.env.APP_TITLE || 'Application'
  } user overview cron job initialized and scheduled to run every 5 minutes`,
);

// Function to check if the cron job is running
function isCronJobRunning() {
  return job.getStatus() === 'scheduled';
}

module.exports = {
  isCronJobRunning,
};

// Log the cron job status every hour
cron.schedule('0 * * * *', () => {
  const appTitle = process.env.APP_TITLE || 'Application';
  logger.info(
    `[cron] ${appTitle} user overview cron job status: ${
      isCronJobRunning() ? 'running' : 'stopped'
    }`,
  );
});
