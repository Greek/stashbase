import { customAlphabet } from 'nanoid';

export const nanoid = (size: number) =>
  customAlphabet(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-',
    size ?? 16,
  );
