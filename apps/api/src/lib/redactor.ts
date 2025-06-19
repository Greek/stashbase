// Redact anything that matches an email.
export function redactEmail(message: string): string {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return message.replace(emailRegex, '[REDACTED EMAIL]');
}
