// routes/payment/inapp.js
const express = require('express');
const router = express.Router();
const InAppController = require('../../controllers/payment/InAppPurchaseController');
const { requireJwtAuth } = require('../../middleware');

router.post('/create-purchase', requireJwtAuth, InAppController.createPurchase);
router.post('/confirm', requireJwtAuth, InAppController.confirmPurchase);

module.exports = router;
