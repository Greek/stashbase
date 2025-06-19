'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { authClient, translateAuthErrorCode } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await authClient.signIn.email(
      {
        email: form.email,
        password: form.password,
        callbackURL: '/',
      },
      {
        onRequest(): void {
          setIsLoginLoading(true);
        },
        onSuccess(): void {
          setErrors({});
          setTimeout(() => {
            router.push('/');
          }, 2000);
        },
        onError(ctx): void {
          setIsLoginLoading(false);
          setErrors({ loginError: translateAuthErrorCode(ctx) });
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Log In
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access {APP_NAME}.
          </CardDescription>
        </CardHeader>
        <form onSubmit={submit}>
          <CardContent className="space-y-4">
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={onChange}
                className={errors.email ? 'border-red-500' : ''}
                required
              />
              {errors.loginError && (
                <p className="text-sm text-red-500">{errors.loginError}</p>
              )}
            </div>
            <span />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" disabled={isLoginLoading}>
              Sign in
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-primary hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
