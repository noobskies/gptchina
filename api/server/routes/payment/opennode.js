// routes/payment/opennode.js
const express = require('express');
const router = express.Router();
const OpenNodeController = require('../../controllers/payment/OpenNodeController');
const { requireJwtAuth } = require('../../middleware');

router.post('/create-charge', requireJwtAuth, OpenNodeController.createCharge);
router.post('/confirm', requireJwtAuth, OpenNodeController.confirmPayment);
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  OpenNodeController.handleWebhook,
);

module.exports = router;
