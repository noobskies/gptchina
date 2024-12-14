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
    console.log('Received Apple mobile request with body:', {
      body: JSON.stringify(req.body, null, 2),
      token: req.body.token ? 'present' : 'missing',
      profile: req.body.profile ? JSON.stringify(req.body.profile, null, 2) : 'missing',
    });

    const { token } = req.body;

    if (!token) {
      console.log('No token provided in request');
      return res.status(400).json({ error: 'Token is required' });
    }

    try {
      console.log('Attempting to handle Apple token...');
      const { user, created } = await handleAppleToken(token);
      console.log('Token handled successfully:', { userId: user._id, created });

      req.user = user;
      await oauthHandler(req, res);
    } catch (error) {
      console.log('Error in Apple mobile token verification:', error);
      if (error instanceof Error) {
        console.log('Error details:', {
          message: error.message,
          stack: error.stack,
        });
      }
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (err) {
    console.log('Error in Apple mobile authentication:', err);
    if (err instanceof Error) {
      console.log('Error details:', {
        message: err.message,
        stack: err.stack,
      });
    }
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

router.post(
  // Note: Apple uses POST for callback
  '/apple/callback',
  passport.authenticate('apple', {
    failureRedirect: `${domains.client}/login`,
    failureMessage: true,
    session: false,
    scope: ['name', 'email'],
  }),
  oauthHandler,
);

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
