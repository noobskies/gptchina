const express = require('express');
const {
  resetPasswordRequestController,
  resetPasswordController,
  refreshController,
  registrationController,
  verifyEmailController,
} = require('../controllers/AuthController');
const { loginController } = require('../controllers/auth/LoginController');
const { logoutController } = require('../controllers/auth/LogoutController');
const {
  checkBan,
  loginLimiter,
  registerLimiter,
  requireJwtAuth,
  requireLocalAuth,
  requireEmailVerification,
  validateRegistration,
} = require('../middleware');

const router = express.Router();

// Local
router.post('/logout', requireJwtAuth, logoutController);
router.post('/login', loginLimiter, checkBan, requireLocalAuth, loginController);
router.post('/refresh', refreshController);
router.post('/register', registerLimiter, checkBan, validateRegistration, registrationController);
router.post('/requestPasswordReset', resetPasswordRequestController);
router.post('/resetPassword', resetPasswordController);

// Email verification
router.get('/verify-email/:token', verifyEmailController);

// Protected routes that require email verification
router.get('/protected', requireJwtAuth, requireEmailVerification, (req, res) => {
  res.status(200).json({ message: 'Access granted to protected route' });
});

module.exports = router;
