// server/middleware/requireEmailVerification.js
const requireEmailVerification = (req, res, next) => {
  if (!req.user.emailVerified) {
    return res.status(401).json({ message: 'Email verification required' });
  }
  next();
};

module.exports = requireEmailVerification;
