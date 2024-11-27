// routes/payment/opennode.js
const express = require('express');
const router = express.Router();
const OpenNodeController = require('../../controllers/payment/OpenNodeController');
const { requireJwtAuth } = require('../../middleware');

router.post('/create-charge', requireJwtAuth, OpenNodeController.createCharge);
router.get('/charge/:chargeId', requireJwtAuth, OpenNodeController.getCharge);
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  console.log('Webhook received:', req.body);
  console.log('Webhook headers:', req.headers);
  OpenNodeController.handleWebhook(req, res);
});

module.exports = router;
