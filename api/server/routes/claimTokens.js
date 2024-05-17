const express = require('express');
const router = express.Router();
const {
  getUserLastTokenClaimTimestamp,
  claimTokens,
} = require('../controllers/claimTokensController');
const requireJwtAuth = require('../middleware/requireJwtAuth');

router.get('/last-token-claim', requireJwtAuth, getUserLastTokenClaimTimestamp);
router.post('/claim-tokens', requireJwtAuth, claimTokens);

module.exports = router;
