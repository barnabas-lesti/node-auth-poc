const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
  AUTH_SALT_ROUNDS,
  AUTH_SECRET,
  ACCESS_TOKEN_EXPIRATION_IN_MINUTES,
  REFRESH_TOKEN_EXPIRATION_IN_MINUTES,
  EMAIL_TOKEN_EXPIRATION_IN_MINUTES,
} = require('../config');
const { User } = require('../models');

class Auth {
  createAuthorizationHeaderString (accessToken, refreshToken) {
    return `Access ${accessToken}; Refresh ${refreshToken};`;
  }

  async hashPassword (password) {
    const passwordHash = await bcrypt.hash(`${password}`, AUTH_SALT_ROUNDS);
    return passwordHash;
  }

  async comparePasswords (password, passwordHash) {
    const result = await bcrypt.compare(`${password}`, passwordHash);
    return result;
  }

  async createAccessAndRefreshTokens (user) {
    const [ accessToken, refreshToken ] = await Promise.all([
      this._createAccessToken(user),
      this._createRefreshToken(user),
    ]);
    return { accessToken, refreshToken };
  }

  async createEmailToken (user) {
    const { email } = user;
    const token = await jwt.sign({ email }, AUTH_SECRET, { expiresIn: `${EMAIL_TOKEN_EXPIRATION_IN_MINUTES}m` });
    return token;
  }

  async verifyAuthorizationHeaderString (headerString) {
    const [ accessFragment = '', refreshFragment = '' ] = headerString.split(';');
    const accessToken = accessFragment.replace(/access\s/i, '').trim();
    const refreshToken = refreshFragment.replace(/refresh\s/i, '').trim();
    if (!accessToken || !refreshToken) return null;

    const verificationResult = await this._verifyAccessAndRefreshTokens(accessToken, refreshToken);
    if (!verificationResult) return null;

    const { newAccessToken, payload } = verificationResult;

    return {
      newHeaderString: newAccessToken ? this.createAuthorizationHeaderString(newAccessToken, refreshToken) : null,
      payload,
    };
  }

  async verifyEmailToken (emailToken) {
    try {
      const payload = await jwt.verify(emailToken, AUTH_SECRET);
      return payload;
    } catch (jwtError) {
      return null;
    }
  }

  _createAuthTokenPayload ({ email }) {
    return { email };
  }

  _createRefreshTokenSecret ({ passwordHash }) {
    return AUTH_SECRET + passwordHash;
  }

  async _createAccessToken (user) {
    const payload = this._createAuthTokenPayload(user);
    const expiresIn = `${ACCESS_TOKEN_EXPIRATION_IN_MINUTES}m`;
    const accessToken = await jwt.sign(payload, AUTH_SECRET, { expiresIn });
    return accessToken;
  }

  async _createRefreshToken (user) {
    const payload = this._createAuthTokenPayload(user);
    const refreshTokenSecret = this._createRefreshTokenSecret(user);
    const expiresIn = `${REFRESH_TOKEN_EXPIRATION_IN_MINUTES}m`;
    const refreshToken = await jwt.sign(payload, refreshTokenSecret, { expiresIn });
    return refreshToken;
  }

  async _verifyAccessToken (accessToken) {
    try {
      const payload = await jwt.verify(accessToken, AUTH_SECRET);
      return payload;
    } catch (jwtError) {
      return null;
    }
  }

  async _verifyRefreshToken (refreshToken) {
    const initialPayload = jwt.decode(refreshToken);
    if (!initialPayload) return null;

    const userDoc = await User.findOne({ email: initialPayload.email });
    if (!userDoc) return null;

    try {
      const refreshTokenSecret = this._createRefreshTokenSecret(userDoc);
      const payload = await jwt.verify(refreshToken, refreshTokenSecret);
      return payload;
    } catch (jwtError) {
      return null;
    }
  }

  async _verifyAccessAndRefreshTokens (accessToken, refreshToken) {
    const accessPayload = await this._verifyAccessToken(accessToken);
    if (accessPayload) return { payload: accessPayload };

    const refreshPayload = await await this._verifyRefreshToken(refreshToken);
    if (refreshPayload) {
      const newAccessToken = await this._createAccessToken(refreshPayload);
      return { payload: refreshPayload, newAccessToken };
    }

    return null;
  }
}

module.exports = new Auth();
