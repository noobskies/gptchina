const addTokensByUserId = require('../../../config/addTokens');
const { User } = require('~/models');
const { logger } = require('~/config');

const getUserLastTokenClaimTimestamp = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const lastTokenClaimTimestamp = user.lastTokenClaimTimestamp ? user.lastTokenClaimTimestamp.getTime() : 0;
    const tokenClaimCount = user.tokenClaimCount || 0;
    const serverCurrentTime = Date.now();
    console.log('Last token claim timestamp:', lastTokenClaimTimestamp);
    console.log('Token claim count:', tokenClaimCount);
    console.log('Server current time:', serverCurrentTime);
    res.status(200).json({ lastTokenClaimTimestamp, tokenClaimCount, serverCurrentTime });
  } catch (err) {
    logger.error('[getUserLastTokenClaimTimestamp]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const claimTokens = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentTimestamp = Date.now();

    if (
      !user.lastTokenClaimTimestamp ||
      currentTimestamp - user.lastTokenClaimTimestamp.getTime() >= 24 * 60 * 60 * 1000
    ) {
      // User is eligible to claim tokens
      const claimedTokens = 20000; // Number of tokens to claim

      try {
        const newBalance = await addTokensByUserId(user._id, claimedTokens);
        user.lastTokenClaimTimestamp = new Date(currentTimestamp);
        user.tokenClaimCount = (user.tokenClaimCount || 0) + 1; // Increment tokenClaimCount
        await user.save();
        return res.status(200).json({
          message: 'Tokens claimed successfully',
          balance: newBalance,
          tokenClaimCount: user.tokenClaimCount,
          lastTokenClaimTimestamp: currentTimestamp,
        });
      } catch (error) {
        logger.error('[claimTokens] Error updating balance:', error);
        return res.status(500).json({ message: 'Failed to update balance' });
      }
    } else {
      // User is not eligible to claim tokens yet
      const remainingTime = 24 * 60 * 60 * 1000 - (currentTimestamp - user.lastTokenClaimTimestamp.getTime());
      return res.status(400).json({
        message: 'Not eligible to claim tokens yet.',
        remainingTime,
        tokenClaimCount: user.tokenClaimCount || 0,
      });
    }
  } catch (err) {
    logger.error('[claimTokens]', err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUserLastTokenClaimTimestamp,
  claimTokens,
};