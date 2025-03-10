const appleLogin = require('./appleStrategy');
const passportLogin = require('./localStrategy');
const { strategy: googleLogin, handleAndroidToken } = require('./googleStrategy');
const githubLogin = require('./githubStrategy');
const discordLogin = require('./discordStrategy');
const facebookLogin = require('./facebookStrategy');
const setupOpenId = require('./openidStrategy');
const jwtLogin = require('./jwtStrategy');
const ldapLogin = require('./ldapStrategy');

module.exports = {
  appleLogin,
  passportLogin,
  googleLogin,
  handleAndroidToken,
  appleLogin,
  githubLogin,
  discordLogin,
  jwtLogin,
  facebookLogin,
  setupOpenId,
  ldapLogin,
};
