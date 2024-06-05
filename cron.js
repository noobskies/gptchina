// cron.js

const cron = require('node-cron');
const { sendReminderEmails } = require('~/server/controllers/claimTokensController');
const { logger } = require('~/config');

// Schedule the sendReminderEmails function to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    logger.info('[cron] Starting sendReminderEmails job');
    await sendReminderEmails();
    logger.info('[cron] sendReminderEmails job completed');
  } catch (err) {
    logger.error('[cron] Error in sendReminderEmails job:', err);
  }
});
