/**
 * CUSTOM: gptchina fork
 *
 * Feature: Model Pricing Display
 * Created: 2025-11-09
 * Updated: 2026-04-01
 * Upstream Impact: None (standalone module)
 */

// CUSTOM: gptchina - tokenValues moved to @librechat/data-schemas in upstream v0.8.4
// getValueKey was removed upstream - use direct lookup + prefix matching instead
const { tokenValues } = require('@librechat/data-schemas');

const getModelPricing = async (req, res) => {
  try {
    const { modelName } = req.params;

    if (!modelName) {
      return res.status(400).json({ error: 'Model name is required' });
    }

    // CUSTOM: gptchina - Direct lookup since getValueKey was removed upstream
    // Try exact match first, then prefix match
    let pricing = tokenValues[modelName];
    if (!pricing) {
      const matchingKey = Object.keys(tokenValues).find(
        (key) => modelName.startsWith(key) || key.startsWith(modelName),
      );
      if (matchingKey) {
        pricing = tokenValues[matchingKey];
      }
    }

    if (!pricing) {
      return res.json({
        model: modelName,
        pricing: null,
        message: 'Pricing not available for this model',
      });
    }

    return res.json({
      model: modelName,
      pricing: {
        prompt: pricing.prompt,
        completion: pricing.completion,
      },
      unit: 'USD per 1M tokens',
    });
  } catch (error) {
    console.error('[Model Pricing] Error fetching pricing:', error);
    return res.status(500).json({ error: 'Failed to fetch pricing information' });
  }
};

const getAllPricing = async (_req, res) => {
  try {
    return res.json({
      pricing: tokenValues,
      unit: 'USD per 1M tokens',
    });
  } catch (error) {
    console.error('[Model Pricing] Error fetching all pricing:', error);
    return res.status(500).json({ error: 'Failed to fetch pricing information' });
  }
};

module.exports = {
  getModelPricing,
  getAllPricing,
};
