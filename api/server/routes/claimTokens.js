const express = require('express');
const router = express.Router();
const {
  getUserLastTokenClaimTimestamp,
  claimTokens,
} = require('../controllers/claimTokensController');
const requireJwtAuth = require('../middleware/requireJwtAuth');

router.get('/last-claim-timestamp', requireJwtAuth, getUserLastTokenClaimTimestamp);
router.post('/claim', requireJwtAuth, claimTokens);

module.exports = router;
