import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    config.jwt.secret,
    { expiresIn: config.jwt.expire }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpire }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
};

export const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};