// ModelController.js
const { CacheKeys } = require('librechat-data-provider');
const { loadDefaultModels, loadConfigModels } = require('~/server/services/Config');
const { getLogStores } = require('~/cache');
const { tokenValues, getMultiplier } = require('~/models/tx');

const getModelsConfig = async (req) => {
  const cache = getLogStores(CacheKeys.CONFIG_STORE);
  let modelsConfig = await cache.get(CacheKeys.MODELS_CONFIG);
  if (!modelsConfig) {
    modelsConfig = await loadModels(req);
  }
  return modelsConfig;
};

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
  const modelConfig = await loadModels(req);
  res.send(modelConfig);
}

async function modelRatesController(req, res) {
  const modelConfig = await loadModels(req);
  const modelRates = {};

  for (const [endpoint, models] of Object.entries(modelConfig)) {
    modelRates[endpoint] = {};
    if (Array.isArray(models)) {
      for (const model of models) {
        modelRates[endpoint][model] = {
          promptRate: getMultiplier({ model, endpoint, tokenType: 'prompt' }),
          completionRate: getMultiplier({ model, endpoint, tokenType: 'completion' }),
        };
      }
    } else if (typeof models === 'object') {
      for (const [modelName, modelData] of Object.entries(models)) {
        const model = typeof modelData === 'string' ? modelData : modelName;
        modelRates[endpoint][model] = {
          promptRate: getMultiplier({ model, endpoint, tokenType: 'prompt' }),
          completionRate: getMultiplier({ model, endpoint, tokenType: 'completion' }),
        };
      }
    }
  }

  res.send(modelRates);
}

module.exports = { modelController, modelRatesController, loadModels, getModelsConfig };
