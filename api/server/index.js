require('dotenv').config();
const path = require('path');
require('module-alias')({ base: path.resolve(__dirname, '..') });
const cors = require('cors');
const axios = require('axios');
const express = require('express');
const compression = require('compression');
const passport = require('passport');
const mongoSanitize = require('express-mongo-sanitize');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { jwtLogin, passportLogin } = require('~/strategies');
const { connectDb, indexSync } = require('~/lib/db');
const { isEnabled } = require('~/server/utils');
const { ldapLogin } = require('~/strategies');
const { logger } = require('~/config');
const validateImageRequest = require('./middleware/validateImageRequest');
const errorController = require('./controllers/ErrorController');
const StripeController = require('./controllers/payment/StripeController');
const StripeService = require('./services/payment/StripeService');
const OpenNodeService = require('./services/payment/OpenNodeService');
const configureSocialLogins = require('./socialLogins');
const AppService = require('./services/AppService');
const staticCache = require('./utils/staticCache');
const noIndex = require('./middleware/noIndex');
const routes = require('./routes');

require('./cron');

const { PORT, HOST, ALLOW_SOCIAL_LOGIN, DISABLE_COMPRESSION } = process.env ?? {};

const port = Number(PORT) || 3080;
const host = HOST || 'localhost';

const startServer = async () => {
  if (typeof Bun !== 'undefined') {
    axios.defaults.headers.common['Accept-Encoding'] = 'gzip';
  }
  await connectDb();
  logger.info('Connected to MongoDB');
  await indexSync();

  const app = express();

  app.disable('x-powered-by');
  await AppService(app);

  const indexPath = path.join(app.locals.paths.dist, 'index.html');
  const indexHTML = fs.readFileSync(indexPath, 'utf8');

  app.get('/health', (_req, res) => res.status(200).send('OK'));

  /* Middleware */
  app.use(noIndex);
  app.use(errorController);
  app.post(
    '/api/payment/stripe/webhook',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
      const signature = req.headers['stripe-signature'];

      console.log('Webhook received:', {
        eventType: JSON.parse(req.body.toString()).type,
        signature: signature?.slice(0, 20) + '...',
      });

      try {
        const event = await StripeService.handleWebhook(req.body, signature);
        console.log('Webhook processed successfully:', {
          type: event.type,
          paymentIntentId: event.data?.object?.id,
          metadata: event.data?.object?.metadata,
          amount: event.data?.object?.amount,
        });

        res.json({ received: true });
      } catch (err) {
        console.error('Webhook error:', err);
        res.status(400).json({ error: err.message });
      }
    },
  );

  app.post(
    '/api/payment/opennode/webhook',
    express.raw({ type: '*/*' }), // Accept all content types
    async (req, res) => {
      try {
        console.log('Raw webhook request received:', {
          headers: req.headers,
          body: req.body.toString(),
          method: req.method,
          url: req.url,
          contentType: req.headers['content-type'],
        });

        let payload;
        try {
          // Try to parse JSON
          payload = JSON.parse(req.body.toString());
        } catch (e) {
          // If JSON parsing fails, try to parse as URL encoded form data
          payload = new URLSearchParams(req.body.toString());
          payload = Object.fromEntries(payload);
        }

        const signature = req.headers['x-opennode-signature'];

        console.log('OpenNode Webhook received:', {
          payload,
          signature,
        });

        await OpenNodeService.handleWebhook(payload, signature);
        res.json({ received: true });
      } catch (err) {
        console.log('OpenNode Webhook processing error:', {
          error: err.message,
          stack: err.stack,
          rawBody: req.body.toString(),
          headers: req.headers,
        });
        res.sendStatus(200);
      }
    },
  );

  app.use(
    express.json({
      limit: '5mb',
      verify: (req, res, buf) => {
        req.rawBody = buf.toString();
      },
    }),
  );
  app.use(mongoSanitize());
  app.use(express.urlencoded({ extended: true, limit: '3mb' }));
  app.use(staticCache(app.locals.paths.dist));
  app.use(staticCache(app.locals.paths.fonts));
  app.use(staticCache(app.locals.paths.assets));
  app.set('trust proxy', 1); /* trust first proxy */
  app.use(cors());
  app.use(cookieParser());

  if (!isEnabled(DISABLE_COMPRESSION)) {
    app.use(compression());
  }

  if (!ALLOW_SOCIAL_LOGIN) {
    console.warn(
      'Social logins are disabled. Set Environment Variable "ALLOW_SOCIAL_LOGIN" to true to enable them.',
    );
  }

  /* OAUTH */
  app.use(passport.initialize());
  passport.use(await jwtLogin());
  passport.use(passportLogin());

  /* LDAP Auth */
  if (process.env.LDAP_URL && process.env.LDAP_USER_SEARCH_BASE) {
    passport.use(ldapLogin);
  }

  if (isEnabled(ALLOW_SOCIAL_LOGIN)) {
    configureSocialLogins(app);
  }

  app.use('/oauth', routes.oauth);
  /* API Endpoints */
  app.use('/api/auth', routes.auth);
  app.use('/api/keys', routes.keys);
  app.use('/api/user', routes.user);
  app.use('/api/search', routes.search);
  app.use('/api/ask', routes.ask);
  app.use('/api/edit', routes.edit);
  app.use('/api/messages', routes.messages);
  app.use('/api/convos', routes.convos);
  app.use('/api/presets', routes.presets);
  app.use('/api/prompts', routes.prompts);
  app.use('/api/categories', routes.categories);
  app.use('/api/tokenizer', routes.tokenizer);
  app.use('/api/endpoints', routes.endpoints);
  app.use('/api/balance', routes.balance);
  app.use('/api/models', routes.models);
  app.use('/api/plugins', routes.plugins);
  app.use('/api/config', routes.config);
  app.use('/api/payment/stripe', routes.payment.stripe);
  app.use('/api/payment/opennode', routes.payment.opennode);
  app.use('/api/payment/inapp', routes.payment.inapp);
  app.use('/api/assistants', routes.assistants);
  app.use('/api/files', await routes.files.initialize());
  app.use('/images/', validateImageRequest, routes.staticRoute);
  app.use('/api/share', routes.share);
  app.use('/api/roles', routes.roles);
  app.use('/api/agents', routes.agents);
  app.use('/api/banner', routes.banner);
  app.use('/api/bedrock', routes.bedrock);

  app.use('/api/tags', routes.tags);

  app.use((req, res) => {
    res.set({
      'Cache-Control': process.env.INDEX_CACHE_CONTROL || 'no-cache, no-store, must-revalidate',
      Pragma: process.env.INDEX_PRAGMA || 'no-cache',
      Expires: process.env.INDEX_EXPIRES || '0',
    });

    const lang = req.cookies.lang || req.headers['accept-language']?.split(',')[0] || 'en-US';
    const saneLang = lang.replace(/"/g, '&quot;');
    const updatedIndexHtml = indexHTML.replace(/lang="en-US"/g, `lang="${saneLang}"`);
    res.type('html');
    res.send(updatedIndexHtml);
  });

  app.listen(port, host, () => {
    if (host == '0.0.0.0') {
      logger.info(
        `Server listening on all interfaces at port ${port}. Use http://localhost:${port} to access it`,
      );
    } else {
      logger.info(`Server listening at http://${host == '0.0.0.0' ? 'localhost' : host}:${port}`);
    }
  });
};

startServer();

let messageCount = 0;
process.on('uncaughtException', (err) => {
  if (!err.message.includes('fetch failed')) {
    logger.error('There was an uncaught error:', err);
  }

  if (err.message.includes('fetch failed')) {
    if (messageCount === 0) {
      logger.warn('Meilisearch error, search will be disabled');
      messageCount++;
    }

    return;
  }

  if (err.message.includes('OpenAIError') || err.message.includes('ChatCompletionMessage')) {
    logger.error(
      '\n\nAn Uncaught `OpenAIError` error may be due to your reverse-proxy setup or stream configuration, or a bug in the `openai` node package.',
    );
    return;
  }

  process.exit(1);
});
