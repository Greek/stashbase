import { APIError } from 'better-auth/api';
import { passwordValidation, validatePassword } from '../passwords';

export const validateSignupHook = (password: string) => {
  const validationReq = validatePassword(password);

  if (!validationReq.minLength) {
    throw new APIError('BAD_REQUEST', {
      code: 'PASSWORD_REQUIRES_AT_LEAST_EIGHT_CHARS',
      message: 'Password must be at least <kbd>8</kbd> characters long.',
    });
  }

  if (!validationReq.hasUppercase || !validationReq.hasLowercase) {
    throw new APIError('BAD_REQUEST', {
      code: 'PASSWORD_REQUIRES_ONE_LOWER_ONE_UPPER',
      message: 'Password must have one lowercase and one uppercase letter',
    });
  }

  if (!validationReq.hasNumber) {
    throw new APIError('BAD_REQUEST', {
      code: 'PASSWORD_REQUIRES_ONE_NUMBER',
      message: 'Password must have at least one number.',
    });
  }

  if (!validationReq.hasSpecialChar) {
    throw new APIError('BAD_REQUEST', {
      code: 'PASSWORD_REQUIRES_ONE_SPECIAL_CHARACTER',
      message: `Password must have at least one of the following characters: <kbd>${passwordValidation.hasSpecialChar.source}</kbd>`,
    });
  }
};
