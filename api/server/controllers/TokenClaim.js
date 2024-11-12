// api/server/controllers/TokenClaim.js
const Balance = require('~/models/Balance');
const { Transaction } = require('~/models/Transaction');

const CLAIM_AMOUNT = 20000;
const COOLDOWN_HOURS = 0.1;

const getClaimStatus = async (req, res) => {
  try {
    const user = req.user.id;
    let balance = await Balance.findOne({ user });
    const now = new Date();

    if (!balance || !balance.lastTokenClaim) {
      const userCreatedAt = new Date(parseInt(user.substring(0, 8), 16) * 1000);
      balance = await Balance.findOneAndUpdate(
        { user },
        {
          $setOnInsert: { tokenCredits: 0 },
          $set: { lastTokenClaim: userCreatedAt },
        },
        { upsert: true, new: true },
      );
    }

    const timeSinceLastClaim = now - balance.lastTokenClaim;
    const hoursSinceLastClaim = timeSinceLastClaim / (1000 * 60 * 60);

    if (hoursSinceLastClaim < COOLDOWN_HOURS) {
      const nextClaimTime = new Date(
        balance.lastTokenClaim.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000,
      );
      return res.json({
        canClaim: false,
        nextClaimTime,
      });
    }

    return res.json({ canClaim: true });
  } catch (error) {
    console.error('Error checking claim status:', error);
    res.status(500).json({ error: 'Failed to check claim status' });
  }
};

const claimTokens = async (req, res) => {
  try {
    const user = req.user.id;
    let balance = await Balance.findOne({ user });
    const now = new Date();

    if (!balance || !balance.lastTokenClaim) {
      const userCreatedAt = new Date(parseInt(user.substring(0, 8), 16) * 1000);
      balance = await Balance.findOneAndUpdate(
        { user },
        {
          $setOnInsert: { tokenCredits: 0 },
          $set: { lastTokenClaim: userCreatedAt },
        },
        { upsert: true, new: true },
      );
    }

    const timeSinceLastClaim = now - balance.lastTokenClaim;
    const hoursSinceLastClaim = timeSinceLastClaim / (1000 * 60 * 60);

    if (hoursSinceLastClaim < COOLDOWN_HOURS) {
      const nextClaimTime = new Date(
        balance.lastTokenClaim.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000,
      );
      return res.status(400).json({
        error: 'Tokens can be claimed once every 24 hours',
        nextClaimTime,
      });
    }

    const transaction = new Transaction({
      user,
      tokenType: 'credits',
      context: 'daily-claim',
      rawAmount: CLAIM_AMOUNT,
    });

    await transaction.save();

    balance = await Balance.findOneAndUpdate(
      { user },
      {
        lastTokenClaim: now,
        $inc: { tokenCredits: CLAIM_AMOUNT },
      },
      { new: true },
    );

    const nextClaimTime = new Date(now.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000);

    res.json({
      success: true,
      balance: balance.tokenCredits,
      nextClaimTime,
    });
  } catch (error) {
    console.error('Token claim error:', error);
    res.status(500).json({ error: 'Failed to claim tokens' });
  }
};

module.exports = {
  getClaimStatus,
  claimTokens,
};
