// routes/models.js
const express = require('express');
const { modelController, modelRatesController } = require('~/server/controllers/ModelController');
const { requireJwtAuth } = require('~/server/middleware/');

const router = express.Router();
router.get('/', requireJwtAuth, modelController);
router.get('/rates', requireJwtAuth, modelRatesController);

module.exports = router;
