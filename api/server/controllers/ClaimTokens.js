const { Transaction } = require('~/models/Transaction');
const Balance = require('~/models/Balance');
const { logger } = require('~/config');

// Cooldown period in hours
const COOLDOWN_HOURS = 24;

/**
 * Controller to handle token claiming
 * Creates a transaction that adds 20,000 tokens to the user's balance
 * Implements a cooldown period to prevent abuse
 */
async function claimTokensController(req, res) {
  try {
    const userId = req.user.id;

    // Find the user's balance
    const balance = await Balance.findOne({ user: userId });

    // Check if the user has claimed tokens in the last 24 hours
    if (balance && balance.lastTokenClaim) {
      const lastClaim = new Date(balance.lastTokenClaim);
      const now = new Date();
      const hoursSinceLastClaim = (now - lastClaim) / (1000 * 60 * 60);

      if (hoursSinceLastClaim < COOLDOWN_HOURS) {
        // Calculate time remaining in seconds
        const secondsRemaining = Math.ceil((COOLDOWN_HOURS - hoursSinceLastClaim) * 60 * 60);
        const nextClaimTime = new Date(lastClaim.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000);

        logger.debug('[claimTokensController] Cooldown period active', {
          userId,
          lastClaim,
          hoursSinceLastClaim,
          secondsRemaining,
          nextClaimTime,
        });

        return res.status(429).json({
          message: 'Cooldown period active',
          cooldown: true,
          secondsRemaining,
          nextClaimTime,
        });
      }
    }

    // Create a transaction to add 20,000 tokens to the user's balance
    const result = await Transaction.create({
      user: userId,
      tokenType: 'credits',
      context: 'claim',
      rawAmount: 20000, // Positive amount to add tokens
    });

    if (!result) {
      logger.error('[claimTokensController] Failed to create transaction');
      return res.status(500).json({ message: 'Failed to claim tokens' });
    }

    // Update the lastTokenClaim timestamp
    await Balance.findOneAndUpdate(
      { user: userId },
      { lastTokenClaim: new Date() },
      { upsert: true },
    );

    const nextClaimTime = new Date(Date.now() + COOLDOWN_HOURS * 60 * 60 * 1000);

    logger.debug('[claimTokensController] Tokens claimed successfully', {
      userId,
      amount: 20000,
      newBalance: result.balance,
      nextClaimTime,
    });

    // Return the updated balance
    return res.status(200).json({
      message: 'Tokens claimed successfully',
      balance: result.balance,
      cooldown: true,
      nextClaimTime,
    });
  } catch (error) {
    logger.error('[claimTokensController] Error claiming tokens', error);
    return res.status(500).json({ message: 'An error occurred while claiming tokens' });
  }
}

module.exports = claimTokensController;
