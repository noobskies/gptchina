const { Strategy: AppleStrategy } = require('passport-apple');
const jwt = require('jsonwebtoken');
const socialLogin = require('./socialLogin');
const { logger } = require('~/config');

const getProfileDetails = (profile) => {
  console.log('getProfileDetails called with:', {
    profile: JSON.stringify(profile, null, 2),
  });

  const shortId = profile.id || profile.sub;
  const truncatedId = shortId ? shortId.split('.')[0] : 'unknown';

  const profileData = {
    email: profile.email,
    id: profile.id || profile.sub,
    avatarUrl: '',
    username: `apple_${truncatedId}`,
    name: profile.name || `Apple User ${truncatedId}`,
    emailVerified: profile.email_verified || true,
    isPrivateEmail: profile.is_private_email || true,
    provider: 'apple',
  };

  console.log('Constructed profile data:', JSON.stringify(profileData, null, 2));
  return profileData;
};

const appleLogin = socialLogin('apple', getProfileDetails);

const verifyMobileToken = async (token) => {
  console.log('verifyMobileToken called with token:', token ? 'present' : 'missing');
  try {
    const decodedToken = jwt.decode(token);
    console.log('Decoded token:', JSON.stringify(decodedToken, null, 2));

    if (!decodedToken) {
      throw new Error('Invalid token format');
    }

    if (!decodedToken.sub) {
      throw new Error('Missing required profile information');
    }

    const profile = {
      id: decodedToken.sub,
      email: decodedToken.email,
      sub: decodedToken.sub,
      name: decodedToken.name || null,
      email_verified: decodedToken.email_verified,
      is_private_email: decodedToken.is_private_email,
      provider: 'apple',
    };

    console.log('Created profile from token:', JSON.stringify(profile, null, 2));
    return profile;
  } catch (error) {
    console.error('Apple token verification error:', error);
    throw new Error(error.message || 'Invalid token');
  }
};

const handleAppleToken = async (token) => {
  console.log('handleAppleToken called');
  try {
    const profile = await verifyMobileToken(token);
    console.log('Profile after verification:', JSON.stringify(profile, null, 2));

    return new Promise((resolve, reject) => {
      appleLogin(null, null, profile, (err, user) => {
        if (err) {
          console.error('Social login error:', err);
          reject(err);
        } else if (!user) {
          console.error('No user returned from social login');
          reject(new Error('No user returned from social login'));
        } else {
          console.log('Social login successful, user:', JSON.stringify(user, null, 2));
          resolve({
            user,
            created: !user._id,
          });
        }
      });
    });
  } catch (error) {
    console.error('Handle Apple token error:', error);
    throw error;
  }
};

module.exports = () =>
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: process.env.APPLE_PRIVATE_KEY,
      callbackURL: `${process.env.DOMAIN_SERVER}${process.env.APPLE_CALLBACK_URL}`,
      scope: ['name', 'email'],
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, idToken, profile, cb) => {
      try {
        console.log('Apple OAuth Callback Data:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasIdToken: !!idToken,
          profile: JSON.stringify(profile, null, 2),
        });

        if (idToken) {
          const decodedToken = jwt.decode(idToken);
          console.log('Decoded ID token:', JSON.stringify(decodedToken, null, 2));
          profile = {
            ...profile,
            id: decodedToken.sub,
            email: decodedToken.email,
            sub: decodedToken.sub,
            email_verified: decodedToken.email_verified,
            is_private_email: decodedToken.is_private_email,
          };
        }

        console.log('Final profile being passed to appleLogin:', JSON.stringify(profile, null, 2));
        return appleLogin(accessToken, refreshToken, profile, cb);
      } catch (error) {
        console.error('Error in Apple Strategy:', error);
        return cb(error);
      }
    },
  );
