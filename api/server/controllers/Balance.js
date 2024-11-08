// api/server/controllers/Balance.js
const Balance = require('~/models/Balance');
const { Transaction } = require('~/models/Transaction');

const CLAIM_AMOUNT = 20000;
const COOLDOWN_HOURS = 24;

const getBalance = async (req, res) => {
  try {
    const { tokenCredits: balance = '' } =
      (await Balance.findOne({ user: req.user.id }, 'tokenCredits').lean()) ?? {};
    res.status(200).send('' + balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({ error: 'Failed to get balance' });
  }
};

const getClaimStatus = async (req, res) => {
  try {
    const balance = await Balance.findOne({ user: req.user.id });
    if (!balance || !balance.lastTokenClaim) {
      return res.json({ canClaim: true });
    }

    const now = new Date();
    const lastClaim = balance.lastTokenClaim;
    const timeSinceLastClaim = now - lastClaim;
    const hoursSinceLastClaim = timeSinceLastClaim / (1000 * 60 * 60);

    if (hoursSinceLastClaim < COOLDOWN_HOURS) {
      const nextClaimTime = new Date(lastClaim.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000);
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
    // Find or create user's balance
    let balance = await Balance.findOne({ user: req.user.id });

    const now = new Date();

    if (!balance) {
      balance = await Balance.create({
        user: req.user.id,
        tokenCredits: 0,
        lastTokenClaim: null, // Start with null for new users
      });
    }

    // Check cooldown period if lastTokenClaim exists
    if (balance.lastTokenClaim) {
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
    }

    // Create transaction record
    const txResult = await Transaction.create({
      user: req.user.id,
      tokenType: 'credits',
      context: 'daily-claim',
      rawAmount: CLAIM_AMOUNT,
      tokenValue: CLAIM_AMOUNT,
    });

    // Update lastTokenClaim time
    balance = await Balance.findOneAndUpdate(
      { user: req.user.id },
      {
        lastTokenClaim: now,
        $inc: { tokenCredits: CLAIM_AMOUNT },
      },
      { new: true },
    );

    res.json({
      success: true,
      balance: balance.tokenCredits,
      nextClaimTime: new Date(now.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000),
    });
  } catch (error) {
    console.error('Token claim error:', error);
    res.status(500).json({ error: 'Failed to claim tokens' });
  }
};

module.exports = {
  getBalance,
  claimTokens,
  getClaimStatus,
};
