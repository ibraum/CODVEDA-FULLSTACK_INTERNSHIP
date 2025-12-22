import Cookies from 'js-cookie';
import type { User } from '../types/User';

const TOKEN_KEY = 'auth_token';
const COOKIE_EXPIRES = 7; // 7 days

type JWTPayload = {
  id: number;
  email: string;
  role: string;
  user: User;
  exp: number;
  iat?: number;
} | null;


export const setToken = (token: string): void => {
  try {
    Cookies.set(TOKEN_KEY, token, {
      expires: COOKIE_EXPIRES,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      httpOnly: false,
    });
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const getToken = (): string | null => {
  try {
    return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = (): void => {
  try {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const parseJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

export const getUserFromToken = (): User | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = parseJWT(token);
    if (decoded && decoded.user) {
      return decoded.user as User;
    }
  } catch (error) {
    console.error('Error extracting user from token:', error);
    removeToken();
  }
  return null;
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = parseJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const validateToken = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  if (isTokenExpired(token)) {
    removeToken();
    return false;
  }
  
  return true;
};