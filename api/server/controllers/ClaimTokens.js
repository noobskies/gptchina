const User = require('~/models/User');
const { Transaction } = require('~/models/Transaction');
const Balance = require('~/models/Balance');
const { logger } = require('~/config');

/**
 * Controller for handling token claims
 * Users can claim 20k tokens once every 24 hours
 */
async function claimTokensController(req, res) {
  // Handle POST request for claiming tokens
  if (req.method === 'POST') {
    return await handleClaimTokens(req, res);
  }

  // Handle GET request for checking claim status
  return await handleCheckClaimStatus(req, res);
}

/**
 * Handle POST request for claiming tokens
 */
async function handleClaimTokens(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    const lastClaim = user.lastTokenClaim;
    // Check if 24 hours have passed since last claim
    if (lastClaim) {
      const timeSinceLastClaim = now - new Date(lastClaim);
      const hoursElapsed = timeSinceLastClaim / (1000 * 60 * 60);
      if (hoursElapsed < 24) {
        const timeRemaining = 24 - hoursElapsed;
        return res.status(400).json({
          message: 'You can claim tokens again in ' + Math.ceil(timeRemaining) + ' hours',
          nextClaimTime: new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000),
          canClaim: false,
        });
      }
    }

    // Add 20k tokens to user's balance
    // Create a transaction directly with tokenValue set to ensure it adds to balance
    const transaction = new Transaction({
      user: userId,
      tokenType: 'credits',
      rawAmount: 20000, // 20k tokens
      tokenValue: 20000, // Set tokenValue directly to ensure it adds to balance
      context: 'daily-claim',
    });

    // Save the transaction
    await transaction.save();

    // Update the user's balance
    await Balance.findOneAndUpdate(
      { user: userId },
      { $inc: { tokenCredits: 20000 } },
      { upsert: true },
    );

    // Update last claim timestamp
    user.lastTokenClaim = now;
    await user.save();

    return res.status(200).json({
      message: 'Successfully claimed 20,000 tokens!',
      transaction,
      nextClaimTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      canClaim: false,
    });
  } catch (error) {
    logger.error('[ClaimTokens]', error);
    return res.status(500).json({ message: 'Server error while claiming tokens' });
  }
}

/**
 * Handle GET request for checking if user can claim tokens
 */
async function handleCheckClaimStatus(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    const lastClaim = user.lastTokenClaim;
    // If user has never claimed tokens before, they can claim
    if (!lastClaim) {
      return res.status(200).json({
        canClaim: true,
      });
    }
    // Check if 24 hours have passed since last claim
    const timeSinceLastClaim = now - new Date(lastClaim);
    const hoursElapsed = timeSinceLastClaim / (1000 * 60 * 60);
    if (hoursElapsed < 24) {
      const nextClaimTime = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
      return res.status(200).json({
        canClaim: false,
        nextClaimTime,
      });
    }

    // 24 hours have passed, user can claim again
    return res.status(200).json({
      canClaim: true,
    });
  } catch (error) {
    logger.error('[CheckClaimStatus]', error);
    return res.status(500).json({ message: 'Server error while checking claim status' });
  }
}

module.exports = claimTokensController;
