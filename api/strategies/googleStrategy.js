const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { OAuth2Client } = require('google-auth-library');
const socialLogin = require('./socialLogin');

const getProfileDetails = (profile) => ({
  email: profile.emails[0].value,
  id: profile.id,
  avatarUrl: profile.photos[0].value,
  username: profile.name.givenName,
  name: `${profile.name.givenName} ${profile.name.familyName}`,
  emailVerified: profile.emails[0].verified,
});

const googleLogin = socialLogin('google', getProfileDetails);

class CustomGoogleStrategy extends GoogleStrategy {
  constructor(options, verify) {
    super(options, verify);
    this.oAuth2Client = new OAuth2Client({
      clientId: options.clientID,
      clientSecret: options.clientSecret,
    });
  }

  async authenticate(req, options) {
    if (req.body && req.body.id_token) {
      try {
        console.log('Verifying Firebase ID token...');

        // Log token details (without showing the full token)
        const tokenParts = req.body.id_token.split('.');
        console.log('Token header:', JSON.parse(Buffer.from(tokenParts[0], 'base64').toString()));

        // Verify the token
        const loginTicket = await this.oAuth2Client.verifyIdToken({
          idToken: req.body.id_token,
          audience: [
            this._oauth2._clientId, // Web client ID
            '397122273433-nu924lptlrh9kp2d1te1t7pn9cafufo1.apps.googleusercontent.com', // Android client ID
            '397122273433-cu4vlplj3de7cd6ecmuftc54s1e92cb3.apps.googleusercontent.com', // Firebase client ID
          ],
        });

        const payload = loginTicket.getPayload();
        console.log('Token payload:', {
          sub: payload.sub,
          email: payload.email,
          name: payload.name,
          isEmailVerified: payload.email_verified,
        });

        const profile = {
          id: payload.sub,
          displayName: payload.name,
          name: {
            givenName: payload.given_name,
            familyName: payload.family_name,
          },
          emails: [{ value: payload.email, verified: payload.email_verified }],
          photos: [{ value: payload.picture }],
        };

        this._verify(null, null, profile, (err, user) => {
          if (err) {
            console.error('Verify callback error:', err);
            return this.error(err);
          }
          if (!user) {
            console.log('No user returned from verify callback');
            return this.fail();
          }
          console.log('Successfully authenticated user:', user.email);
          this.success(user);
        });
      } catch (error) {
        console.error('Detailed token verification error:', {
          message: error.message,
          stack: error.stack,
          code: error.code,
          details: error.details,
        });
        this.error(error);
      }
    } else {
      // Handle regular web OAuth flow
      super.authenticate(req, options);
    }
  }
}

module.exports = () =>
  new CustomGoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.DOMAIN_SERVER}${process.env.GOOGLE_CALLBACK_URL}`,
      proxy: true,
    },
    googleLogin,
  );
