/**
 * Cron jobs manager module
 * Centralizes initialization and management of all cron jobs
 */

const { logger } = require('../config');
let userStatsModule = null;

// Job instances
let userStatsJob = null;

/**
 * Initialize all cron jobs
 * @returns {Object} Object containing status check functions for all jobs
 */
function initCronJobs() {
  logger.info('[cron] Initializing cron jobs');

  // Only load modules when explicitly initializing
  if (!userStatsModule) {
    userStatsModule = require('./userStats');
  }

  // Initialize user stats job if not already running
  if (!userStatsJob) {
    userStatsJob = userStatsModule.initJob();
  }

  logger.info('[cron] All cron jobs initialized');

  return {
    userStatsJob: {
      job: userStatsJob,
      isRunning: userStatsModule.isCronJobRunning,
      runManually: userStatsModule.runUserOverviewJob,
    },
    // Add other jobs here
  };
}

module.exports = {
  // Only export the initialization function, not the initialized jobs
  initCronJobs,

  // Getter for initialized jobs - will return null if not initialized
  get jobs() {
    return userStatsJob
      ? {
        userStatsJob: {
          job: userStatsJob,
          isRunning: userStatsModule?.isCronJobRunning || (() => false),
          runManually: userStatsModule?.runUserOverviewJob,
        },
      }
      : null;
  },
};
