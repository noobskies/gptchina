// api/server/routes/balance.js
const express = require('express');
const router = express.Router();
const { getBalance, claimTokens, getClaimStatus } = require('../controllers/Balance');
const { requireJwtAuth } = require('../middleware/');

// Get balance route
router.get('/', requireJwtAuth, getBalance);

// Get claim status route
router.get('/claim-tokens', requireJwtAuth, getClaimStatus);

// Claim tokens route
router.post('/claim-tokens', requireJwtAuth, claimTokens);

module.exports = router;
