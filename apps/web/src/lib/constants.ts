const VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : '';

export const BASE_URL =
  process.env.NEXT_PUBLIC_WEBAPP_URL || VERCEL_URL || 'http://localhost:3000';

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const APP_NAME = process.env.NEXT_PUBLIC_PRODUCT_NAME || 'Your Product';

export const WEBSITE_URL =
  process.env.NEXT_PUBLIC_WEBSITE_URL || BASE_URL || '';

export const SUPPORT_MAIL_ADDRESS =
  process.env.NEXT_PUBLIC_SUPPORT_MAIL_ADDRESS || '';

export const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || '';

export const SENDER_ID = process.env.NEXT_PUBLIC_SENDER_ID || '';

export const SENDER_NAME = process.env.NEXT_PUBLIC_SENDGRID_SENDER_NAME || '';

export const MIN_PASSWORD_LENGTH = /.{8,}/;
export const MAX_PASSWORD_LENGTH = 128;
export const SPECIAL_CHARACTERS = /[!@#$%^&*(),.?":{}|<>]/;
