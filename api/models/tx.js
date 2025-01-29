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
    // OpenAI models
    o1: { prompt: 12.75, completion: 51.0 },
    'chatgpt-4o-latest': { prompt: 1.97, completion: 7.23 },
    'gpt-4o': { prompt: 1.97, completion: 7.23 },
    'gpt-4o-mini': { prompt: 0.13, completion: 0.51 },
    'gpt-4-0125-preview': { prompt: 1.97, completion: 7.23 },
    'gpt-3.5-turbo-0125': { prompt: 2.56, completion: 5.1 },
    'gpt-4-turbo-preview': { prompt: 1.97, completion: 7.23 },
    'gpt-4-1106-preview': { prompt: 1.97, completion: 7.23 },
    'gpt-3.5-turbo-1106': { prompt: 2.56, completion: 5.1 },
    'gpt-4-vision-preview': { prompt: 1.97, completion: 7.23 },
    'gpt-3.5-turbo-instruct-0914': { prompt: 2.56, completion: 5.1 },
    'gpt-3.5-turbo-instruct': { prompt: 2.56, completion: 5.1 },
    'gpt-4-0613': { prompt: 1.97, completion: 7.23 },
    'gpt-3.5-turbo-16k-0613': { prompt: 2.56, completion: 5.1 },
    'gpt-3.5-turbo-0613': { prompt: 2.56, completion: 5.1 },
    'gpt-4': { prompt: 1.97, completion: 7.23 },
    'gpt-3.5-turbo': { prompt: 2.56, completion: 5.1 },
    'gpt-3.5-turbo-0301': { prompt: 2.56, completion: 5.1 },
    'gpt-3.5-turbo-16k': { prompt: 2.56, completion: 5.1 },
    'o1-mini': { prompt: 2.36, completion: 9.2 },

    // Google models
    gemini: { prompt: 0.43, completion: 1.28 },
    'gemini-2.0-flash-exp': { prompt: 0.06, completion: 0.25 },
    'gemini-2.0-flash-thinking-exp-1219': { prompt: 0.06, completion: 0.25 },
    'gemini-exp-1121': { prompt: 0.43, completion: 1.5 },
    'gemini-exp-1114': { prompt: 0.43, completion: 1.5 },
    'gemini-1.5-flash-latest': { prompt: 0.06, completion: 0.3 },
    'gemini-1.0-pro': { prompt: 0.43, completion: 1.5 },
    'gemini-1.0-pro-001': { prompt: 0.43, completion: 1.5 },
    // 'gemini-1.0-pro-latest': { prompt: 0.43, completion: 1.5 },
    // 'gemini-1.0-pro-vision-latest': { prompt: 0.43, completion: 1.5 },
    'gemini-1.5-pro-latest': { prompt: 1.06, completion: 5.0 },
    'gemini-pro': { prompt: 0.43, completion: 1.5 },
    // 'gemini-pro-vision': { prompt: 0.43, completion: 1.5 },

    // Anthropic models
    'claude-3-5-sonnet-latest': { prompt: 2.26, completion: 9.15 },
    'claude-3-5-sonnet-20240620': { prompt: 2.36, completion: 9.15 },
    'claude-3-5-haiku-20241022': { prompt: 0.68, completion: 2.4 },
    'claude-3-opus-20240229': { prompt: 9.78, completion: 48.75 },
    'claude-3-sonnet-20240229': { prompt: 2.56, completion: 12.75 },
    'claude-3-haiku-20240307': { prompt: 0.21, completion: 1.06 },

    // Groq models
    'llama3-70b-8192': { prompt: 0.5, completion: 0.67 },
    // 'whisper-large-v3': { prompt: 0.85, completion: 1.7 },
    'mixtral-8x7b-32768': { prompt: 0.2, completion: 0.2 },
    'llama-3.3-70b-versatile': { prompt: 0.5, completion: 0.67 },
    // 'whisper-large-v3-turbo': { prompt: 0.85, completion: 1.7 },
    'llama-3.2-1b-preview': { prompt: 0.03, completion: 0.03 },
    'llama-3.2-11b-vision-preview': { prompt: 0.21, completion: 0.21 },
    'llama-3.1-70b-versatile': { prompt: 0.5, completion: 0.67 },
    'llama-3.2-3b-preview': { prompt: 0.05, completion: 0.05 },
    'llama-3.3-70b-specdec': { prompt: 0.5, completion: 0.84 },
    'llama3-8b-8192': { prompt: 0.04, completion: 0.07 },
    // 'distil-whisper-large-v3-en': { prompt: 0.85, completion: 1.7 },
    'llama-3.1-8b-instant': { prompt: 0.04, completion: 0.07 },
    'llama-3.2-90b-vision-preview': { prompt: 0.76, completion: 0.76 },
    'llama-guard-3-8b': { prompt: 0.17, completion: 0.17 },
    'gemma2-9b-it': { prompt: 0.17, completion: 0.17 },

    // DeepSeek models
    'deepseek-chat': { prompt: 0.15, completion: 1.12 },
    'deepseek-coder': { prompt: 0.27, completion: 4.4 },

    // APIPie Models
    'mistral-7b-instruct': { prompt: 0.18, completion: 0.18 },
    'toppy-m-7b': { prompt: 0.18, completion: 0.18 },
    'nous-hermes-llama2-13b': { prompt: 0.43, completion: 0.43 },
    'nous-hermes-2-mixtral-8x7b-dpo': { prompt: 1.35, completion: 1.35 },
    // 'nous-hermes-2-vision-7b': { prompt: 1.25, completion: 1.25 },
    'llama-2-13b-chat': { prompt: 0.5, completion: 0.5 },
    'mythalion-13b': { prompt: 2.0, completion: 3.0 },
    'mythomax-l2-13b': { prompt: 2.83, completion: 2.8 },
    'xwin-lm-70b': { prompt: 9.38, completion: 9.38 },
    'goliath-120b': { prompt: 23.45, completion: 23.43 },
    'noromaid-20b': { prompt: 3.75, completion: 5.63 },
    'midnight-rose-70b': { prompt: 8.0, completion: 8.0 },
    'remm-slerp-l2-13b': { prompt: 2.83, completion: 2.8 },
    weaver: { prompt: 3.75, completion: 5.63 },
    'openhermes-2.5-mistral-7b': { prompt: 0.25, completion: 1.25 },
    'gpt-3.5-turbo': { prompt: 1.25, completion: 3.75 },
    'gpt-3.5-turbo-0125': { prompt: 1.25, completion: 3.75 },
    'gpt-3.5-turbo-1106': { prompt: 2.5, completion: 5.0 },
    'gpt-3.5-turbo-16k': { prompt: 7.5, completion: 10.0 },
    'gpt-4-turbo-preview': { prompt: 7.13, completion: 21.38 },
    'gpt-4-1106-preview': { prompt: 7.13, completion: 21.38 },
    'gpt-4': { prompt: 21.38, completion: 42.75 },
    'gpt-4-0314': { prompt: 21.38, completion: 42.75 },
    'gpt-4-32k-0314': { prompt: 42.75, completion: 85.5 },
    // 'gpt-4-vision-preview': { prompt: 7.5, completion: 30.0 },
    'gemini-pro': { prompt: 1.25, completion: 3.75 },
    'gemini-pro-vision': { prompt: 5.0, completion: 15.0 },
    'claude-3-opus': { prompt: 12.8, completion: 48.24 },
    'claude-3-sonnet': { prompt: 8.43, completion: 4.35 },
    'claude-3-haiku': { prompt: 0.5, completion: 1.0 },
    'openchat-7b': { prompt: 0.15, completion: 0.13 },
    'mixtral-8x7b-instruct': { prompt: 1.35, completion: 1.35 },
    'dolphin-mixtral-8x7b': { prompt: 1.25, completion: 1.25 },
    // 'rwkv-5-3b-ai-town': { prompt: 0.5, completion: 0.5 },
    'dbrx-instruct': { prompt: 2.7, completion: 2.7 },
    'claude-2': { prompt: 9.71, completion: 19.78 },
    'claude-2.0': { prompt: 5.73, completion: 17.18 },
    'mistral-tiny': { prompt: 0.63, completion: 0.63 },
    'mistral-small': { prompt: 0.5, completion: 1.5 },
    'mistral-medium': { prompt: 6.9, completion: 20.25 },
    'mistral-large': { prompt: 5.0, completion: 15.0 },
    command: { prompt: 2.38, completion: 4.75 },
    'command-r': { prompt: 1.2, completion: 3.55 },
    'command-r-plus': { prompt: 7.5, completion: 37.5 },
    'titan-tg1-large': { prompt: 2.5, completion: 3.75 },
    // 'titan-image-generator-v1': { prompt: 5.0, completion: 10.0 },
    // 'titan-embed-g1-text-02': { prompt: 0.5, completion: 0.5 },
    'titan-text-lite-v1': { prompt: 0.38, completion: 0.5 },
    'titan-text-express-v1': { prompt: 0.5, completion: 1.5 },
    // 'titan-embed-text-v1': { prompt: 0.5, completion: 1.0 },
    // 'titan-embed-image-v1': { prompt: 1.0, completion: 2.0 },
    // 'stable-diffusion-xl': { prompt: 3.0, completion: 8.0 },
    // 'stable-diffusion-xl-v0': { prompt: 2.5, completion: 7.0 },
    // 'stable-diffusion-xl-v1': { prompt: 3.0, completion: 8.0 },
    // 'j2-grande-instruct': { prompt: 75.25, completion: 73.79 },
    // 'j2-mid': { prompt: 31.47, completion: 30.94 },
    // 'j2-mid-v1': { prompt: 31.47, completion: 30.94 },
    'claude-instant-1': { prompt: 3.3, completion: 5.93 },
    // 'command-text-v14': { prompt: 3.78, completion: 4.66 },
    // 'command-light-text-v14': { prompt: 0.75, completion: 1.48 },
    // 'embed-english-v3': { prompt: 2.0, completion: 5.5 },
    // 'embed-multilingual-v3': { prompt: 1.0, completion: 3.0 },
    // 'llama2-13b-chat-v1': { prompt: 1.25, completion: 2.5 },
    // 'llama2-70b-chat-v1': { prompt: 7.5, completion: 10.0 },
    'Mistral-7B-Instruct-v0.2': { prompt: 2.5, completion: 5.0 },
    // '1536__text-embedding-ada-002': { prompt: 1.0, completion: 2.5 },
    // '768__textembedding-gecko': { prompt: 0.5, completion: 1.0 },
    'large-latest': { prompt: 57.75, completion: 28.49 },
    // '1024__mistral-embed': { prompt: 1.5, completion: 3.0 },
    'command-light': { prompt: 2.5, completion: 5.0 },
    'command-light-nightly': { prompt: 1.5, completion: 3.5 },
    // '4096embed-english-v2.0': { prompt: 3.0, completion: 8.0 },
    // '1024embed-english-light-v2.0': { prompt: 1.0, completion: 2.0 },
    // '768__embed-multilingual-v2.0': { prompt: 0.75, completion: 1.5 },
    // '4096__embed-english-v2.0': { prompt: 3.0, completion: 8.0 },
    // 'dall-e-2': { prompt: 5.0, completion: 10.0 },
    // 'tts-1-hd-1106': { prompt: 1.0, completion: 2.5 },
    // 'tts-1-hd': { prompt: 1.0, completion: 2.5 },
    // 'gpt-4-0613': { prompt: 21.38, completion: 42.75 },
    // 'gpt-4-1106-vision-preview': { prompt: 8.0, completion: 30.0 },
    'gpt-4-0125-preview': { prompt: 21.38, completion: 42.75 },
    // 'dall-e-3': { prompt: 6.0, completion: 12.0 },
    // 'tts-1-1106': { prompt: 0.5, completion: 1.25 },
    // 'clip-vit-large-patch14-336': { prompt: 0.5, completion: 1.0 },
    // 'whisper-base': { prompt: 0.3, completion: 0.9 },
    // 'chronos-hermes-13b-v2': { prompt: 2.0, completion: 2.0 },
    'dolphin-2.6-mixtral-8x7b': { prompt: 0.58, completion: 1.0 },
    'airoboros-70b': { prompt: 0.88, completion: 1.0 },

    // Fireworks Models
    'accounts/fireworks/models/mixtral-8x7b-instruct-hf': { prompt: 0.2, completion: 0.2 },
    'accounts/fireworks/models/mixtral-8x7b-instruct-hf': { prompt: 1.07, completion: 4.27 },
    'accounts/yi-01-ai/models/yi-large': { prompt: 12.78, completion: 51.1 },
    'accounts/fireworks/models/llama-v3-70b-instruct-hf': { prompt: 3.83, completion: 15.32 },
    'accounts/fireworks/models/llama-v3p1-8b-instruct': { prompt: 0.43, completion: 1.72 },
    // 'accounts/fireworks/models/flux-1-schnell-fp8': { prompt: 1.97, completion: 8.5 },
    // 'accounts/fireworks/models/flux-1-dev-fp8': { prompt: 1.97, completion: 8.5 },
    'accounts/fireworks/models/qwen2p5-72b-instruct': { prompt: 3.83, completion: 15.32 },
    'accounts/fireworks/models/mixtral-8x22b-instruct': { prompt: 5.11, completion: 20.54 },
    'accounts/fireworks/models/llama-v3-8b-instruct': { prompt: 0.43, completion: 1.72 },
    'accounts/fireworks/models/llama-v3-70b-instruct': { prompt: 3.83, completion: 15.32 },
    'accounts/fireworks/models/starcoder-7b': { prompt: 0.43, completion: 1.72 },
    'accounts/fireworks/models/gemma2-9b-it': { prompt: 0.43, completion: 1.72 },
    'accounts/fireworks/models/qwen-qwq-32b-preview': { prompt: 3.83, completion: 15.32 },
    'accounts/fireworks/models/qwen2p5-coder-32b-instruct': { prompt: 3.83, completion: 15.32 },
    'accounts/fireworks/models/llama-v3p1-405b-instruct': { prompt: 12.78, completion: 51.1 },
    'accounts/fireworks/models/llama-v3-8b-instruct-hf': { prompt: 0.43, completion: 1.72 },
    'accounts/fireworks/models/firefunction-v2-rc': { prompt: 1.97, completion: 8.5 },
    'accounts/fireworks/models/deepseek-v3': { prompt: 3.83, completion: 15.32 },
    'accounts/fireworks/models/llama-v3p2-11b-vision-instruct': { prompt: 0.43, completion: 1.72 },
    'accounts/fireworks/models/qwen2-vl-72b-instruct': { prompt: 3.83, completion: 15.32 },
    'accounts/fireworks/models/firefunction-v2': { prompt: 1.97, completion: 8.5 },
    'accounts/fireworks/models/llama-guard-3-8b': { prompt: 0.43, completion: 1.72 },
    'accounts/fireworks/models/llama-v3p1-405b-instruct-long': { prompt: 12.78, completion: 51.1 },
    'accounts/fireworks/models/llama-v3p2-3b-instruct': { prompt: 0.21, completion: 0.85 },
    'accounts/fireworks/models/llama-v3p1-70b-instruct': { prompt: 3.83, completion: 15.32 },
    'accounts/fireworks/models/llama-v3p2-90b-vision-instruct': { prompt: 3.83, completion: 15.32 },
    'accounts/fireworks/models/llama-v3p3-70b-instruct': { prompt: 3.83, completion: 15.32 },
    'accounts/fireworks/models/phi-3-vision-128k-instruct': { prompt: 0.43, completion: 1.72 },
    'accounts/marco-0dece6/models/state-transition-llama3p1': { prompt: 1.97, completion: 8.5 },
    'accounts/fireworks/models/mixtral-8x7b-instruct': { prompt: 1.07, completion: 4.27 },
    'accounts/fireworks/models/mythomax-l2-13b': { prompt: 0.43, completion: 1.72 },
    'accounts/fixie/models/1b68538a063a49e2ae4513d4ef186e9a': { prompt: 1.97, completion: 8.5 },
    'accounts/fireworks/models/firefunction-v1': { prompt: 1.97, completion: 8.5 },
    'accounts/carlos-0f74b3/models/service-emergency-classifier-llama3-8b-instruct': {
      prompt: 0.43,
      completion: 1.72,
    },

    // Mistral models
    'ministral-3b-2410': { prompt: 0.03, completion: 0.03 },
    'ministral-3b-latest': { prompt: 0.03, completion: 0.03 },
    'ministral-8b-2410': { prompt: 0.08, completion: 0.08 },
    'ministral-8b-latest': { prompt: 0.08, completion: 0.08 },
    'open-mistral-7b': { prompt: 0.21, completion: 0.21 },
    'mistral-tiny': { prompt: 0.08, completion: 0.08 },
    'mistral-tiny-2312': { prompt: 0.08, completion: 0.08 },
    'open-mistral-nemo': { prompt: 0.13, completion: 0.13 },
    'open-mistral-nemo-2407': { prompt: 0.13, completion: 0.13 },
    'mistral-tiny-2407': { prompt: 0.08, completion: 0.08 },
    'mistral-tiny-latest': { prompt: 0.08, completion: 0.08 },
    'open-mixtral-8x7b': { prompt: 0.59, completion: 0.59 },
    'mistral-small': { prompt: 0.17, completion: 0.51 },
    'mistral-small-2312': { prompt: 0.17, completion: 0.51 },
    'open-mixtral-8x22b': { prompt: 1.7, completion: 5.1 },
    'open-mixtral-8x22b-2404': { prompt: 1.7, completion: 5.1 },
    'mistral-small-2402': { prompt: 0.17, completion: 0.51 },
    'mistral-small-2409': { prompt: 0.17, completion: 0.51 },
    'mistral-small-latest': { prompt: 0.17, completion: 0.51 },
    'mistral-medium-2312': { prompt: 0.85, completion: 2.55 },
    'mistral-medium': { prompt: 0.85, completion: 2.55 },
    'mistral-medium-latest': { prompt: 0.85, completion: 2.55 },
    'mistral-large-2402': { prompt: 1.7, completion: 5.1 },
    'mistral-large-2407': { prompt: 1.7, completion: 5.1 },
    'mistral-large-2411': { prompt: 1.7, completion: 5.1 },
    'mistral-large-latest': { prompt: 1.7, completion: 5.1 },
    'pixtral-large-2411': { prompt: 1.7, completion: 5.1 },
    'pixtral-large-latest': { prompt: 1.7, completion: 5.1 },
    'codestral-2405': { prompt: 0.17, completion: 0.51 },
    'codestral-latest': { prompt: 0.17, completion: 0.51 },
    'codestral-mamba-2407': { prompt: 0.17, completion: 0.51 },
    'open-codestral-mamba': { prompt: 0.17, completion: 0.51 },
    'codestral-mamba-latest': { prompt: 0.17, completion: 0.51 },
    'pixtral-12b-2409': { prompt: 0.13, completion: 0.13 },
    'pixtral-12b': { prompt: 0.13, completion: 0.13 },
    'pixtral-12b-latest': { prompt: 0.13, completion: 0.13 },
    // 'mistral-embed': { prompt: 0.08, completion: 0.08 },
    // 'mistral-moderation-2411': { prompt: 0.08, completion: 0.08 },
    // 'mistral-moderation-latest': { prompt: 0.08, completion: 0.08 },

    // Perplexity models
    'llama-3.1-sonar-small-128k-online': { prompt: 0.17, completion: 0.17 },
    'llama-3.1-sonar-large-128k-online': { prompt: 0.85, completion: 0.85 },
    'llama-3.1-sonar-huge-128k-online': { prompt: 4.26, completion: 4.26 },
    'sonar-pro': { prompt: 2.56, completion: 11.75 },
    sonar: { prompt: 0.75, completion: 1.15 },

    // OpenRouter models
    'deepseek/deepseek-chat': { prompt: 0.12, completion: 0.24 },
    'qwen/qvq-72b-preview': { prompt: 0.25, completion: 0.5 },
    'google/gemini-2.0-flash-thinking-exp:free': { prompt: 0, completion: 0 },
    'sao10k/l3.3-euryale-70b': { prompt: 1.5, completion: 1.5 },
    'inflatebot/mn-mag-mell-r1': { prompt: 0.9, completion: 0.9 },
    'openai/o1': { prompt: 12.75, completion: 51.0 },
    'eva-unit-01/eva-llama-3.33-70b': { prompt: 4.0, completion: 6.0 },
    'x-ai/grok-2-vision-1212': { prompt: 2.0, completion: 10.0 },
    'x-ai/grok-2-1212': { prompt: 2.0, completion: 10.0 },
    'cohere/command-r7b-12-2024': { prompt: 1.2, completion: 3.55 },
    'google/gemini-2.0-flash-exp:free': { prompt: 0, completion: 0 },
    'google/gemini-exp-1206:free': { prompt: 0, completion: 0 },
    'meta-llama/llama-3.3-70b-instruct': { prompt: 4.0, completion: 6.0 },
    'amazon/nova-lite-v1': { prompt: 1.0, completion: 3.0 },
    'amazon/nova-micro-v1': { prompt: 0.5, completion: 1.5 },
    'amazon/nova-pro-v1': { prompt: 2.0, completion: 6.0 },
    'qwen/qwq-32b-preview': { prompt: 0.25, completion: 0.5 },
    'google/gemini-exp-1121:free': { prompt: 0, completion: 0 },
    'google/learnlm-1.5-pro-experimental:free': { prompt: 0, completion: 0 },
    'eva-unit-01/eva-qwen-2.5-72b': { prompt: 4.0, completion: 6.0 },
    'openai/gpt-4o-2024-11-20': { prompt: 1.97, completion: 7.23 },
    'mistralai/mistral-large-2411': { prompt: 5.0, completion: 15.0 },
    'mistralai/mistral-large-2407': { prompt: 5.0, completion: 15.0 },
    'mistralai/pixtral-large-2411': { prompt: 5.0, completion: 15.0 },
    'x-ai/grok-vision-beta': { prompt: 2.0, completion: 10.0 },
    'google/gemini-exp-1114:free': { prompt: 0, completion: 0 },
    'infermatic/mn-inferor-12b': { prompt: 0.9, completion: 0.9 },
    'qwen/qwen-2.5-coder-32b-instruct': { prompt: 0.25, completion: 0.5 },
    'raifle/sorcererlm-8x22b': { prompt: 1.35, completion: 1.35 },
    'eva-unit-01/eva-qwen-2.5-32b': { prompt: 2.0, completion: 3.0 },
    'thedrummer/unslopnemo-12b': { prompt: 0.9, completion: 0.9 },
    'anthropic/claude-3.5-haiku:beta': { prompt: 0.5, completion: 1.0 },
    'anthropic/claude-3.5-haiku': { prompt: 0.5, completion: 1.0 },
    'anthropic/claude-3.5-haiku-20241022:beta': { prompt: 0.5, completion: 1.0 },
    'anthropic/claude-3.5-haiku-20241022': { prompt: 0.5, completion: 1.0 },
    'anthracite-org/magnum-v4-72b': { prompt: 4.0, completion: 6.0 },
    'anthropic/claude-3.5-sonnet:beta': { prompt: 8.43, completion: 4.35 },
    'anthropic/claude-3.5-sonnet': { prompt: 8.43, completion: 4.35 },
    'neversleep/llama-3.1-lumimaid-70b': { prompt: 4.0, completion: 6.0 },
    'x-ai/grok-beta': { prompt: 2.0, completion: 10.0 },
    'mistralai/ministral-8b': { prompt: 0.18, completion: 0.18 },
    'mistralai/ministral-3b': { prompt: 0.1, completion: 0.1 },
    'qwen/qwen-2.5-7b-instruct': { prompt: 0.25, completion: 0.5 },
    'nvidia/llama-3.1-nemotron-70b-instruct': { prompt: 4.0, completion: 6.0 },
    'inflection/inflection-3-productivity': { prompt: 2.0, completion: 8.0 },
    'inflection/inflection-3-pi': { prompt: 2.0, completion: 8.0 },
    'google/gemini-flash-1.5-8b': { prompt: 0.06, completion: 0.3 },
    'liquid/lfm-40b': { prompt: 2.0, completion: 3.0 },
    'anthracite-org/magnum-v2-72b': { prompt: 4.0, completion: 6.0 },
    'openai/chatgpt-4o-latest': { prompt: 1.97, completion: 7.23 },
    'perplexity/llama-3.1-sonar-huge-128k-online': { prompt: 4.26, completion: 4.26 },
    'aetherwiing/mn-starcannon-12b': { prompt: 1.97, completion: 8.5 },
    'sao10k/l3-lunaris-8b': { prompt: 1.5, completion: 1.5 },
    'openai/gpt-4o-2024-08-06': { prompt: 1.97, completion: 7.23 },
    'meta-llama/llama-3.1-405b': { prompt: 1.97, completion: 7.23 },
    'nothingiisreal/mn-celeste-12b': { prompt: 1.97, completion: 8.5 },
    'perplexity/llama-3.1-sonar-small-128k-chat': { prompt: 0.17, completion: 0.17 },
    'perplexity/llama-3.1-sonar-large-128k-online': { prompt: 0.85, completion: 0.85 },
    'perplexity/llama-3.1-sonar-small-128k-online': { prompt: 0.17, completion: 0.17 },
    'google/gemini-pro-1.5-exp': { prompt: 1.06, completion: 5.0 },
    'perplexity/llama-3.1-sonar-large-128k-chat': { prompt: 0.85, completion: 0.85 },
    'meta-llama/llama-3.1-8b-instruct:free': { prompt: 0, completion: 0 },
    'meta-llama/llama-3.1-8b-instruct': { prompt: 1.97, completion: 8.5 },
    'meta-llama/llama-3.1-70b-instruct:free': { prompt: 0, completion: 0 },
    'meta-llama/llama-3.1-70b-instruct': { prompt: 1.97, completion: 8.5 },
    'meta-llama/llama-3.1-70b-instruct:nitro': { prompt: 1.97, completion: 8.5 },
    'meta-llama/llama-3.1-405b-instruct:free': { prompt: 0, completion: 0 },
    'meta-llama/llama-3.1-405b-instruct': { prompt: 1.97, completion: 8.5 },
    'meta-llama/llama-3.1-405b-instruct:nitro': { prompt: 1.97, completion: 8.5 },
    'mistralai/mistral-nemo': { prompt: 1.97, completion: 8.5 },
    'mistralai/codestral-mamba': { prompt: 1.97, completion: 8.5 },
    'openai/gpt-4o-mini-2024-07-18': { prompt: 0.13, completion: 0.51 },
    'openai/gpt-4o-mini': { prompt: 0.13, completion: 0.51 },
    'qwen/qwen-2-7b-instruct:free': { prompt: 0, completion: 0 },
    'qwen/qwen-2-7b-instruct': { prompt: 0.25, completion: 0.5 },
    'google/gemma-2-27b-it': { prompt: 1.97, completion: 8.5 },
    'alpindale/magnum-72b': { prompt: 1.97, completion: 8.5 },
    'google/gemma-2-9b-it:free': { prompt: 0, completion: 0 },
    'google/gemma-2-9b-it': { prompt: 1.97, completion: 8.5 },
    'ai21/jamba-instruct': { prompt: 1.97, completion: 8.5 },
    '01-ai/yi-large': { prompt: 1.97, completion: 8.5 },
    'anthropic/claude-3.5-sonnet-20240620:beta': { prompt: 8.43, completion: 4.35 },
    'anthropic/claude-3.5-sonnet-20240620': { prompt: 8.43, completion: 4.35 },
    'sao10k/l3-euryale-70b': { prompt: 1.5, completion: 1.5 },
    'cognitivecomputations/dolphin-mixtral-8x22b': { prompt: 1.25, completion: 1.25 },
    'qwen/qwen-2-72b-instruct': { prompt: 0.25, completion: 0.5 },
    'mistralai/mistral-7b-instruct:free': { prompt: 0, completion: 0 },
    'mistralai/mistral-7b-instruct': { prompt: 0.18, completion: 0.18 },
    'mistralai/mistral-7b-instruct:nitro': { prompt: 0.18, completion: 0.18 },
    'mistralai/mistral-7b-instruct-v0.3': { prompt: 0.18, completion: 0.18 },
    'nousresearch/hermes-2-pro-llama-3-8b': { prompt: 0.43, completion: 0.43 },
    'microsoft/phi-3-mini-128k-instruct:free': { prompt: 0, completion: 0 },
    'microsoft/phi-3-mini-128k-instruct': { prompt: 1.97, completion: 8.5 },
    'microsoft/phi-3-medium-128k-instruct:free': { prompt: 0, completion: 0 },
    'microsoft/phi-3-medium-128k-instruct': { prompt: 1.97, completion: 8.5 },
    'neversleep/llama-3-lumimaid-70b': { prompt: 1.97, completion: 8.5 },
    'perplexity/llama-3-sonar-small-32k-chat': { prompt: 0.17, completion: 0.17 },
    'google/gemini-flash-1.5': { prompt: 0.06, completion: 0.3 },
    'perplexity/llama-3-sonar-large-32k-chat': { prompt: 0.85, completion: 0.85 },
    'perplexity/llama-3-sonar-large-32k-online': { prompt: 0.85, completion: 0.85 },
    'deepseek/deepseek-chat-v2.5': { prompt: 0.14, completion: 0.28 },
    'openai/gpt-4o': { prompt: 1.97, completion: 8.5 },
    'openai/gpt-4o:extended': { prompt: 1.97, completion: 8.5 },
    'meta-llama/llama-guard-2-8b': { prompt: 1.97, completion: 8.5 },
    'openai/gpt-4o-2024-05-13': { prompt: 1.97, completion: 8.5 },
    'neversleep/llama-3-lumimaid-8b:extended': { prompt: 1.97, completion: 8.5 },
    'neversleep/llama-3-lumimaid-8b': { prompt: 1.97, completion: 8.5 },
    'meta-llama/llama-3-70b-instruct': { prompt: 1.97, completion: 8.5 },
    'meta-llama/llama-3-70b-instruct:nitro': { prompt: 1.97, completion: 8.5 },
    'meta-llama/llama-3-8b-instruct:free': { prompt: 0, completion: 0 },
    'meta-llama/llama-3-8b-instruct': { prompt: 1.97, completion: 8.5 },
    'meta-llama/llama-3-8b-instruct:extended': { prompt: 1.97, completion: 8.5 },
    'meta-llama/llama-3-8b-instruct:nitro': { prompt: 1.97, completion: 8.5 },
    'mistralai/mixtral-8x22b-instruct': { prompt: 1.35, completion: 1.35 },
    'microsoft/wizardlm-2-7b': { prompt: 1.97, completion: 8.5 },
    'microsoft/wizardlm-2-8x22b': { prompt: 1.97, completion: 8.5 },
    'google/gemini-pro-1.5': { prompt: 1.06, completion: 5.0 },
    'openai/gpt-4-turbo': { prompt: 7.13, completion: 21.38 },
    'cohere/command-r-plus': { prompt: 7.5, completion: 37.5 },
    'cohere/command-r-plus-04-2024': { prompt: 7.5, completion: 37.5 },
    'databricks/dbrx-instruct': { prompt: 2.7, completion: 2.7 },
    'sophosympatheia/midnight-rose-70b': { prompt: 8.0, completion: 8.0 },
    'cohere/command': { prompt: 2.38, completion: 4.75 },
    'cohere/command-r': { prompt: 1.2, completion: 3.55 },
    'anthropic/claude-3-haiku:beta': { prompt: 0.5, completion: 1.0 },
    'anthropic/claude-3-haiku': { prompt: 0.5, completion: 1.0 },
    'anthropic/claude-3-sonnet:beta': { prompt: 8.43, completion: 4.35 },
    'anthropic/claude-3-sonnet': { prompt: 8.43, completion: 4.35 },
    'anthropic/claude-3-opus:beta': { prompt: 17.8, completion: 88.24 },
    'anthropic/claude-3-opus': { prompt: 17.8, completion: 88.24 },
    'cohere/command-r-03-2024': { prompt: 1.2, completion: 3.55 },
    'mistralai/mistral-large': { prompt: 5.0, completion: 15.0 },
    'openai/gpt-4-turbo-preview': { prompt: 7.13, completion: 21.38 },
    'openai/gpt-3.5-turbo-0613': { prompt: 1.25, completion: 3.75 },
    'nousresearch/nous-hermes-2-mixtral-8x7b-dpo': { prompt: 1.35, completion: 1.35 },
    'mistralai/mistral-small': { prompt: 0.5, completion: 1.5 },
    'mistralai/mistral-medium': { prompt: 6.9, completion: 20.25 },
    'mistralai/mistral-tiny': { prompt: 0.63, completion: 0.63 },
    'cognitivecomputations/dolphin-mixtral-8x7b': { prompt: 1.25, completion: 1.25 },
    'google/gemini-pro': { prompt: 1.25, completion: 3.75 },
    'google/gemini-pro-vision': { prompt: 5.0, completion: 15.0 },
    'mistralai/mixtral-8x7b-instruct': { prompt: 1.35, completion: 1.35 },
    'mistralai/mixtral-8x7b-instruct:nitro': { prompt: 1.35, completion: 1.35 },
    'mistralai/mixtral-8x7b': { prompt: 1.35, completion: 1.35 },
    'openchat/openchat-7b:free': { prompt: 0, completion: 0 },
    'openchat/openchat-7b': { prompt: 0.15, completion: 0.13 },
    'neversleep/noromaid-20b': { prompt: 3.75, completion: 5.63 },
    'anthropic/claude-2:beta': { prompt: 9.71, completion: 19.78 },
    'anthropic/claude-2': { prompt: 9.71, completion: 19.78 },
    'anthropic/claude-2.1:beta': { prompt: 9.71, completion: 19.78 },
    'anthropic/claude-2.1': { prompt: 9.71, completion: 19.78 },
    'teknium/openhermes-2.5-mistral-7b': { prompt: 0.25, completion: 1.25 },
    'lizpreciatior/lzlv-70b-fp16-hf': { prompt: 1.97, completion: 8.5 },
    'alpindale/goliath-120b': { prompt: 23.45, completion: 23.43 },
    'undi95/toppy-m-7b:free': { prompt: 0, completion: 0 },
    'undi95/toppy-m-7b:nitro': { prompt: 0.18, completion: 0.18 },
    'undi95/toppy-m-7b': { prompt: 0.18, completion: 0.18 },
    'openrouter/auto': { prompt: 1.97, completion: 8.5 },
    'openai/gpt-4-1106-preview': { prompt: 7.13, completion: 21.38 },
    'openai/gpt-3.5-turbo-1106': { prompt: 2.5, completion: 5.0 },
    'google/palm-2-codechat-bison-32k': { prompt: 1.97, completion: 8.5 },
    'google/palm-2-chat-bison-32k': { prompt: 1.97, completion: 8.5 },
    'jondurbin/airoboros-l2-70b': { prompt: 0.88, completion: 1.0 },
    'xwin-lm/xwin-lm-70b': { prompt: 9.38, completion: 9.38 },
    'mistralai/mistral-7b-instruct-v0.1': { prompt: 0.18, completion: 0.18 },
    'openai/gpt-3.5-turbo-instruct': { prompt: 1.25, completion: 3.75 },
    'pygmalionai/mythalion-13b': { prompt: 2.0, completion: 3.0 },
    'openai/gpt-4-32k': { prompt: 42.75, completion: 85.5 },
    'openai/gpt-3.5-turbo-16k': { prompt: 7.5, completion: 10.0 },
    'openai/gpt-4-32k-0314': { prompt: 42.75, completion: 85.5 },
    'nousresearch/nous-hermes-llama2-13b': { prompt: 0.43, completion: 0.43 },
    'huggingfaceh4/zephyr-7b-beta:free': { prompt: 0, completion: 0 },
    'mancer/weaver': { prompt: 3.75, completion: 5.63 },
    'anthropic/claude-2.0:beta': { prompt: 5.73, completion: 17.18 },
    'anthropic/claude-2.0': { prompt: 5.73, completion: 17.18 },
    'undi95/remm-slerp-l2-13b': { prompt: 2.83, completion: 2.8 },
    'undi95/remm-slerp-l2-13b:extended': { prompt: 2.83, completion: 2.8 },
    'google/palm-2-codechat-bison': { prompt: 1.97, completion: 8.5 },
    'google/palm-2-chat-bison': { prompt: 1.97, completion: 8.5 },
    'gryphe/mythomax-l2-13b:free': { prompt: 0, completion: 0 },
    'gryphe/mythomax-l2-13b': { prompt: 2.83, completion: 2.8 },
    'gryphe/mythomax-l2-13b:nitro': { prompt: 2.83, completion: 2.8 },
    'gryphe/mythomax-l2-13b:extended': { prompt: 2.83, completion: 2.8 },
    'meta-llama/llama-2-13b-chat': { prompt: 0.5, completion: 0.5 },
    'openai/gpt-4-0314': { prompt: 21.38, completion: 42.75 },
    'openai/gpt-3.5-turbo': { prompt: 1.25, completion: 3.75 },
    'openai/gpt-3.5-turbo-0125': { prompt: 1.25, completion: 3.75 },
    'openai/gpt-4': { prompt: 21.38, completion: 42.75 },

    // ShuttleAI models
    'shuttleai/shuttle-3': { prompt: 0.34, completion: 0.6 },
    'shuttle-2-turbo': { prompt: 0.34, completion: 0.6 },
    'shuttle-2.5': { prompt: 0.34, completion: 0.6 },
    'shuttleai/shuttle-2.5': { prompt: 0.34, completion: 0.6 },
    'shuttle-3': { prompt: 0.34, completion: 0.6 },
    'shuttleai/shuttle-tts': { prompt: 0.85, completion: 0.85 },
    'shuttle-tts': { prompt: 0.85, completion: 0.85 },
    'shuttleai/shuttle-3-mini': { prompt: 0.09, completion: 0.4 },
    'shuttle-2.5-mini': { prompt: 0.09, completion: 0.4 },
    'shuttleai/shuttle-2.5-mini': { prompt: 0.09, completion: 0.4 },
    'shuttle-2.5-mini-2024-09-11': { prompt: 0.09, completion: 0.4 },
    'shuttleai/shuttle-2.5-mini-2024-09-11': { prompt: 0.09, completion: 0.4 },
    'shuttle-3-mini': { prompt: 0.09, completion: 0.4 },
    'shuttleai/s1': { prompt: 1.19, completion: 1.5 },
    'shuttle-s1': { prompt: 1.19, completion: 1.5 },
    'shuttle-strawberry': { prompt: 1.19, completion: 1.5 },
    s1: { prompt: 1.19, completion: 1.5 },
    'shuttleai/s1-mini': { prompt: 0.6, completion: 0.9 },
    'shuttle-s1-mini': { prompt: 0.6, completion: 0.9 },
    'shuttle-strawberry-mini': { prompt: 0.6, completion: 0.9 },
    's1-mini': { prompt: 0.6, completion: 0.9 },
    'shuttleai/shuttle-3-diffusion': { prompt: 0.05, completion: 0.05 },
    'shuttle-diffusion': { prompt: 0.05, completion: 0.05 },
    'shuttleai/shuttle-diffusion': { prompt: 0.05, completion: 0.05 },
    'shuttle-2-diffusion': { prompt: 0.05, completion: 0.05 },
    'shuttleai/shuttle-2-diffusion': { prompt: 0.05, completion: 0.05 },
    'shuttle-3-diffusion': { prompt: 0.05, completion: 0.05 },
    'shuttleai/shuttle-3.1-aesthetic': { prompt: 0.05, completion: 0.05 },
    'shuttle-3.1-aesthetic': { prompt: 0.05, completion: 0.05 },
    'shuttleai/shuttle-rbg': { prompt: 0.05, completion: 0.05 },
    rbg: { prompt: 0.05, completion: 0.05 },
    'shuttle-rbg': { prompt: 0.05, completion: 0.05 },
    'shuttleai/shuttle-stt': { prompt: 0.05, completion: 0.05 },
    'shuttle-stt': { prompt: 0.05, completion: 0.05 },
    'openai/o1-preview-2024-09-12': { prompt: 12.77, completion: 60.0 },
    'o1-preview': { prompt: 12.77, completion: 60.0 },
    o1: { prompt: 12.77, completion: 60.0 },
    strawberry: { prompt: 12.77, completion: 60.0 },
    'strawberry-preview': { prompt: 12.77, completion: 60.0 },
    'o1-preview-2024-09-12': { prompt: 12.77, completion: 60.0 },
    'openai/o1-mini-2024-09-12': { prompt: 2.55, completion: 12.0 },
    'o1-mini': { prompt: 2.55, completion: 12.0 },
    'strawberry-mini': { prompt: 2.55, completion: 12.0 },
    'o1-mini-2024-09-12': { prompt: 2.55, completion: 12.0 },
    'openai/gpt-4o-mini-2024-07-18': { prompt: 0.13, completion: 0.6 },
    'gpt-4o-mini': { prompt: 0.13, completion: 0.6 },
    'gpt-4o-mini-2024-07-18': { prompt: 0.13, completion: 0.6 },
    'openai/chatgpt-4o-latest': { prompt: 1.97, completion: 7.23 },
    'chatgpt-4o': { prompt: 1.97, completion: 8.5 },
    'chatgpt-4o-latest': { prompt: 1.97, completion: 7.23 },
    'openai/gpt-4o-2024-08-06': { prompt: 4.26, completion: 15.0 },
    'gpt-4o-16k': { prompt: 4.26, completion: 15.0 },
    'gpt-4o-2024-08-06': { prompt: 4.26, completion: 15.0 },
    'openai/gpt-4o-2024-05-13': { prompt: 1.97, completion: 8.5 },
    'gpt-4o': { prompt: 1.97, completion: 7.23 },
    'gpt-4o-2024-05-13': { prompt: 1.97, completion: 8.5 },
    'openai/gpt-4-turbo-2024-04-09': { prompt: 8.51, completion: 30.0 },
    'gpt-4-turbo': { prompt: 8.51, completion: 30.0 },
    'gpt-4-turbo-2024-04-09': { prompt: 8.51, completion: 30.0 },
    'openai/gpt-4-0125-preview': { prompt: 8.51, completion: 30.0 },
    'gpt-4-turbo-preview': { prompt: 8.51, completion: 30.0 },
    'gpt-4-0125-preview': { prompt: 8.51, completion: 30.0 },
    'openai/gpt-4-1106-preview': { prompt: 8.51, completion: 30.0 },
    'gpt-4-1106-preview': { prompt: 8.51, completion: 30.0 },
    'openai/gpt-4-0613': { prompt: 25.53, completion: 60.0 },
    'gpt-4': { prompt: 25.53, completion: 60.0 },
    'gpt-4-0613': { prompt: 25.53, completion: 60.0 },
    'openai/gpt-3.5-turbo-0125': { prompt: 0.43, completion: 1.5 },
    'gpt-3.5-turbo': { prompt: 0.43, completion: 1.5 },
    'gpt-3.5-turbo-16k': { prompt: 0.43, completion: 1.5 },
    'gpt-3.5-turbo-0125': { prompt: 0.43, completion: 1.5 },
    'openai/gpt-3.5-turbo-1106': { prompt: 0.85, completion: 2.0 },
    'gpt-3.5-turbo-1106': { prompt: 0.85, completion: 2.0 },
    'openai/dall-e-3': { prompt: 0.05, completion: 0.05 },
    'dall-e-3': { prompt: 0.05, completion: 0.05 },
    'openai/whisper-1': { prompt: 0.05, completion: 0.05 },
    'whisper-1': { prompt: 0.05, completion: 0.05 },
    'openai/tts-1': { prompt: 0.05, completion: 0.05 },
    'tts-1': { prompt: 0.05, completion: 0.05 },
    'openai/tts-1-hd': { prompt: 0.05, completion: 0.05 },
    'tts-1-hd': { prompt: 0.05, completion: 0.05 },
    'openai/text-embedding-3-large': { prompt: 0.11, completion: 0.05 },
    'text-embedding-3-large': { prompt: 0.11, completion: 0.05 },
    'openai/text-embedding-3-small': { prompt: 0.05, completion: 0.05 },
    'text-embedding-3-small': { prompt: 0.05, completion: 0.05 },
    'openai/text-moderation-007': { prompt: 0.05, completion: 0.05 },
    'text-moderation-latest': { prompt: 0.05, completion: 0.05 },
    'text-moderation-stable': { prompt: 0.05, completion: 0.05 },
    'text-moderation-007': { prompt: 0.05, completion: 0.05 },
    'anthropic/claude-3-5-sonnet-20240620': { prompt: 2.55, completion: 15.0 },
    'claude-3-5-sonnet': { prompt: 2.55, completion: 15.0 },
    'claude-3.5-sonnet': { prompt: 2.55, completion: 15.0 },
    'gpt-c35s': { prompt: 2.55, completion: 15.0 },
    'claude-3-5-sonnet-20240620': { prompt: 2.55, completion: 15.0 },
    'anthropic/claude-3-opus-20240229': { prompt: 12.77, completion: 75.0 },
    'claude-3-opus': { prompt: 12.77, completion: 75.0 },
    'claude-3-opus-20240229': { prompt: 12.77, completion: 75.0 },
    'anthropic/claude-3-haiku-20240307': { prompt: 0.21, completion: 1.25 },
    'claude-3-haiku': { prompt: 0.21, completion: 1.25 },
    'gpt-c3h': { prompt: 0.21, completion: 1.25 },
    'claude-3-haiku-20240307': { prompt: 0.21, completion: 1.25 },
    'google/gemini-1.5-pro': { prompt: 5.96, completion: 21.0 },
    'gemini-1.5-pro': { prompt: 5.96, completion: 21.0 },
    'google/gemini-1.5-pro-exp-0827': { prompt: 5.96, completion: 21.0 },
    'gemini-1.5-pro-exp-0827': { prompt: 5.96, completion: 21.0 },
    'google/gemini-1.5-flash': { prompt: 0.13, completion: 0.6 },
    'gemini-1.5-flash': { prompt: 0.13, completion: 0.6 },
    'google/gemini-1.5-flash-exp-0827': { prompt: 0.13, completion: 0.6 },
    'gemini-1.5-flash-exp': { prompt: 0.13, completion: 0.6 },
    'gemini-1.5-flash-exp-0827': { prompt: 0.13, completion: 0.6 },
    'google/gemini-1.5-flash-8b-exp-0924': { prompt: 0.13, completion: 0.6 },
    'gemini-1.5-flash-8b-exp': { prompt: 0.13, completion: 0.6 },
    'gemini-1.5-flash-8b-exp-0924': { prompt: 0.13, completion: 0.6 },
    'google/search-google': { prompt: 0.05, completion: 0.05 },
    'search-google': { prompt: 0.05, completion: 0.05 },
    'meta-llama/meta-llama-3.2-90b-vision-instruct': { prompt: 94.47, completion: 222.0 },
    'llama-3.2-90b': { prompt: 94.47, completion: 222.0 },
    'llama-3.2-90b-vision': { prompt: 94.47, completion: 222.0 },
    'meta-llama-3.2-90b-vision-instruct': { prompt: 94.47, completion: 222.0 },
    'meta-llama/meta-llama-3.1-405b-instruct': { prompt: 2.3, completion: 2.7 },
    'llama-3.1-405b': { prompt: 2.3, completion: 2.7 },
    'meta-llama-3.1-405b-instruct': { prompt: 2.3, completion: 2.7 },
    'meta-llama/meta-llama-3.1-70b-instruct': { prompt: 0.44, completion: 0.75 },
    'llama-3.1-70b': { prompt: 0.44, completion: 0.75 },
    'meta-llama-3.1-70b-instruct': { prompt: 0.44, completion: 0.75 },
    'meta-llama/meta-llama-3.1-8b-instruct': { prompt: 0.05, completion: 0.06 },
    'llama-3.1-8b': { prompt: 0.05, completion: 0.06 },
    'meta-llama-3.1-8b-instruct': { prompt: 0.05, completion: 0.06 },
    'mattshumer/reflection-llama-3.1-70b': { prompt: 0.3, completion: 0.4 },
    'reflection-70b': { prompt: 0.3, completion: 0.4 },
    'reflection-3.1-70b': { prompt: 0.3, completion: 0.4 },
    'reflection-llama-3.1-70b': { prompt: 0.3, completion: 0.4 },
    'perplexity/llama-3.1-sonar-large-128k-online': { prompt: 12.77, completion: 30.0 },
    'llama-3.1-sonar-large-128k-online': { prompt: 12.77, completion: 30.0 },
    'perplexity/llama-3.1-sonar-small-128k-online': { prompt: 8.51, completion: 20.0 },
    'llama-3.1-sonar-small-128k-online': { prompt: 8.51, completion: 20.0 },
    'perplexity/llama-3.1-sonar-large-128k-chat': { prompt: 12.77, completion: 30.0 },
    'llama-3.1-sonar-large-128k-chat': { prompt: 12.77, completion: 30.0 },
    'perplexity/llama-3.1-sonar-small-128k-chat': { prompt: 12.77, completion: 30.0 },
    'llama-3.1-sonar-small-128k-chat': { prompt: 12.77, completion: 30.0 },
    'mistralai/mistral-nemo-instruct-2407': { prompt: 0.11, completion: 0.13 },
    'mistral-nemo': { prompt: 0.11, completion: 0.13 },
    'mistral-nemo-instruct': { prompt: 0.11, completion: 0.13 },
    'mistral-nemo-instruct-latest': { prompt: 0.11, completion: 0.13 },
    'mistral-tiny-2407': { prompt: 0.11, completion: 0.13 },
    'mistral-tiny': { prompt: 0.11, completion: 0.13 },
    'mistral-tiny-latest': { prompt: 0.11, completion: 0.13 },
    'mistral-nemo-instruct-2407': { prompt: 0.11, completion: 0.13 },
    'mistralai/codestral-2405': { prompt: 0.05, completion: 0.05 },
    'codestral-latest': { prompt: 0.05, completion: 0.05 },
    codestral: { prompt: 0.05, completion: 0.05 },
    'codestral-2405': { prompt: 0.05, completion: 0.05 },
    'alibaba-cloud/qwen-2.5-72b-instruct': { prompt: 0.3, completion: 0.4 },
    'qwen-2.5-72b': { prompt: 0.3, completion: 0.4 },
    'qwen-2.5': { prompt: 0.3, completion: 0.4 },
    'qwen-2.5-72b-instruct': { prompt: 0.3, completion: 0.4 },
    'alibaba-cloud/qwen-2.5-coder-7b': { prompt: 0.47, completion: 0.55 },
    'qwen-2.5-coder': { prompt: 0.47, completion: 0.55 },
    'qwen-2.5-code': { prompt: 0.47, completion: 0.55 },
    'qwen-2.5-code-7b': { prompt: 0.47, completion: 0.55 },
    'qwen-2.5-coder-7b': { prompt: 0.47, completion: 0.55 },
    'alibaba-cloud/qwen-2.5-math-72b': { prompt: 0.94, completion: 1.11 },
    'qwen-2.5-math': { prompt: 0.94, completion: 1.11 },
    'qwen-2.5-maths': { prompt: 0.94, completion: 1.11 },
    'qwen-2.5-math-72b': { prompt: 0.94, completion: 1.11 },
    'cohere/command-r-plus-08-2024': { prompt: 0.05, completion: 0.05 },
    'command-r-plus-08-2024': { prompt: 0.05, completion: 0.05 },
    'cohere/command-r-plus': { prompt: 0.05, completion: 0.05 },
    'command-r-plus': { prompt: 0.05, completion: 0.05 },
    'cohere/command-r-08-2024': { prompt: 0.05, completion: 0.05 },
    'command-r-08-2024': { prompt: 0.05, completion: 0.05 },
    'cohere/command-r': { prompt: 0.05, completion: 0.05 },
    'command-r': { prompt: 0.05, completion: 0.05 },
    'black-forest-labs/flux1-pro': { prompt: 0.05, completion: 0.05 },
    'flux-pro': { prompt: 0.05, completion: 0.05 },
    'flux.1-pro': { prompt: 0.05, completion: 0.05 },
    'flux1-pro': { prompt: 0.05, completion: 0.05 },
    'black-forest-labs/flux1-dev': { prompt: 0.05, completion: 0.05 },
    'flux-dev': { prompt: 0.05, completion: 0.05 },
    'flux.1-dev': { prompt: 0.05, completion: 0.05 },
    'flux1-dev': { prompt: 0.05, completion: 0.05 },
    'black-forest-labs/flux1-schnell': { prompt: 0.05, completion: 0.05 },
    'flux-schnell': { prompt: 0.05, completion: 0.05 },
    'flux.1-schnell': { prompt: 0.05, completion: 0.05 },
    'flux1-schnell': { prompt: 0.05, completion: 0.05 },
    'stabilityai/sdxl': { prompt: 0.05, completion: 0.05 },
    sdxl: { prompt: 0.05, completion: 0.05 },
    'stabilityai/sdxl-inpaint': { prompt: 0.05, completion: 0.05 },
    'sdxl-inpaint': { prompt: 0.05, completion: 0.05 },
    'stabilityai/dreamshaperxl-v10': { prompt: 0.05, completion: 0.05 },
    'dreamshaperxl-v10': { prompt: 0.05, completion: 0.05 },
    'stabilityai/juggernautxl': { prompt: 0.05, completion: 0.05 },
    juggernautxl: { prompt: 0.05, completion: 0.05 },
    'stabilityai/turbovisionxl': { prompt: 0.05, completion: 0.05 },
    turbovisionxl: { prompt: 0.05, completion: 0.05 },
    'stabilityai/realistic-vision-v5.1': { prompt: 0.05, completion: 0.05 },
    'realistic-vision-v5.1': { prompt: 0.05, completion: 0.05 },
    'elevenlabs/eleven_turbo_v2_5': { prompt: 0.05, completion: 0.05 },
    eleven_turbo_v2_5: { prompt: 0.05, completion: 0.05 },
    'elevenlabs/eleven_multilingual_v2': { prompt: 0.05, completion: 0.05 },
    eleven_multilingual_v2: { prompt: 0.05, completion: 0.05 },
    'cliffweitzma/speechify': { prompt: 0.05, completion: 0.05 },
    speechify: { prompt: 0.05, completion: 0.05 },
    'duckduckgo/search-ddg': { prompt: 0.05, completion: 0.05 },
    // 'search-ddg': { prompt: 0.05, completion: 0.05 },

    // Together.ai models
    'allenai/OLMo-7B': { prompt: 0.85, completion: 3.4 },
    'meta-llama/Llama-3.3-70B-Instruct-Turbo': { prompt: 3.72, completion: 14.88 },
    'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo': { prompt: 0.76, completion: 3.04 },
    'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo': { prompt: 3.72, completion: 14.88 },
    'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo': { prompt: 14.84, completion: 59.36 },
    'meta-llama/Meta-Llama-3-8B-Instruct-Turbo': { prompt: 0.76, completion: 3.04 },
    'meta-llama/Meta-Llama-3-70B-Instruct-Turbo': { prompt: 3.72, completion: 14.88 },
    'meta-llama/Llama-3.2-3B-Instruct-Turbo': { prompt: 0.25, completion: 1.02 },
    'meta-llama/Meta-Llama-3-8B-Instruct-Lite': { prompt: 0.42, completion: 1.7 },
    'meta-llama/Meta-Llama-3-70B-Instruct-Lite': { prompt: 2.29, completion: 9.16 },
    'meta-llama/Llama-3-8b-chat-hf': { prompt: 0.85, completion: 3.4 },
    'meta-llama/Llama-3-70b-chat-hf': { prompt: 3.82, completion: 15.28 },
    'nvidia/Llama-3.1-Nemotron-70B-Instruct-HF': { prompt: 3.82, completion: 15.28 },
    'Qwen/Qwen2.5-Coder-32B-Instruct': { prompt: 3.39, completion: 13.56 },
    'Qwen/QwQ-32B-Preview': { prompt: 5.09, completion: 20.36 },
    'microsoft/WizardLM-2-8x22B': { prompt: 5.09, completion: 20.36 },
    'google/gemma-2-27b-it': { prompt: 3.39, completion: 13.56 },
    'google/gemma-2-9b-it': { prompt: 0.85, completion: 3.4 },
    'databricks/dbrx-instruct': { prompt: 3.82, completion: 15.28 },
    'deepseek-ai/deepseek-llm-67b-chat': { prompt: 3.82, completion: 15.28 },
    'deepseek-ai/DeepSeek-V3': { prompt: 5.3, completion: 21.2 },
    'google/gemma-2b-it': { prompt: 0.42, completion: 1.7 },
    'Gryphe/MythoMax-L2-13b': { prompt: 1.27, completion: 5.08 },
    'meta-llama/Llama-2-13b-chat-hf': { prompt: 1.27, completion: 5.08 },
    'mistralai/Mistral-7B-Instruct-v0.1': { prompt: 0.85, completion: 3.4 },
    'mistralai/Mistral-7B-Instruct-v0.2': { prompt: 0.85, completion: 3.4 },
    'mistralai/Mistral-7B-Instruct-v0.3': { prompt: 0.85, completion: 3.4 },
    'mistralai/Mixtral-8x7B-Instruct-v0.1': { prompt: 2.54, completion: 10.16 },
    'mistralai/Mixtral-8x22B-Instruct-v0.1': { prompt: 5.09, completion: 20.36 },
    'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO': { prompt: 2.54, completion: 10.16 },
    'Qwen/Qwen2.5-7B-Instruct-Turbo': { prompt: 1.27, completion: 5.08 },
    'Qwen/Qwen2.5-72B-Instruct-Turbo': { prompt: 5.09, completion: 20.36 },
    'Qwen/Qwen2-72B-Instruct': { prompt: 3.82, completion: 15.28 },
    'upstage/SOLAR-10.7B-Instruct-v1.0': { prompt: 1.27, completion: 5.08 },
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
    return 'gpt-3.5-turbo-16k';
  } else if (modelName.includes('gpt-3.5-turbo-0125')) {
    return 'gpt-3.5-turbo-0125';
  } else if (modelName.includes('gpt-3.5-turbo-1106')) {
    return 'gpt-3.5-turbo-1106';
  } else if (modelName.includes('gpt-3.5')) {
    return 'gpt-3.5';
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
    return 'gpt-4-vision';
  } else if (modelName.includes('gpt-4-1106')) {
    return 'gpt-4-1106';
  } else if (modelName.includes('gpt-4-0125')) {
    return 'gpt-4-0125';
  } else if (modelName.includes('gpt-4-turbo')) {
    return 'gpt-4-turbo';
  } else if (modelName.includes('gpt-4-32k')) {
    return 'gpt-4-32k';
  } else if (modelName.includes('gpt-4')) {
    return 'gpt-4';
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
