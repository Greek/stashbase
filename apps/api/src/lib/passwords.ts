import { MIN_PASSWORD_LENGTH, SPECIAL_CHARACTERS } from './constants';

export const passwordValidation = {
  minLength: MIN_PASSWORD_LENGTH,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialChar: SPECIAL_CHARACTERS,
};

export const validatePassword = (password: string) => {
  return {
    minLength: passwordValidation.minLength.test(password),
    hasUppercase: passwordValidation.hasUppercase.test(password),
    hasLowercase: passwordValidation.hasLowercase.test(password),
    hasNumber: passwordValidation.hasNumber.test(password),
    hasSpecialChar: passwordValidation.hasSpecialChar.test(password),
  };
};
