const cron = require('node-cron');
const { logger } = require('~/config');
const User = require('~/models/User');
const axios = require('axios');

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

  const message = {
    embeds: [
      {
        title: 'User Overview (5-Minute Update)',
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
    logger.info('[cron] User overview sent to Discord successfully');
  } catch (error) {
    logger.error('[cron] Error sending user overview to Discord:', error);
  }
}

// Function to run the user overview job
async function runUserOverviewJob() {
  try {
    logger.info('[cron] Starting user overview job');
    const overview = await getUserOverview();
    await sendUserOverviewToDiscord(overview);
    logger.info('[cron] User overview job completed');
  } catch (err) {
    logger.error('[cron] Error in user overview job:', err);
  }
}

// Schedule the job to run every 5 minutes
cron.schedule('*/5 * * * *', runUserOverviewJob);
