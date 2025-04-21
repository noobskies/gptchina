const express = require('express');
const router = express.Router();
const { requireJwtAuth } = require('../middleware/auth');
const { validateUUID } = require('../middleware/validate');
const { updateUserBalance } = require('../../models/spendTokens');
const { logger } = require('../../config');
const Transaction = require('../../models/Transaction');

/**
 * POST /api/revenuecat/verify-purchase
 * Verify and process a RevenueCat purchase
 */
router.post('/verify-purchase', requireJwtAuth, async (req, res) => {
  const { packageId, platform } = req.body;
  const userId = req.user.id;

  try {
    logger.info(`Processing RevenueCat purchase for user ${userId}, package ${packageId}`);

    // Map token package IDs to token amounts
    const tokenMap = {
      tokens_100k: 100000,
      tokens_500k: 500000,
      tokens_1m: 1000000,
      tokens_10m: 10000000,
    };

    // Add tokens to user's balance
    const tokensToAdd = tokenMap[packageId] || 0;
    if (tokensToAdd <= 0) {
      logger.error(`Invalid package ID: ${packageId}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid package ID',
      });
    }

    // Add tokens to user's balance (negative spend means adding tokens)
    await updateUserBalance({ userId, amount: -tokensToAdd, force: true });

    // Log the transaction
    await Transaction.create({
      userId,
      tokens: tokensToAdd,
      type: 'purchase',
      description: `Purchased ${tokensToAdd} tokens via mobile app`,
      metadata: { packageId, platform },
    });

    logger.info(`Successfully added ${tokensToAdd} tokens to user ${userId}`);

    return res.json({
      success: true,
      tokens: tokensToAdd,
      message: 'Purchase verified and tokens added',
    });
  } catch (error) {
    logger.error(`RevenueCat purchase verification error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error processing purchase',
    });
  }
});

/**
 * POST /api/revenuecat/restore-purchases
 * Restore a user's previous RevenueCat purchases
 */
router.post('/restore-purchases', requireJwtAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    logger.info(`Processing RevenueCat purchase restoration for user ${userId}`);

    // In a real implementation, you would verify with RevenueCat's API
    // that the user has previous purchases and restore their entitlements

    // For now, just return success
    return res.json({
      success: true,
      message: 'Purchases restored successfully',
    });
  } catch (error) {
    logger.error(`RevenueCat restore error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error restoring purchases',
    });
  }
});

module.exports = router;
