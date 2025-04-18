const { OAuth2Client } = require('google-auth-library');
const { User } = require('~/models');
const { logger } = require('~/config');
const { setAuthTokens } = require('~/server/services/AuthService');
const setBalanceConfig = require('~/server/middleware/setBalanceConfig');

/**
 * Handles authentication from mobile devices using Google Sign-In
 * Verifies the ID token and creates or finds the user
 *
 * @param {Object} req - Express request object with idToken in the body
 * @param {Object} res - Express response object
 */
const mobileGoogleAuthController = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'ID token is required' });
    }

    // Verify the ID token with Google
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Extract user info from the payload
    const { sub: id, email, name, picture: avatarUrl, email_verified: emailVerified } = payload;
    const firstName = payload.given_name || name.split(' ')[0];

    // Find or create the user
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if they don't exist
      user = await User.create({
        provider: 'google',
        googleId: id,
        email,
        name,
        username: firstName,
        avatarUrl,
        emailVerified: !!emailVerified,
      });
    } else if (!user.googleId) {
      // If user exists but doesn't have a googleId, link the accounts
      user.provider = 'google';
      user.googleId = id;

      // Update avatar and verified status if needed
      if (avatarUrl && !user.avatarUrl) {
        user.avatarUrl = avatarUrl;
      }

      if (emailVerified && !user.emailVerified) {
        user.emailVerified = true;
      }

      await user.save();
    }

    // Set authentication tokens
    await setAuthTokens(user._id, res);

    // Set up request for balance configuration middleware
    req.user = user;

    // Apply balance configuration
    await new Promise((resolve) => {
      setBalanceConfig(req, res, resolve);
    });

    // Return user info
    return res.status(200).json({
      message: 'Authentication successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    logger.error('Mobile Google authentication error:', error);
    return res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

module.exports = {
  mobileGoogleAuthController,
};
