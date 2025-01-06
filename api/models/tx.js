const { matchModelName } = require('../utils');
const defaultRates = {
  prompt: 1.5, // Default rate for prompt tokens
  completion: 2.5, // Default rate for completion tokens
};

/**
 * AWS Bedrock pricing
 * source: https://aws.amazon.com/bedrock/pricing/
 * */
const bedrockValues = {
  // Basic llama2 patterns
  'llama2-13b': { prompt: 0.64, completion: 0.85 },
  'llama2:13b': { prompt: 0.64, completion: 0.85 },
  'llama2-70b': { prompt: 1.66, completion: 2.18 },
  'llama2:70b': { prompt: 1.66, completion: 2.18 },

  // Basic llama3 patterns
  'llama3-8b': { prompt: 0.26, completion: 0.51 },
  'llama3:8b': { prompt: 0.26, completion: 0.51 },
  'llama3-70b': { prompt: 2.25, completion: 2.98 },
  'llama3:70b': { prompt: 2.25, completion: 2.98 },

  // llama3-x-Nb pattern
  'llama3-1-8b': { prompt: 0.26, completion: 0.51 },
  'llama3-1-70b': { prompt: 2.25, completion: 2.98 },
  'llama3-1-405b': { prompt: 4.52, completion: 13.6 },
  'llama3-2-1b': { prompt: 0.1, completion: 0.1 },
  'llama3-2-3b': { prompt: 0.15, completion: 0.15 },
  'llama3-2-11b': { prompt: 0.16, completion: 0.16 },
  'llama3-2-90b': { prompt: 0.72, completion: 0.72 },

  // llama3.x:Nb pattern
  'llama3.1:8b': { prompt: 0.26, completion: 0.51 },
  'llama3.1:70b': { prompt: 2.25, completion: 2.98 },
  'llama3.1:405b': { prompt: 4.52, completion: 13.6 },
  'llama3.2:1b': { prompt: 0.1, completion: 0.1 },
  'llama3.2:3b': { prompt: 0.15, completion: 0.15 },
  'llama3.2:11b': { prompt: 0.16, completion: 0.16 },
  'llama3.2:90b': { prompt: 0.72, completion: 0.72 },

  // llama-3.x-Nb pattern
  'llama-3.1-8b': { prompt: 0.26, completion: 0.51 },
  'llama-3.1-70b': { prompt: 2.25, completion: 2.98 },
  'llama-3.1-405b': { prompt: 4.52, completion: 13.6 },
  'llama-3.2-1b': { prompt: 0.1, completion: 0.1 },
  'llama-3.2-3b': { prompt: 0.15, completion: 0.15 },
  'llama-3.2-11b': { prompt: 0.16, completion: 0.16 },
  'llama-3.2-90b': { prompt: 0.72, completion: 0.72 },
  'llama-3.3-70b': { prompt: 2.25, completion: 2.98 },
  'mistral-7b': { prompt: 0.13, completion: 0.17 },
  'mistral-small': { prompt: 0.13, completion: 0.17 },
  'mixtral-8x7b': { prompt: 0.38, completion: 0.6 },
  'mistral-large-2402': { prompt: 3.4, completion: 10.2 },
  'mistral-large-2407': { prompt: 2.55, completion: 7.65 },
  'command-text': { prompt: 1.28, completion: 1.7 },
  'command-light': { prompt: 0.26, completion: 0.51 },
  'ai21.j2-mid-v1': { prompt: 10.63, completion: 10.63 },
  'ai21.j2-ultra-v1': { prompt: 15.98, completion: 15.98 },
  'ai21.jamba-instruct-v1:0': { prompt: 0.43, completion: 0.6 },
  'amazon.titan-text-lite-v1': { prompt: 0.13, completion: 0.17 },
  'amazon.titan-text-express-v1': { prompt: 0.17, completion: 0.51 },
  'amazon.titan-text-premier-v1:0': { prompt: 0.43, completion: 1.28 },
  'amazon.nova-micro-v1:0': { prompt: 0.03, completion: 0.12 },
  'amazon.nova-lite-v1:0': { prompt: 0.05, completion: 0.2 },
  'amazon.nova-pro-v1:0': { prompt: 0.68, completion: 2.72 },
};

/**
 * Mapping of model token sizes to their respective multipliers for prompt and completion.
 * The rates are 1 USD per 1M tokens.
 * @type {Object.<string, {prompt: number, completion: number}>}
 */
const tokenValues = Object.assign(
  {
    '8k': { prompt: 28.56, completion: 57.04 },
    '32k': { prompt: 57.04, completion: 114.07 },
    '4k': { prompt: 1.87, completion: 2.3 },
    '16k': { prompt: 3.23, completion: 4.17 },
    'gpt-3.5-turbo-1106': { prompt: 0.51, completion: 0.68 },
    'gpt-4o': { prompt: 1.87, completion: 4.17 },
    'gpt-4o-mini': { prompt: 0.21, completion: 0.51 },
    o1: { prompt: 6.38, completion: 13.6 },
    'o1-preview': { prompt: 6.38, completion: 13.6 },
    'o1-mini': { prompt: 1.28, completion: 3.4 },
    'chatgpt-4o-latest': { prompt: 1.87, completion: 4.17 },
    'gpt-4-1106': { prompt: 3.23, completion: 7.91 },
    'gpt-3.5-turbo-0125': { prompt: 0.51, completion: 0.68 },
    'claude-3-5-sonnet-20240620': { prompt: 1.87, completion: 4.17 },
    'claude-3-opus': { prompt: 7.91, completion: 19.13 },
    'claude-3-sonnet': { prompt: 1.02, completion: 3.91 },
    'claude-3-haiku': { prompt: 0.51, completion: 0.68 },
    'claude-2.1': { prompt: 7.91, completion: 22.87 },
    'claude-2': { prompt: 7.91, completion: 22.87 },
    'claude-': { prompt: 5.1, completion: 9.78 },
    'command-r-plus': { prompt: 3.23, completion: 14.45 },
    'command-r': { prompt: 0.94, completion: 1.87 },
    command: { prompt: 0.77, completion: 0.77 },
    'gemini-1.5-flash-latest': { prompt: 0.3, completion: 0.89 },
    'gemini-1.0-pro': { prompt: 0.43, completion: 1.28 },
    'gemini-1.0-pro-001': { prompt: 0.43, completion: 1.28 },
    'gemini-1.0-pro-latest': { prompt: 0.43, completion: 1.28 },
    'gemini-1.0-pro-vision-latest': { prompt: 0.43, completion: 1.28 },
    'gemini-1.5-pro-latest': { prompt: 1.87, completion: 4.17 },
    'gemini-pro': { prompt: 0.43, completion: 1.28 },
    'gemini-pro-vision': { prompt: 0.43, completion: 1.28 },
    'gemini-1.5-pro-exp-0801': { prompt: 1.87, completion: 4.17 },
    'llama-3.1-sonar-small-128k-chat': { prompt: 0.6, completion: 0.6 },
    'llama-3.1-sonar-small-128k-online': { prompt: 0.6, completion: 0.6 },
    'llama-3.1-sonar-large-128k-chat': { prompt: 1.36, completion: 1.36 },
    'llama-3.1-sonar-large-128k-online': { prompt: 1.36, completion: 1.36 },
    'llama-3.1-70b-instruct': { prompt: 1.36, completion: 1.36 },
    'llama-3.1-8b-instruct': { prompt: 0.6, completion: 0.6 },
    'llama3-70b-8192': { prompt: 1.02, completion: 1.19 },
    'llama3-8b-8192': { prompt: 0.51, completion: 0.51 },
    'llama2-70b-4096': { prompt: 1.11, completion: 1.19 },
    'mixtral-8x7b-32768': { prompt: 0.68, completion: 0.68 },
    'gemma-7b-it': { prompt: 0.51, completion: 0.51 },
    'open-mistral-7b': { prompt: 0.51, completion: 0.51 },
    'open-mixtral-8x7b': { prompt: 0.68, completion: 0.68 },
    'mistral-tiny': { prompt: 0.51, completion: 0.51 },
    'open-mixtral-8x22b': { prompt: 1.11, completion: 2.3 },
    'open-mixtral-8x22b-2404': { prompt: 1.11, completion: 2.3 },
    'mistral-small-2312': { prompt: 0.6, completion: 1.02 },
    'mistral-small': { prompt: 0.6, completion: 1.02 },
    'mistral-small-2402': { prompt: 0.6, completion: 1.02 },
    'mistral-small-latest': { prompt: 0.6, completion: 1.02 },
    'mistral-medium-latest': { prompt: 0.94, completion: 1.87 },
    'mistral-medium-2312': { prompt: 0.94, completion: 1.87 },
    'mistral-medium': { prompt: 0.94, completion: 1.87 },
    'mistral-large-latest': { prompt: 1.19, completion: 2.81 },
    'mistral-large-2402': { prompt: 1.19, completion: 2.81 },
    'mistral-large-2407': { prompt: 1.19, completion: 2.81 },
    'codestral-2405': { prompt: 0.68, completion: 1.11 },
    'codestral-latest': { prompt: 0.68, completion: 1.11 },
    'mistral-embed': { prompt: 0.51, completion: 0.51 },
    'claude-3.5-sonnet': { prompt: 1.87, completion: 4.17 },
    'gpt-4o-2024-08-06': { prompt: 2.13, completion: 8.5 },
    o1: { prompt: 12.75, completion: 51.0 },
    'gpt-4o-mini': { prompt: 0.13, completion: 0.51 },
    'gpt-4o': { prompt: 2.13, completion: 8.5 },
    'gpt-4o-2024-05-13': { prompt: 4.25, completion: 12.75 },
    'gpt-4-1106': { prompt: 8.5, completion: 25.5 },
    'gpt-3.5-turbo-0125': { prompt: 0.43, completion: 1.28 },
    'claude-3-5-sonnet-latest': { prompt: 1.87, completion: 4.17 },
    'claude-3-5-haiku-20241022': { prompt: 1.19, completion: 2.04 },
    'claude-3-opus': { prompt: 12.75, completion: 63.75 },
    'claude-3-sonnet': { prompt: 2.55, completion: 12.75 },
    'claude-3-5-sonnet': { prompt: 2.55, completion: 12.75 },
    'claude-3.5-sonnet': { prompt: 2.55, completion: 12.75 },
    'claude-3-5-haiku': { prompt: 0.68, completion: 3.4 },
    'claude-3.5-haiku': { prompt: 0.68, completion: 3.4 },
    'claude-3-haiku': { prompt: 0.21, completion: 1.06 },
    'claude-2.1': { prompt: 6.8, completion: 20.4 },
    'claude-2': { prompt: 6.8, completion: 20.4 },
    'claude-instant': { prompt: 0.68, completion: 2.04 },
    'claude-': { prompt: 0.68, completion: 2.04 },
    'command-r-plus': { prompt: 2.55, completion: 12.75 },
    'command-r': { prompt: 0.43, completion: 1.28 },
    command: { prompt: 0.32, completion: 0.32 },
    'gemini-1.5': { prompt: 5.95, completion: 17.85 },
    gemini: { prompt: 0.43, completion: 1.28 },
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
  'claude-3.5-haiku': { write: 1, read: 0.08 },
  'claude-3-5-haiku': { write: 1, read: 0.08 },
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
  } else if (modelName.includes('gpt-4o-2024-05-13')) {
    return 'gpt-4o-2024-05-13';
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
 * @param {'prompt' | 'completion'} [params.tokenType] - The type of token (e.g., 'prompt' or 'completion').
 * @param {string} [params.model] - The model name to derive the value key from if not provided.
 * @param {string} [params.endpoint] - The endpoint name to derive the value key from if not provided.
 * @param {EndpointTokenConfig} [params.endpointTokenConfig] - The token configuration for the endpoint.
 * @returns {number} The multiplier for the given parameters, or the appropriate default value if not found.
 */
const getMultiplier = ({ valueKey, tokenType, model, endpoint, endpointTokenConfig }) => {
  if (endpointTokenConfig) {
    return endpointTokenConfig?.[model]?.[tokenType] ?? defaultRates[tokenType];
  }

  if (valueKey && tokenType) {
    return tokenValues[valueKey][tokenType] ?? defaultRates[tokenType];
  }

  if (!tokenType || !model) {
    return 1;
  }

  valueKey = getValueKey(model, endpoint);
  if (!valueKey) {
    return defaultRates[tokenType];
  }

  // If we got this far, return the appropriate default rate for the token type
  return tokenValues[valueKey]?.[tokenType] ?? defaultRates[tokenType];
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

module.exports = {
  tokenValues,
  getValueKey,
  getMultiplier,
  getCacheMultiplier,
  defaultRates,
  cacheTokenValues,
};
