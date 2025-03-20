const { CacheKeys } = require('librechat-data-provider');
const { loadDefaultModels, loadConfigModels } = require('~/server/services/Config');
const { getLogStores } = require('~/cache');
const { logger } = require('~/config');
const { tokenValues, getValueKey, defaultRate } = require('~/models/tx');

/**
 * @param {ServerRequest} req
 */
const getModelsConfig = async (req) => {
  const cache = getLogStores(CacheKeys.CONFIG_STORE);
  let modelsConfig = await cache.get(CacheKeys.MODELS_CONFIG);
  if (!modelsConfig) {
    modelsConfig = await loadModels(req);
  }

  return modelsConfig;
};

/**
 * Loads the models from the config.
 * @param {ServerRequest} req - The Express request object.
 * @returns {Promise<TModelsConfig>} The models config.
 */
async function loadModels(req) {
  const cache = getLogStores(CacheKeys.CONFIG_STORE);
  const cachedModelsConfig = await cache.get(CacheKeys.MODELS_CONFIG);
  if (cachedModelsConfig) {
    return cachedModelsConfig;
  }
  const defaultModelsConfig = await loadDefaultModels(req);
  const customModelsConfig = await loadConfigModels(req);

  const modelConfig = { ...defaultModelsConfig, ...customModelsConfig };

  await cache.set(CacheKeys.MODELS_CONFIG, modelConfig);
  return modelConfig;
}

async function modelController(req, res) {
  try {
    const modelConfig = await loadModels(req);
    res.send(modelConfig);
  } catch (error) {
    logger.error('Error fetching models:', error);
    res.status(500).send({ error: error.message });
  }
}

/**
 * Controller function to get pricing information for models.
 * @param {ServerRequest} req - The Express request object.
 * @param {ServerResponse} res - The Express response object.
 */
async function modelPricingController(req, res) {
  try {
    // Get the model pricing information from tx.js
    const modelPricing = {
      // Add a fallback entry for models not explicitly listed
      default: {
        input: defaultRate,
        output: defaultRate,
      },
    };

    // Iterate through all models in tokenValues
    for (const [model, values] of Object.entries(tokenValues)) {
      if (values.prompt !== undefined && values.completion !== undefined) {
        modelPricing[model] = {
          input: values.prompt,
          output: values.completion,
        };
      }
    }

    res.send(modelPricing);
  } catch (error) {
    logger.error('Error fetching model pricing:', error);
    res.status(500).send({ error: error.message });
  }
}

module.exports = { modelController, modelPricingController, loadModels, getModelsConfig };
