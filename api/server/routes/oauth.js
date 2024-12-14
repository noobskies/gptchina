const express = require('express');
const passport = require('passport');
const { loginLimiter, checkBan, checkDomainAllowed } = require('~/server/middleware');
const { setAuthTokens } = require('~/server/services/AuthService');
const { logger } = require('~/config');
const { handleMobileToken } = require('~/strategies/googleStrategy');
const { handleAppleToken } = require('~/strategies/appleStrategy');

const router = express.Router();

const domains = {
  client: process.env.DOMAIN_CLIENT,
  server: process.env.DOMAIN_SERVER,
};

router.use(loginLimiter);

const oauthHandler = async (req, res) => {
  try {
    await checkDomainAllowed(req, res);
    await checkBan(req, res);
    if (req.banned) {
      return;
    }
    await setAuthTokens(req.user._id, res);
    res.redirect(domains.client);
  } catch (err) {
    logger.error('Error in setting authentication tokens:', err);
  }
};

router.post('/google/mobile', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    try {
      const { user, created } = await handleMobileToken(token);
      req.user = user;
      await oauthHandler(req, res);
    } catch (error) {
      logger.error('Error in mobile token verification:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (err) {
    logger.error('Error in mobile authentication:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/apple/mobile', async (req, res) => {
  try {
    const { token } = req.body;
    logger.info('Received Apple mobile auth request');

    if (!token) {
      logger.error('No token provided');
      return res.status(400).json({ error: 'Token is required' });
    }

    try {
      const { user, created } = await handleAppleToken(token);
      logger.info('Apple token handled successfully');
      req.user = user;

      await setAuthTokens(user._id, res);
      logger.info('Auth tokens set');

      // Always redirect for mobile Apple auth
      const redirectUrl = `https://novlisky.io/oauth/login-success?userId=${user._id}`;
      logger.info('Redirecting to app:', redirectUrl);
      return res.redirect(redirectUrl);
    } catch (error) {
      logger.error('Error in Apple mobile token verification:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (err) {
    logger.error('Error in Apple mobile authentication:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Google Routes
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['openid', 'profile', 'email'],
    session: false,
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${domains.client}/login`,
    failureMessage: true,
    session: false,
    scope: ['openid', 'profile', 'email'],
  }),
  oauthHandler,
);

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile'],
    profileFields: ['id', 'email', 'name'],
    session: false,
  }),
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: `${domains.client}/login`,
    failureMessage: true,
    session: false,
    scope: ['public_profile'],
    profileFields: ['id', 'email', 'name'],
  }),
  oauthHandler,
);

router.get(
  '/openid',
  passport.authenticate('openid', {
    session: false,
  }),
);

router.get(
  '/openid/callback',
  passport.authenticate('openid', {
    failureRedirect: `${domains.client}/login`,
    failureMessage: true,
    session: false,
  }),
  oauthHandler,
);

router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email', 'read:user'],
    session: false,
  }),
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${domains.client}/login`,
    failureMessage: true,
    session: false,
    scope: ['user:email', 'read:user'],
  }),
  oauthHandler,
);

/**
 * Apple Routes
 */
router.get(
  '/apple',
  passport.authenticate('apple', {
    scope: ['name', 'email'],
    session: false,
  }),
);

router.post('/apple/mobile', async (req, res) => {
  try {
    const { token } = req.body;
    logger.info('Received Apple mobile auth request');

    if (!token) {
      logger.error('No token provided');
      return res.status(400).json({ error: 'Token is required' });
    }

    try {
      const { user, created } = await handleAppleToken(token);
      logger.info('Apple token handled successfully');

      await setAuthTokens(user._id, res);
      logger.info('Auth tokens set');

      // Redirect back to apple callback
      const redirectUrl = `https://novlisky.io/oauth/apple/callback?userId=${user._id}`;
      logger.info('Redirecting to app:', redirectUrl);
      return res.redirect(redirectUrl);
    } catch (error) {
      logger.error('Error in Apple mobile token verification:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (err) {
    logger.error('Error in Apple mobile authentication:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get(
  '/discord',
  passport.authenticate('discord', {
    scope: ['identify', 'email'],
    session: false,
  }),
);

router.get(
  '/discord/callback',
  passport.authenticate('discord', {
    failureRedirect: `${domains.client}/login`,
    failureMessage: true,
    session: false,
    scope: ['identify', 'email'],
  }),
  oauthHandler,
);

module.exports = router;
