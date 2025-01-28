// routes/payment/opennode.js
const express = require('express');
const router = express.Router();
const OpenNodeController = require('../../controllers/payment/OpenNodeController');
const { requireJwtAuth } = require('../../middleware');

router.post('/create-charge', requireJwtAuth, OpenNodeController.createCharge);
router.get('/charge/:chargeId', requireJwtAuth, OpenNodeController.getCharge);

module.exports = router;
