import { env } from '@/env';
import { createAuthClient, ErrorContext } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
  basePath: '/auth',
});

export const translateAuthErrorCode = (error: ErrorContext) => {
  switch (error.error.code) {
    case 'USER_ALREADY_EXISTS':
      return 'A user with that email address already exists.';
    case 'INVALID_EMAIL_OR_PASSWORD':
      return error.error.message;
    default:
      return error.error.message;
  }
};
