const Balance = require('~/models/Balance');
const { logger } = require('~/config');

async function balanceController(req, res) {
  try {
    const balanceDoc =
      (await Balance.findOne({ user: req.user.id }, 'tokenCredits lastTokenClaim').lean()) ?? {};
    const tokenCredits = balanceDoc?.tokenCredits ?? '';
    const lastTokenClaim = balanceDoc?.lastTokenClaim ?? null;

    logger.debug('[balanceController] Returning balance info', {
      userId: req.user.id,
      tokenCredits,
      lastTokenClaim,
    });

    res.status(200).json({
      balance: '' + tokenCredits,
      lastTokenClaim,
    });
  } catch (error) {
    logger.error('[balanceController] Error fetching balance', error);
    res.status(500).json({ message: 'Error fetching balance' });
  }
}

module.exports = balanceController;
