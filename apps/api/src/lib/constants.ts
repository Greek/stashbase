import { env } from './env';

const RAILWAY_URL = process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : '';

export const API_URL = RAILWAY_URL || env.API_URL;
export const ALLOWED_ORIGINS = env.CORS_ALLOWED_ORIGINS?.split(',');
export const MIN_PASSWORD_LENGTH = /.{8,}/;
export const MAX_PASSWORD_LENGTH = /.{128,}/;
export const SPECIAL_CHARACTERS = /[!@#$%^&*(),.?":{}|<>]/;
