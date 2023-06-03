require('dotenv').config();
const { KeyvFile } = require('keyv-file');
const { genAzureEndpoint } = require('../../utils/genAzureEndpoints');
const tiktoken = require('@dqbd/tiktoken');
const tiktokenModels = require('../../utils/tiktokenModels');
const encoding_for_model = tiktoken.encoding_for_model;
const User = require('../../models/User'); // Import your User Model

const askClient = async ({
  text,
  parentMessageId,
  conversationId,
  model,
  oaiApiKey,
  chatGptLabel,
  promptPrefix,
  temperature,
  top_p,
  presence_penalty,
  frequency_penalty,
  onProgress,
  abortController,
  userId
}) => {
  const { ChatGPTClient } = await import('@waylaidwanderer/chatgpt-api');
  const store = {
    store: new KeyvFile({ filename: './data/cache.json' })
  };

  const azure = process.env.AZURE_OPENAI_API_KEY ? true : false;
  let promptText = 'You are ChatGPT, a large language model trained by OpenAI.';
  if (promptPrefix) {
    promptText = promptPrefix;
  }
  const maxContextTokens = model === 'gpt-4' ? 8191 : model === 'gpt-4-32k' ? 32767 : 4095; // 1 less than maximum
  const clientOptions = {
    reverseProxyUrl: process.env.OPENAI_REVERSE_PROXY || null,
    azure,
    maxContextTokens,
    modelOptions: {
      model,
      temperature,
      top_p,
      presence_penalty,
      frequency_penalty
    },
    chatGptLabel,
    promptPrefix,
    proxy: process.env.PROXY || null
    // debug: true
  };

  let apiKey = oaiApiKey ? oaiApiKey : process.env.OPENAI_KEY || null;

  if (azure) {
    apiKey = oaiApiKey ? oaiApiKey : process.env.AZURE_OPENAI_API_KEY || null;
    clientOptions.reverseProxyUrl = genAzureEndpoint({
      azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
      azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
      azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION
    });
  }

  const client = new ChatGPTClient(apiKey, clientOptions, store);

  const options = {
    onProgress,
    abortController,
    ...(parentMessageId && conversationId ? { parentMessageId, conversationId } : {})
  };

  let usage = {};
  let enc = null;
  try {
    enc = encoding_for_model(tiktokenModels.has(model) ? model : 'gpt-3.5-turbo');
    usage.prompt_tokens = (enc.encode(promptText)).length + (enc.encode(text)).length;
  } catch (e) {
    console.log('Error encoding prompt text', e);
  }
  
  const res = await client.sendMessage(text, { ...options, userId });

  // Find the user who sent the message
  const user = await User.findById(userId);

  // Deduct 1 free message from their account if they have any available
  if (user.freeMessages > 0) {
    user.freeMessages -= 1;
  }

  await user.save();

  res.remainingFreeMessages = user.freeMessages;

  try {
    usage.completion_tokens = (enc.encode(res.response)).length;
    usage.total_tokens = usage.prompt_tokens + usage.completion_tokens;
    res.usage = usage;
  } catch (e) {
    console.log('Error encoding response text', e);
  }
  
  return res;
};

module.exports = { askClient };
