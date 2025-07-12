import { customAlphabet } from 'nanoid';

export const nanoid = (size?: number) => {
  const fn = customAlphabet(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-',
    size ?? 16,
  );

  return fn();
};
