import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from './constants';

export const passwordValidation = {
  minLength: MIN_PASSWORD_LENGTH,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

export const validatePassword = (password: string) => {
  return {
    minLength: passwordValidation.minLength.test(password),
    maxLength: password.length < MAX_PASSWORD_LENGTH,
    hasUppercase: passwordValidation.hasUppercase.test(password),
    hasLowercase: passwordValidation.hasLowercase.test(password),
    hasNumber: passwordValidation.hasNumber.test(password),
    hasSpecialChar: passwordValidation.hasSpecialChar.test(password),
  };
};
