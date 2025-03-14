const express = require('express');
const router = express.Router();
const controller = require('../controllers/ClaimTokens');
const { requireJwtAuth } = require('../middleware/');

router.route('/').post(requireJwtAuth, controller).get(requireJwtAuth, controller);

module.exports = router;
