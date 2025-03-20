const express = require('express');
const { modelController, modelPricingController } = require('~/server/controllers/ModelController');
const { requireJwtAuth } = require('~/server/middleware/');

const router = express.Router();
router.get('/', requireJwtAuth, modelController);
router.get('/pricing', requireJwtAuth, modelPricingController);

module.exports = router;
