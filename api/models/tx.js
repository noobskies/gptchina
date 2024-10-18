const { matchModelName } = require('../utils');
const defaultRate = 3;

/** AWS Bedrock pricing */
const bedrockValues = {
  'llama2-13b': { prompt: 0.75, completion: 1.0 },
  'llama2-70b': { prompt: 1.95, completion: 2.56 },
  'llama3-8b': { prompt: 0.3, completion: 0.6 },
  'llama3-70b': { prompt: 2.65, completion: 3.5 },
  'llama3-1-8b': { prompt: 0.3, completion: 0.6 },
  'llama3-1-70b': { prompt: 2.65, completion: 3.5 },
  'llama3-1-405b': { prompt: 5.32, completion: 16.0 },
  'mistral-7b': { prompt: 0.15, completion: 0.2 },
  'mistral-small': { prompt: 0.15, completion: 0.2 },
  'mixtral-8x7b': { prompt: 0.45, completion: 0.7 },
  'mistral-large-2402': { prompt: 4.0, completion: 12.0 },
  'mistral-large-2407': { prompt: 3.0, completion: 9.0 },
  'command-text': { prompt: 1.5, completion: 2.0 },
  'command-light': { prompt: 0.3, completion: 0.6 },
  'ai21.j2-mid-v1': { prompt: 12.5, completion: 12.5 },
  'ai21.j2-ultra-v1': { prompt: 18.8, completion: 18.8 },
  'ai21.jamba-instruct-v1:0': { prompt: 0.5, completion: 0.7 },
  'amazon.titan-text-lite-v1': { prompt: 0.15, completion: 0.2 },
  'amazon.titan-text-express-v1': { prompt: 0.2, completion: 0.6 },
  'amazon.titan-text-premier-v1:0': { prompt: 0.5, completion: 1.5 },
};

/**
 * Mapping of model token sizes to their respective multipliers for prompt and completion.
 * The rates are 1 USD per 1M tokens.
 * @type {Object.<string, {prompt: number, completion: number}>}
 */
const tokenValues = Object.assign(
  {
    '8k': { prompt: 33.6, completion: 67.1 },
    '32k': { prompt: 67.1, completion: 134.2 },
    '4k': { prompt: 2.2, completion: 2.7 },
    '16k': { prompt: 3.8, completion: 4.9 },
    'gpt-3.5-turbo-1106': { prompt: 0.6, completion: 0.8 },
    'gpt-4o': { prompt: 2.2, completion: 4.9 },
    'gpt-4o-mini': { prompt: 0.25, completion: 0.6 },
    'o1-preview': { prompt: 7.5, completion: 16 },
    'o1-mini': { prompt: 1.5, completion: 4 },
    'gpt-4-1106': { prompt: 3.8, completion: 9.3 },
    'gpt-3.5-turbo-0125': { prompt: 0.6, completion: 0.8 },
    'claude-3-5-sonnet-20240620': { prompt: 2.2, completion: 4.9 },
    'claude-3-opus': { prompt: 9.3, completion: 22.5 },
    'claude-3-sonnet': { prompt: 1.2, completion: 4.6 },
    'claude-3-haiku': { prompt: 0.6, completion: 0.8 },
    'claude-2.1': { prompt: 9.3, completion: 26.9 },
    'claude-2': { prompt: 9.3, completion: 26.9 },
    'claude-': { prompt: 6.0, completion: 11.5 },
    'command-r-plus': { prompt: 3.8, completion: 17.0 },
    'command-r': { prompt: 1.1, completion: 2.2 },
    command: { prompt: 0.9, completion: 0.9 },
    'gemini-1.5-flash-latest': { prompt: 0.35, completion: 1.05 },
    'gemini-1.0-pro': { prompt: 0.5, completion: 1.5 },
    'gemini-1.0-pro-001': { prompt: 0.5, completion: 1.5 },
    'gemini-1.0-pro-latest': { prompt: 0.5, completion: 1.5 },
    'gemini-1.0-pro-vision-latest': { prompt: 0.5, completion: 1.5 },
    'gemini-1.5-pro-latest': { prompt: 2.2, completion: 4.9 },
    'gemini-pro': { prompt: 0.5, completion: 1.5 },
    'gemini-pro-vision': { prompt: 0.5, completion: 1.5 },
    'gemini-1.5-pro-exp-0801': { prompt: 2.2, completion: 4.9 },
    'llama-3.1-sonar-small-128k-chat': { prompt: 0.7, completion: 0.7 },
    'llama-3.1-sonar-small-128k-online': { prompt: 0.7, completion: 0.7 },
    'llama-3.1-sonar-large-128k-chat': { prompt: 1.6, completion: 1.6 },
    'llama-3.1-sonar-large-128k-online': { prompt: 1.6, completion: 1.6 },
    'llama-3.1-70b-instruct': { prompt: 1.6, completion: 1.6 },
    'llama-3.1-8b-instruct': { prompt: 0.7, completion: 0.7 },
    'llama3-70b-8192': { prompt: 1.2, completion: 1.4 },
    'llama3-8b-8192': { prompt: 0.6, completion: 0.6 },
    'llama2-70b-4096': { prompt: 1.3, completion: 1.4 },
    'mixtral-8x7b-32768': { prompt: 0.8, completion: 0.8 },
    'gemma-7b-it': { prompt: 0.6, completion: 0.6 },
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
    'claude-3.5-sonnet': { prompt: 2.2, completion: 4.9 },
    'gpt-4o-2024-08-06': { prompt: 2.5, completion: 10 },
    o1: { prompt: 15, completion: 60 },
    'gemini-1.5': { prompt: 7, completion: 21 },
    gemini: { prompt: 0.5, completion: 1.5 },
  },
  bedrockValues,
);

/**
 * Mapping of model token sizes to their respective multipliers for cached input, read and write.
 * See Anthropic's documentation on this: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching#pricing
 * The rates are 1 USD per 1M tokens.
 * @type {Object.<string, {write: number, read: number }>}
 */
const cacheTokenValues = {
  'claude-3.5-sonnet': { write: 3.75, read: 0.3 },
  'claude-3-5-sonnet': { write: 3.75, read: 0.3 },
  'claude-3-haiku': { write: 0.3, read: 0.03 },
};

/**
 * Retrieves the key associated with a given model name.
 *
 * @param {string} model - The model name to match.
 * @param {string} endpoint - The endpoint name to match.
 * @returns {string|undefined} The key corresponding to the model name, or undefined if no match is found.
 */
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
  } else if (modelName.includes('o1-preview')) {
    return 'o1-preview';
  } else if (modelName.includes('o1-mini')) {
    return 'o1-mini';
  } else if (modelName.includes('o1')) {
    return 'o1';
  } else if (modelName.includes('gpt-4o-2024-08-06')) {
    return 'gpt-4o-2024-08-06';
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
  } else if (modelName.includes('gemini-1.5-flash-latest')) {
    return 'gemini-1.5-flash-latest';
  } else if (modelName.includes('gemini-1.5-pro-latest')) {
    return 'gemini-1.5-pro-latest';
  } else if (modelName.includes('gemini-1.0-pro-vision-latest')) {
    return 'gemini-1.0-pro-vision-latest';
  } else if (modelName.includes('gemini-1.0-pro-latest')) {
    return 'gemini-1.0-pro-latest';
  } else if (modelName.includes('gemini-1.0-pro-001')) {
    return 'gemini-1.0-pro-001';
  } else if (modelName.includes('gemini-1.0-pro')) {
    return 'gemini-1.0-pro';
  } else if (modelName.includes('gemini-pro-vision')) {
    return 'gemini-pro-vision';
  } else if (modelName.includes('gemini-pro')) {
    return 'gemini-pro';
  } else if (modelName.includes('gemini-1.5-pro-exp-0801')) {
    return 'gemini-1.5-pro-exp-0801';
  } else if (modelName.includes('gemini')) {
    return 'gemini-1.0-pro';
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
 * @param {'prompt' | 'completion'} [params.tokenType] - The type of token (e.g., 'prompt' or 'completion').
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
  return tokenValues[valueKey]?.[tokenType] ?? defaultRate;
};

/**
 * Retrieves the cache multiplier for a given value key and token type. If no value key is provided,
 * it attempts to derive it from the model name.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} [params.valueKey] - The key corresponding to the model name.
 * @param {'write' | 'read'} [params.cacheType] - The type of token (e.g., 'write' or 'read').
 * @param {string} [params.model] - The model name to derive the value key from if not provided.
 * @param {string} [params.endpoint] - The endpoint name to derive the value key from if not provided.
 * @param {EndpointTokenConfig} [params.endpointTokenConfig] - The token configuration for the endpoint.
 * @returns {number | null} The multiplier for the given parameters, or `null` if not found.
 */
const getCacheMultiplier = ({ valueKey, cacheType, model, endpoint, endpointTokenConfig }) => {
  if (endpointTokenConfig) {
    return endpointTokenConfig?.[model]?.[cacheType] ?? null;
  }

  if (valueKey && cacheType) {
    return cacheTokenValues[valueKey]?.[cacheType] ?? null;
  }

  if (!cacheType || !model) {
    return null;
  }

  valueKey = getValueKey(model, endpoint);
  if (!valueKey) {
    return null;
  }

  // If we got this far, and values[cacheType] is undefined somehow, return a rough average of default multipliers
  return cacheTokenValues[valueKey]?.[cacheType] ?? null;
};

module.exports = { tokenValues, getValueKey, getMultiplier, getCacheMultiplier, defaultRate };