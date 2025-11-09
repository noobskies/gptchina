/**
 * CUSTOM: gptchina fork
 *
 * Feature: Claim Tokens
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Controller for handling claim tokens requests.
 */

const { CLAIM_TOKENS_CONFIG, CLAIM_TOKENS_ERRORS } = require('../shared/constants');
const { Balance } = require('../../../../api/db/models');
const { createAutoRefillTransaction } = require('../../../../api/models/Transaction');
const { logger } = require('@librechat/data-schemas');

/**
 * Check if user can claim tokens based on cooldown period
 * @param {Date|null} lastClaimDate - Last claim timestamp
 * @returns {{ canClaim: boolean, nextClaimAvailable: Date|null, remainingTime: number }}
 */
const checkClaimEligibility = (lastClaimDate) => {
  if (!lastClaimDate) {
    // User has never claimed - can claim immediately
    return {
      canClaim: true,
      nextClaimAvailable: null,
      remainingTime: 0,
    };
  }

  const now = new Date();
  const lastClaim = new Date(lastClaimDate);
  const nextClaimTime = new Date(lastClaim.getTime() + CLAIM_TOKENS_CONFIG.COOLDOWN_MS);
  const remainingTime = nextClaimTime.getTime() - now.getTime();

  return {
    canClaim: remainingTime <= 0,
    nextClaimAvailable: remainingTime > 0 ? nextClaimTime : null,
    remainingTime: Math.max(0, remainingTime),
  };
};

/**
 * Handle claim tokens request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const claimTokens = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      logger.error('[ClaimTokens] User ID not found in request');
      return res.status(401).json({
        success: false,
        error: CLAIM_TOKENS_ERRORS.UNAUTHORIZED,
      });
    }

    const now = new Date();
    const cooldownThreshold = new Date(now.getTime() - CLAIM_TOKENS_CONFIG.COOLDOWN_MS);

    // Atomic update: Only update if cooldown has passed or lastTokenClaim is null
    // This prevents race conditions when multiple requests arrive simultaneously
    const updatedBalance = await Balance.findOneAndUpdate(
      {
        user: userId,
        $or: [
          { lastTokenClaim: null }, // Never claimed before
          { lastTokenClaim: { $lte: cooldownThreshold } }, // Cooldown has passed
        ],
      },
      {
        $inc: { tokenCredits: CLAIM_TOKENS_CONFIG.CLAIM_AMOUNT },
        $set: { lastTokenClaim: now },
      },
      {
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        setDefaultsOnInsert: true,
      },
    );

    // If updatedBalance is null, it means cooldown is still active
    if (!updatedBalance) {
      // Fetch current balance to get cooldown info
      const balanceRecord = await Balance.findOne({ user: userId });

      if (balanceRecord && balanceRecord.lastTokenClaim) {
        const eligibility = checkClaimEligibility(balanceRecord.lastTokenClaim);

        logger.debug('[ClaimTokens] Cooldown active', {
          userId,
          remainingTime: eligibility.remainingTime,
          nextClaimAvailable: eligibility.nextClaimAvailable,
        });

        return res.status(429).json({
          success: false,
          error: CLAIM_TOKENS_ERRORS.COOLDOWN_ACTIVE,
          nextClaimAvailable: eligibility.nextClaimAvailable?.toISOString(),
          remainingTime: eligibility.remainingTime,
        });
      }

      // This shouldn't happen, but handle it gracefully
      logger.error('[ClaimTokens] Unexpected state: Update failed but no balance record found');
      return res.status(500).json({
        success: false,
        error: CLAIM_TOKENS_ERRORS.SERVER_ERROR,
      });
    }

    // Create transaction record for audit trail
    try {
      await createAutoRefillTransaction({
        user: userId,
        tokenType: 'credits',
        context: 'claimTokens',
        rawAmount: CLAIM_TOKENS_CONFIG.CLAIM_AMOUNT,
      });
    } catch (txError) {
      logger.error('[ClaimTokens] Failed to create transaction record', txError);
      // Don't fail the request if transaction logging fails
    }

    const previousBalance = updatedBalance.tokenCredits - CLAIM_TOKENS_CONFIG.CLAIM_AMOUNT;

    logger.info('[ClaimTokens] Tokens claimed successfully', {
      userId,
      previousBalance,
      newBalance: updatedBalance.tokenCredits,
      tokensAdded: CLAIM_TOKENS_CONFIG.CLAIM_AMOUNT,
    });

    // Calculate next claim time
    const nextClaimAvailable = new Date(now.getTime() + CLAIM_TOKENS_CONFIG.COOLDOWN_MS);

    return res.status(200).json({
      success: true,
      balance: updatedBalance.tokenCredits,
      tokensAdded: CLAIM_TOKENS_CONFIG.CLAIM_AMOUNT,
      nextClaimAvailable: nextClaimAvailable.toISOString(),
    });
  } catch (error) {
    logger.error('[ClaimTokens] Error processing claim', error);
    return res.status(500).json({
      success: false,
      error: CLAIM_TOKENS_ERRORS.SERVER_ERROR,
    });
  }
};

/**
 * Get current claim status for user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getClaimStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: CLAIM_TOKENS_ERRORS.UNAUTHORIZED,
      });
    }

    const balanceRecord = await Balance.findOne({ user: userId });

    if (!balanceRecord) {
      // User has no balance record - can claim immediately
      return res.status(200).json({
        canClaim: true,
        nextClaimAvailable: null,
        remainingTime: 0,
      });
    }

    const eligibility = checkClaimEligibility(balanceRecord.lastTokenClaim);

    return res.status(200).json({
      canClaim: eligibility.canClaim,
      nextClaimAvailable: eligibility.nextClaimAvailable?.toISOString() || null,
      remainingTime: eligibility.remainingTime,
    });
  } catch (error) {
    logger.error('[ClaimTokens] Error getting claim status', error);
    return res.status(500).json({
      success: false,
      error: CLAIM_TOKENS_ERRORS.SERVER_ERROR,
    });
  }
};

module.exports = {
  claimTokens,
  getClaimStatus,
  checkClaimEligibility,
};
