const cron = require('node-cron');
const { logger } = require('./api/config');
const User = require('./api/models/User');
const Balance = require('./api/models/Balance');
const axios = require('axios');
require('dotenv').config();

// Function to get user overview
async function getUserOverview() {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));

  const totalVerifiedUsers = await User.countDocuments({ emailVerified: true });
  const newVerifiedUsers = await User.countDocuments({
    createdAt: { $gte: startOfDay },
    emailVerified: true,
  });

  const activeUsers = await Balance.aggregate([
    { $match: { updatedAt: { $gte: startOfDay } } },
    { $group: { _id: '$user', lastUpdate: { $last: '$updatedAt' } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userInfo' } },
    { $match: { 'userInfo.emailVerified': true } },
    { $count: 'activeVerifiedUsers' },
  ]);

  const activeVerifiedUsers = activeUsers.length > 0 ? activeUsers[0].activeVerifiedUsers : 0;

  return { totalVerifiedUsers, newVerifiedUsers, activeVerifiedUsers };
}

// Function to send message to Discord
async function sendUserOverviewToDiscord(overview) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const appAuthor = process.env.VITE_APP_AUTHOR || 'Application Author';

  const message = {
    embeds: [
      {
        title: `${appAuthor} - Daily Verified User Overview`,
        color: 3447003,
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

// Function to run the user overview job
async function runUserOverviewJob() {
  const appAuthor = process.env.VITE_APP_AUTHOR || 'Application Author';
  try {
    logger.info(`[cron] Starting ${appAuthor}'s daily verified user overview job`);
    const overview = await getUserOverview();
    await sendUserOverviewToDiscord(overview);
    logger.info(`[cron] ${appAuthor}'s daily verified user overview job completed`);
  } catch (err) {
    logger.error(`[cron] Error in ${appAuthor}'s daily verified user overview job:`, err);
  }
}

// Run the job immediately for testing
runUserOverviewJob();

// Schedule the job to run every minute for testing purposes
cron.schedule('* * * * *', runUserOverviewJob);

console.log('Cron job test script is running. Press Ctrl+C to exit.');
