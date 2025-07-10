'use client';

import { Button } from '@api/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@api/components/ui/card';
import { Input } from '@api/components/ui/input';
import { Label } from '@api/components/ui/label';
import { authClient, translateAuthErrorCode } from '@api/lib/auth-client';
import { APP_NAME, MAX_PASSWORD_LENGTH } from '@api/lib/constants';
import { validatePassword } from '@api/lib/passwords';
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';

export default function SignupForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSignupLoading, setIsSignupLoading] = useState<boolean>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordChecks = validatePassword(form.password);
  // const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const isPasswordValid = true;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Validate password
    if (form.password.length > MAX_PASSWORD_LENGTH) {
      newErrors.password =
        'Password cannot be longer than <kbd>128</kbd> characters.';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (!isPasswordValid) {
      newErrors.password = 'Password does not meet requirements';
    }

    // Validate confirm password
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    // Form is valid, proceed with registration
    if (Object.keys(newErrors).length === 0) {
      await authClient.signUp.email(
        {
          name: form.name,
          email: form.email,
          password: form.password,
        },
        {
          onRequest(): void {
            setIsSignupLoading(true);
          },
          async onSuccess() {
            await authClient.signIn.email({
              email: form.email,
              password: form.password,
              callbackURL: '/',
            });
          },
          onError(ctx): void {
            setIsSignupLoading(false);
            setErrors({ signUpError: translateAuthErrorCode(ctx) });
          },
        },
      );
    }
  };

  const PasswordRequirement = ({
    met,
    text,
  }: {
    met: boolean;
    text: string;
  }) => (
    <div
      className={`flex items-center gap-2 text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}
    >
      {met ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Create a new account to access {APP_NAME}.
          </CardDescription>
        </CardHeader>
        <form onSubmit={submit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={onChange}
                className={errors.name ? 'border-red-500' : ''}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={onChange}
                className={errors.email ? 'border-red-500' : ''}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={onChange}
                className={errors.password ? 'border-red-500' : ''}
                required
              />
              {errors.password && (
                <p
                  className="text-sm text-red-500"
                  dangerouslySetInnerHTML={{ __html: errors.password }}
                />
              )}

              <div className="mt-2 p-3 bg-gray-50 rounded-md space-y-1">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Password Requirements:
                </p>
                <PasswordRequirement
                  met={passwordChecks.minLength}
                  text={`At least 8 characters`}
                />
                <PasswordRequirement
                  met={passwordChecks.hasUppercase}
                  text="One uppercase letter"
                />
                <PasswordRequirement
                  met={passwordChecks.hasLowercase}
                  text="One lowercase letter"
                />
                <PasswordRequirement
                  met={passwordChecks.hasNumber}
                  text="One number"
                />
                <PasswordRequirement
                  met={passwordChecks.hasSpecialChar}
                  text="One special character"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={onChange}
                className={errors.confirmPassword ? 'border-red-500' : ''}
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            {errors.signUpError && (
              <p
                className="text-sm text-red-500"
                dangerouslySetInnerHTML={{ __html: errors.signUpError }}
              />
            )}
            <span />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className={`w-full`}
              disabled={isSignupLoading}
            >
              Create Account
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link
                href={'/auth/login'}
                className="text-primary hover:underline"
              >
                Log In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
