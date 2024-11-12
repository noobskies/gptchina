// api/server/routes/balance.js
const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/Balance');
const { getClaimStatus, claimTokens } = require('../controllers/TokenClaim');
const { requireJwtAuth } = require('../middleware/');

// Original balance route
router.get('/', requireJwtAuth, balanceController);

// Token claim routes
router.get('/claim-tokens', requireJwtAuth, getClaimStatus);
router.post('/claim-tokens', requireJwtAuth, claimTokens);

module.exports = router;
