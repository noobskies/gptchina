/**
 * CUSTOM: gptchina fork
 *
 * Feature: Model Pricing Display
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * This controller provides pricing information for AI models using the
 * existing tx.js pricing data. No duplication - single source of truth.
 *
 * See: custom/features/model-pricing/README.md
 */

const { tokenValues, getValueKey } = require('../../../../api/models/tx');

/**
 * Get pricing information for a specific model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getModelPricing = async (req, res) => {
  try {
    const { modelName } = req.params;
    const { endpoint } = req.query;

    if (!modelName) {
      return res.status(400).json({ error: 'Model name is required' });
    }

    // Get the value key for this model using tx.js logic
    const valueKey = getValueKey(modelName, endpoint);

    if (!valueKey) {
      // Model not found in pricing data
      return res.json({
        model: modelName,
        pricing: null,
        message: 'Pricing not available for this model',
      });
    }

    const pricing = tokenValues[valueKey];

    if (!pricing) {
      return res.json({
        model: modelName,
        pricing: null,
        message: 'Pricing not available for this model',
      });
    }

    // Return pricing in USD per 1M tokens
    res.json({
      model: modelName,
      pricing: {
        prompt: pricing.prompt,
        completion: pricing.completion,
      },
      unit: 'USD per 1M tokens',
    });
  } catch (error) {
    console.error('[Model Pricing] Error fetching pricing:', error);
    res.status(500).json({ error: 'Failed to fetch pricing information' });
  }
};

/**
 * Get all pricing information (optional - for future use)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllPricing = async (req, res) => {
  try {
    res.json({
      pricing: tokenValues,
      unit: 'USD per 1M tokens',
    });
  } catch (error) {
    console.error('[Model Pricing] Error fetching all pricing:', error);
    res.status(500).json({ error: 'Failed to fetch pricing information' });
  }
};

module.exports = {
  getModelPricing,
  getAllPricing,
};
