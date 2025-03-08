const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/Balance');
const claimTokensController = require('../controllers/ClaimTokens');
const { requireJwtAuth } = require('../middleware/');

router.get('/', requireJwtAuth, balanceController);
router.post('/claim', requireJwtAuth, claimTokensController);

module.exports = router;
