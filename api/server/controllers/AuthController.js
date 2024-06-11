const crypto = require('crypto');
const cookies = require('cookie');
const jwt = require('jsonwebtoken');
const { Session, User } = require('~/models');
const getUserById = require('~/models/userMethods');
const Balance = require('~/models/Balance');
const {
  registerUser,
  resetPassword,
  verifyEmail,
  setAuthTokens,
  requestPasswordReset,
} = require('~/server/services/AuthService');
const { logger } = require('~/config');

const registrationController = async (req, res) => {
  try {
    const response = await registerUser(req.body);
    console.log('Response:', response);
    if (response.status === 200) {
      const { status, user } = response;
      console.log('User:', user);
      if (user && user._id) {
        let newUser = await User.findOne({ _id: user._id });
        if (!newUser) {
          newUser = new User(user);
        }

        newUser.lastTokenClaimTimestamp = new Date();
        console.log(
          'Setting lastTokenClaimTimestamp during registration:',
          newUser.lastTokenClaimTimestamp,
        );
        await newUser.save();
        console.log('User saved with lastTokenClaimTimestamp:', newUser.lastTokenClaimTimestamp);

        // Create a new Balance document for the user with 25,000 token credits
        const newBalance = new Balance({
          user: newUser._id,
          tokenCredits: 25000,
        });
        await newBalance.save();

        // Do not set the authorization header or send the user object in the response
        res.status(status).send({
          message: 'Registration successful. Please check your email to verify your email address.',
        });
      } else {
        // Handle the case when user or user._id is undefined
        logger.error('[registrationController] Invalid user object:', user);
        return res.status(500).json({ message: 'Invalid user object' });
      }
    } else {
      const { status, message } = response;
      res.status(status).send({ message });
    }
  } catch (err) {
    logger.error('[registrationController]', err);
    return res.status(500).json({ message: err.message });
  }
};

const resetPasswordRequestController = async (req, res) => {
  try {
    const resetService = await requestPasswordReset(req);
    if (resetService instanceof Error) {
      return res.status(400).json(resetService);
    } else {
      return res.status(200).json(resetService);
    }
  } catch (e) {
    logger.error('[resetPasswordRequestController]', e);
    return res.status(400).json({ message: e.message });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const resetPasswordService = await resetPassword(
      req.body.userId,
      req.body.token,
      req.body.password,
    );
    if (resetPasswordService instanceof Error) {
      return res.status(400).json(resetPasswordService);
    } else {
      return res.status(200).json(resetPasswordService);
    }
  } catch (e) {
    logger.error('[resetPasswordController]', e);
    return res.status(400).json({ message: e.message });
  }
};

const verifyEmailController = async (req, res) => {
  try {
    const verifyEmailService = await verifyEmail(req.body.userId, req.body.token);
    if (verifyEmailService instanceof Error) {
      return res.status(400).json(verifyEmailService);
    } else {
      return res.status(200).json(verifyEmailService);
    }
  } catch (e) {
    logger.error('[verifyEmailController]', e);
    return res.status(400).json({ message: e.message });
  }
};

const refreshController = async (req, res) => {
  const refreshToken = req.headers.cookie ? cookies.parse(req.headers.cookie).refreshToken : null;
  if (!refreshToken) {
    return res.status(200).send('Refresh token not provided');
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await getUserById(payload.id, '-password -__v');
    if (!user) {
      return res.status(401).redirect('/login');
    }

    const userId = payload.id;

    if (process.env.NODE_ENV === 'CI') {
      const token = await setAuthTokens(userId, res);
      return res.status(200).send({ token, user });
    }

    // Hash the refresh token
    const hash = crypto.createHash('sha256');
    const hashedToken = hash.update(refreshToken).digest('hex');

    // Find the session with the hashed refresh token
    const session = await Session.findOne({ user: userId, refreshTokenHash: hashedToken });
    if (session && session.expiration > new Date()) {
      const token = await setAuthTokens(userId, res, session._id);
      res.status(200).send({ token, user });
    } else if (req?.query?.retry) {
      // Retrying from a refresh token request that failed (401)
      res.status(403).send('No session found');
    } else if (payload.exp < Date.now() / 1000) {
      res.status(403).redirect('/login');
    } else {
      res.status(401).send('Refresh token expired or not found for this user');
    }
  } catch (err) {
    logger.error(`[refreshController] Refresh token: ${refreshToken}`, err);
    res.status(403).send('Invalid refresh token');
  }
};

module.exports = {
  refreshController,
  registrationController,
  resetPasswordController,
  verifyEmailController,
  resetPasswordRequestController,
};
