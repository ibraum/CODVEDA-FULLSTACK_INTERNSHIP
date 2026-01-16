import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
};

export const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    // Bearer <token>
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    return jwt.verify(actualToken, SECRET_KEY);
  } catch (err) {
    return null;
  }
};
