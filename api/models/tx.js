const { matchModelName } = require('../utils');
const defaultRate = 3;

/**

Mapping of model token sizes to their respective multipliers for prompt and completion.
The rates are 1 USD per 1M tokens.
@type {Object.<string, {prompt: number, completion: number}>} */
const tokenValues = {
  '8k': { prompt: 33.6, completion: 67.1 },
  '32k': { prompt: 67.1, completion: 134.2 },
  '4k': { prompt: 2.2, completion: 2.7 },
  '16k': { prompt: 3.8, completion: 4.9 },
  'gpt-3.5-turbo-1106': { prompt: 0.6, completion: 0.8 },
  'gpt-4o': { prompt: 2.2, completion: 4.9 },
  'gpt-4o-mini': { prompt: 0.25, completion: 0.6 },
  'gpt-4-1106': { prompt: 3.8, completion: 9.3 },
  'gpt-3.5-turbo-0125': { prompt: 0.6, completion: 0.8 },
  'claude-3-opus': { prompt: 9.3, completion: 22.5 },
  'claude-3-sonnet': { prompt: 1.2, completion: 4.6 },
  'claude-3-haiku': { prompt: 0.6, completion: 0.8 },
  'claude-2.1': { prompt: 9.3, completion: 26.9 },
  'claude-2': { prompt: 9.3, completion: 26.9 },
  'claude-': { prompt: 6.0, completion: 11.5 },
  'command-r-plus': { prompt: 3.8, completion: 17.0 },
  'command-r': { prompt: 1.1, completion: 2.2 },
  /* cohere doesn't have rates for the older command models,
so this was from https://artificialanalysis.ai/models/command-light/providers */
  command: { prompt: 0.9, completion: 0.9 },
  'gemini-1.5': { prompt: 2.7, completion: 7.1 }, // May 2nd, 2024 pricing
  gemini: { prompt: 0.6, completion: 0.8 }, // May 2nd, 2024 pricing
  // start perplexity usage
  'llama-3.1-sonar-small-128k-chat': { prompt: 0.7, completion: 0.7 },
  'llama-3.1-sonar-small-128k-online': { prompt: 0.7, completion: 0.7 },
  'llama-3.1-sonar-large-128k-chat': { prompt: 1.6, completion: 1.6 },
  'llama-3.1-sonar-large-128k-online': { prompt: 1.6, completion: 1.6 },
  'llama-3.1-70b-instruct': { prompt: 1.6, completion: 1.6 },
  'llama-3.1-8b-instruct': { prompt: 0.7, completion: 0.7 },
  // end perplexity usage

  // groq
  'llama3-70b-8192': { prompt: 1.2, completion: 1.4 },
  'llama3-8b-8192': { prompt: 0.6, completion: 0.6 },
  'llama2-70b-4096': { prompt: 1.3, completion: 1.4 },
  'mixtral-8x7b-32768': { prompt: 0.8, completion: 0.8 },
  'gemma-7b-it': { prompt: 0.6, completion: 0.6 },
  // end groq

  // mistral
  'open-mistral-7b': { prompt: 0.6, completion: 0.6 },
  'open-mixtral-8x7b': { prompt: 0.8, completion: 0.8 },
  'mistral-tiny': { prompt: 0.6, completion: 0.6 },
  'open-mixtral-8x22b': { prompt: 1.3, completion: 2.7 },
  'open-mixtral-8x22b-2404': { prompt: 1.3, completion: 2.7 },
  'mistral-small-2312': { prompt: 0.7, completion: 1.2 },
  'mistral-small': { prompt: 0.7, completion: 1.2 },
  'mistral-small-2402': { prompt: 0.7, completion: 1.2 },
  'mistral-small-latest': { prompt: 0.7, completion: 1.2 },
  'mistral-medium-latest': { prompt: 1.1, completion: 2.2 },
  'mistral-medium-2312': { prompt: 1.1, completion: 2.2 },
  'mistral-medium': { prompt: 1.1, completion: 2.2 },
  'mistral-large-latest': { prompt: 1.4, completion: 3.3 },
  'mistral-large-2402': { prompt: 1.4, completion: 3.3 },
  'mistral-large-2407': { prompt: 1.4, completion: 3.3 },
  'codestral-2405': { prompt: 0.8, completion: 1.3 },
  'codestral-latest': { prompt: 0.8, completion: 1.3 },
  'mistral-embed': { prompt: 0.6, completion: 0.6 },
  // end mistral
};

/**

Retrieves the key associated with a given model name.
@param {string} model - The model name to match.
@param {string} endpoint - The endpoint name to match.
@returns {string|undefined} The key corresponding to the model name, or undefined if no match is found. */
const getValueKey = (model, endpoint) => {
  const modelName = matchModelName(model, endpoint);
  if (!modelName) {
    return undefined;
  }
  if (modelName.includes('gpt-3.5-turbo-16k')) {
    return '16k';
  } else if (modelName.includes('gpt-3.5-turbo-0125')) {
    return 'gpt-3.5-turbo-0125';
  } else if (modelName.includes('gpt-3.5-turbo-1106')) {
    return 'gpt-3.5-turbo-1106';
  } else if (modelName.includes('gpt-3.5')) {
    return '4k';
  } else if (modelName.includes('gpt-4o-mini')) {
    return 'gpt-4o-mini';
  } else if (modelName.includes('gpt-4o')) {
    return 'gpt-4o';
  } else if (modelName.includes('gpt-4-vision')) {
    return 'gpt-4-1106';
  } else if (modelName.includes('gpt-4-1106')) {
    return 'gpt-4-1106';
  } else if (modelName.includes('gpt-4-0125')) {
    return 'gpt-4-1106';
  } else if (modelName.includes('gpt-4-turbo')) {
    return 'gpt-4-1106';
  } else if (modelName.includes('gpt-4-32k')) {
    return '32k';
  } else if (modelName.includes('gpt-4')) {
    return '8k';
  } else if (tokenValues[modelName]) {
    return modelName;
  }

  return undefined;
};

/**
 * Retrieves the multiplier for a given value key and token type. If no value key is provided,
 * it attempts to derive it from the model name.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} [params.valueKey] - The key corresponding to the model name.
 * @param {string} [params.tokenType] - The type of token (e.g., 'prompt' or 'completion').
 * @param {string} [params.model] - The model name to derive the value key from if not provided.
 * @param {string} [params.endpoint] - The endpoint name to derive the value key from if not provided.
 * @param {EndpointTokenConfig} [params.endpointTokenConfig] - The token configuration for the endpoint.
 * @returns {number} The multiplier for the given parameters, or a default value if not found.
 */
const getMultiplier = ({ valueKey, tokenType, model, endpoint, endpointTokenConfig }) => {
  if (endpointTokenConfig) {
    return endpointTokenConfig?.[model]?.[tokenType] ?? defaultRate;
  }

  if (valueKey && tokenType) {
    return tokenValues[valueKey][tokenType] ?? defaultRate;
  }

  if (!tokenType || !model) {
    return 1;
  }

  valueKey = getValueKey(model, endpoint);
  if (!valueKey) {
    return defaultRate;
  }

  // If we got this far, and values[tokenType] is undefined somehow, return a rough average of default multipliers
  return tokenValues[valueKey][tokenType] ?? defaultRate;
};

module.exports = { tokenValues, getValueKey, getMultiplier, defaultRate };
