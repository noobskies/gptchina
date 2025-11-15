/**
 * CUSTOM: gptchina fork
 *
 * Feature: Token Info / Pricing Guide
 * Created: 2025-11-14
 * Upstream Impact: None (standalone module)
 *
 * Controller for token pricing information endpoints.
 */

const { tokenValues } = require('../../../../api/models/tx');
const { logger } = require('../../../../api/config');

/**
 * Categorize models into pricing tiers based on total cost per 1M tokens
 * @param {Object} pricing - Object with prompt and completion pricing
 * @returns {'budget'|'mid'|'premium'} - Pricing tier
 */
const categorizePricing = (pricing) => {
  const total = pricing.prompt + pricing.completion;
  if (total <= 2) return 'budget';
  if (total <= 20) return 'mid';
  return 'premium';
};

/**
 * Calculate burn rate (BR) - normalized pricing for easy comparison
 * BR represents how many "units" of tokens are consumed relative to a $1 baseline
 * @param {number} pricePerMillion - Price per 1M tokens in USD
 * @returns {number} Burn rate normalized to $1
 */
const calculateBurnRate = (pricePerMillion) => {
  // Normalize to $1 baseline for easy comparison
  return pricePerMillion;
};

/**
 * Get popular models with their pricing and burn rates, categorized by tier
 * @returns {Object} Categorized pricing data with burn rates
 */
const getPopularModels = () => {
  // Define popular models to display
  const popularModelKeys = [
    // Budget tier
    'gpt-4o-mini',
    'gemini-2.0-flash',
    'claude-3-haiku',
    'gemini-2.0-flash-lite',
    'ministral-8b',
    'qwen-turbo',

    // Mid-range tier
    'gpt-4o',
    'claude-3.5-sonnet',
    'gemini-2.5-pro',
    'gpt-4.1',
    'mistral-large',
    'deepseek-v3',

    // Premium tier
    'o1',
    'claude-opus-4',
    'gpt-4.5',
    'o1-preview',
    'claude-sonnet-4',
    'gpt-5-pro',
  ];

  const categorized = {
    budget: [],
    mid: [],
    premium: [],
  };

  popularModelKeys.forEach((key) => {
    const pricing = tokenValues[key];
    if (pricing) {
      const category = categorizePricing(pricing);
      const inputBR = calculateBurnRate(pricing.prompt);
      const outputBR = calculateBurnRate(pricing.completion);
      const avgBR = (inputBR + outputBR) / 2;

      categorized[category].push({
        model: key,
        input: pricing.prompt,
        output: pricing.completion,
        total: pricing.prompt + pricing.completion,
        burnRate: {
          input: inputBR,
          output: outputBR,
          average: avgBR,
        },
      });
    }
  });

  // Sort each category by total cost
  Object.keys(categorized).forEach((category) => {
    categorized[category].sort((a, b) => a.total - b.total);
  });

  return categorized;
};

/**
 * GET /api/custom/token-pricing
 * Returns categorized pricing data for popular models
 */
const getPricingData = async (req, res) => {
  try {
    const pricingData = getPopularModels();

    res.json({
      success: true,
      data: pricingData,
      metadata: {
        currency: 'USD per 1M tokens',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('[Token Info] Error fetching pricing data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pricing data',
      error: error.message,
    });
  }
};

/**
 * GET /api/custom/token-pricing/calculate
 * Calculate token costs for a given model and word counts
 *
 * Query params:
 * - model: Model name
 * - inputWords: Number of words in input
 * - outputWords: Number of words in output
 */
const calculateCost = async (req, res) => {
  try {
    const { model, inputWords, outputWords } = req.query;

    if (!model || !inputWords || !outputWords) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: model, inputWords, outputWords',
      });
    }

    const pricing = tokenValues[model];
    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: `Pricing not found for model: ${model}`,
      });
    }

    // Convert words to tokens (rough estimate: 1 word ≈ 1.3 tokens)
    const WORDS_TO_TOKENS_MULTIPLIER = 1.3;
    const inputTokens = Math.ceil(parseInt(inputWords) * WORDS_TO_TOKENS_MULTIPLIER);
    const outputTokens = Math.ceil(parseInt(outputWords) * WORDS_TO_TOKENS_MULTIPLIER);

    // Calculate costs (pricing is per 1M tokens)
    const inputCost = (inputTokens / 1_000_000) * pricing.prompt;
    const outputCost = (outputTokens / 1_000_000) * pricing.completion;
    const totalCost = inputCost + outputCost;
    const totalTokens = inputTokens + outputTokens;

    // Calculate how many conversations possible with free tokens
    const FREE_TOKENS = 20_000;
    const conversationsPossible = Math.floor(FREE_TOKENS / totalCost);

    res.json({
      success: true,
      data: {
        model,
        input: {
          words: parseInt(inputWords),
          tokens: inputTokens,
          cost: inputCost,
        },
        output: {
          words: parseInt(outputWords),
          tokens: outputTokens,
          cost: outputCost,
        },
        total: {
          tokens: totalTokens,
          cost: totalCost,
        },
        context: {
          freeTokens: FREE_TOKENS,
          conversationsPossible,
        },
      },
    });
  } catch (error) {
    logger.error('[Token Info] Error calculating cost:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate cost',
      error: error.message,
    });
  }
};

module.exports = {
  getPricingData,
  calculateCost,
  getPopularModels,
};
