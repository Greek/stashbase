'use client';
import { Button } from '@api/components/ui/button';
import { authClient } from '@api/lib/auth-client';
import { useTRPC } from '@api/lib/trpc';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export default function LoginForm() {
  const router = useRouter();
  const session = authClient.useSession();

  const { app } = useTRPC();
  const getNameMutation = useMutation(
    app.helloWorld.getName.mutationOptions({
      onMutate() {
        protected_getNameMutation.reset();
      },
    }),
  );
  const protected_getNameMutation = useMutation(
    app.helloWorld.protected_getName.mutationOptions({
      onMutate() {
        getNameMutation.reset();
      },
    }),
  );

  const performSignOut = (e: FormEvent) => {
    e.preventDefault();
    authClient.signOut();

    getNameMutation.reset();
    protected_getNameMutation.reset();
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center text-center prose-xl min-h-screen">
        <h2>
          {session.data?.user
            ? `Hi ${session.data.user.name}!`
            : 'Hello user! You are not signed in.'}
        </h2>

        <div className="flex flex-col gap-y-2 w-2xs">
          <p>You can do the following:</p>

          {!session.data?.user && (
            <>
              <Button onClick={() => router.push('/auth/login')}>Login</Button>
              <Button onClick={() => router.push('/auth/signup')}>
                Sign up
              </Button>
              <Button onClick={() => getNameMutation.mutate('world')}>
                Get hello
              </Button>
              <Button onClick={() => protected_getNameMutation.mutate('world')}>
                (Protected) Get hello
              </Button>
            </>
          )}

          {session.data?.user && (
            <>
              <Button onClick={(e) => performSignOut(e)}>Sign out</Button>
              <Button onClick={() => getNameMutation.mutate('world')}>
                Get hello
              </Button>
              <Button onClick={() => protected_getNameMutation.mutate('world')}>
                (Protected) Get hello
              </Button>
            </>
          )}

          {getNameMutation.data && <p>{getNameMutation.data}</p>}
          {getNameMutation.error && <p>{getNameMutation.error.message}</p>}

          {protected_getNameMutation.data && (
            <p>{protected_getNameMutation.data}</p>
          )}
          {protected_getNameMutation.error && (
            <p>{protected_getNameMutation.error.message}</p>
          )}
        </div>
      </div>
    </>
  );
}
