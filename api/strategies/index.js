// api/strategies/index.js
const passportLogin = require('./localStrategy');
const { strategy: googleLogin, handleAndroidToken } = require('./googleStrategy');
const { strategy: appleLogin, handleAppleToken } = require('./appleStrategy');
const githubLogin = require('./githubStrategy');
const discordLogin = require('./discordStrategy');
const facebookLogin = require('./facebookStrategy');
const setupOpenId = require('./openidStrategy');
const jwtLogin = require('./jwtStrategy');
const ldapLogin = require('./ldapStrategy');

module.exports = {
  passportLogin,
  googleLogin,
  handleAndroidToken,
  appleLogin,
  handleAppleToken,
  githubLogin,
  discordLogin,
  jwtLogin,
  facebookLogin,
  setupOpenId,
  ldapLogin,
};
