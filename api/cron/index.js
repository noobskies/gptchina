/**
 * Cron jobs manager module
 * Centralizes initialization and management of all cron jobs
 */

const { job, isCronJobRunning, runUserOverviewJob } = require('./userStats');
const { logger } = require('../config');

/**
 * Initialize all cron jobs
 * @returns {Object} Object containing status check functions for all jobs
 */
function initCronJobs() {
  logger.info('[cron] Initializing cron jobs');

  // The userStats job is automatically initialized on import
  // Add initialization for any additional cron jobs here

  logger.info('[cron] All cron jobs initialized');

  return {
    userStatsJob: {
      job,
      isRunning: isCronJobRunning,
      runManually: runUserOverviewJob,
    },
    // Add other jobs here
  };
}

// Object containing status check functions for all jobs
const cronJobs = initCronJobs();

module.exports = {
  cronJobs,
  initCronJobs,
};
