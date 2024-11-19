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
    this.oAuth2Client = new OAuth2Client(options.clientID);
  }

  async authenticate(req, options) {
    if (req.body && req.body.id_token) {
      // Handle mobile token
      try {
        // Verify the token using Google's OAuth2Client
        const ticket = await this.oAuth2Client.verifyIdToken({
          idToken: req.body.id_token,
          audience: this._oauth2._clientId, // Use the same client ID as OAuth
        });

        const payload = ticket.getPayload();
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
            return this.error(err);
          }
          if (!user) {
            return this.fail();
          }
          this.success(user);
        });
      } catch (error) {
        console.error('Token verification error:', error);
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
