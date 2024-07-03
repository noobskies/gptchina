const { matchModelName } = require('../utils');
const defaultRate = 3;

/**

Mapping of model token sizes to their respective multipliers for prompt and completion.
The rates are 1 USD per 1M tokens.
@type {Object.<string, {prompt: number, completion: number}>} */
const tokenValues = {
  '8k': { prompt: 30.25, completion: 60.25 },
  '32k': { prompt: 60.25, completion: 120.25 },
  '4k': { prompt: 1.75, completion: 2.25 },
  '16k': { prompt: 3.25, completion: 4.25 },
  'gpt-3.5-turbo-1106': { prompt: 0.35, completion: 0.55 },
  'gpt-4o': { prompt: 1.75, completion: 4.25 },
  'gpt-4-1106': { prompt: 3.25, completion: 8.25 },
  'gpt-3.5-turbo-0125': { prompt: 0.35, completion: 0.55 },
  'claude-3-opus': { prompt: 8.25, completion: 20.25 },
  'claude-3-sonnet': { prompt: 0.85, completion: 4 },
  'claude-3-haiku': { prompt: 0.35, completion: 0.55 },
  'claude-2.1': { prompt: 8.25, completion: 24.25 },
  'claude-2': { prompt: 8.25, completion: 24.25 },
  'claude-': { prompt: 5.25, completion: 10.25 },
  'command-r-plus': { prompt: 3.25, completion: 15.25 },
  'command-r': { prompt: 0.75, completion: 1.75 },
  /* cohere doesn't have rates for the older command models,
so this was from https://artificialanalysis.ai/models/command-light/providers */
  command: { prompt: 0.63, completion: 0.63 },
  'gemini-1.5': { prompt: 2.25, completion: 6.25 }, // May 2nd, 2024 pricing
  gemini: { prompt: 0.35, completion: 0.5 }, // May 2nd, 2024 pricing
  // start perplexity usage
  'llama-3-sonar-small-32k-chat': { prompt: 0.45, completion: 0.45 },
  'llama-3-sonar-small-32k-online': { prompt: 0.45, completion: 0.45 },
  'llama-3-sonar-large-32k-chat': { prompt: 1.25, completion: 1.25 },
  'llama-3-sonar-large-32k-online': { prompt: 1.25, completion: 1.25 },
  // end perplexity usage

  // groq
  'llama3-70b-8192': { prompt: 0.84, completion: 1.04 },
  'llama3-8b-8192': { prompt: 0.3, completion: 0.35 },
  'llama2-70b-4096': { prompt: 0.95, completion: 1.05 },
  'mixtral-8x7b-32768': { prompt: 0.49, completion: 0.49 },
  'gemma-7b-it': { prompt: 0.35, completion: 0.35 },
  // end groq

  // mistral
  'open-mistral-7b': { prompt: 0.3, completion: 0.3 },
  'open-mixtral-8x7b': { prompt: 0.49, completion: 0.49 },
  'mistral-tiny': { prompt: 0.3, completion: 0.3 },
  'open-mixtral-8x22b': { prompt: 0.95, completion: 2.25 },
  'open-mixtral-8x22b-2404': { prompt: 0.95, completion: 2.25 },
  'mistral-small-2312': { prompt: 0.45, completion: 0.85 },
  'mistral-small': { prompt: 0.45, completion: 0.85 },
  'mistral-small-2402': { prompt: 0.45, completion: 0.85 },
  'mistral-small-latest': { prompt: 0.45, completion: 0.85 },
  'mistral-medium-latest': { prompt: 0.8, completion: 1.75 },
  'mistral-medium-2312': { prompt: 0.75, completion: 1.75 },
  'mistral-medium': { prompt: 0.75, completion: 1.75 },
  'mistral-large-latest': { prompt: 1.05, completion: 2.75 },
  'mistral-large-2402': { prompt: 1.05, completion: 2.75 },
  'codestral-2405': { prompt: 0.5, completion: 1 },
  'codestral-latest': { prompt: 0.5, completion: 1 },
  'mistral-embed': { prompt: 0.3, completion: 0.3 },
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
