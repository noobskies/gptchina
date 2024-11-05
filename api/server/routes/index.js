// api/server/routes/index.js
const assistants = require('./assistants');
const categories = require('./categories');
const tokenizer = require('./tokenizer');
const endpoints = require('./endpoints');
const staticRoute = require('./static');
const messages = require('./messages');
const presets = require('./presets');
const prompts = require('./prompts');
const balance = require('./balance');
const plugins = require('./plugins');
const bedrock = require('./bedrock');
const search = require('./search');
const models = require('./models');
const convos = require('./convos');
const config = require('./config');
const payment = require('./payment');
const files = require('./files');
const claimTokens = require('./claimTokens');
const share = require('./share');
const agents = require('./agents');
const roles = require('./roles');
const oauth = require('./oauth');
const tags = require('./tags');
const auth = require('./auth');
const edit = require('./edit');
const keys = require('./keys');
const user = require('./user');
const ask = require('./ask');
const banner = require('./banner');

module.exports = {
  ask,
  edit,
  auth,
  keys,
  user,
  tags,
  roles,
  oauth,
  files,
  share,
  agents,
  bedrock,
  convos,
  search,
  prompts,
  config,
  models,
  plugins,
  payment,
  assistants,
  staticRoute,
  claimTokens,
  presets,
  balance,
  messages,
  endpoints,
  tokenizer,
  assistants,
  categories,
  staticRoute,
  banner,
};
