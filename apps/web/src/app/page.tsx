'use client';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useTRPC } from '@/lib/trpc';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export default function IndexPage() {
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
  const createSpaceMutation = useMutation(
    app.spaces.createSpace.mutationOptions(),
  );
  const getSpaceMutation = useQuery(
    app.spaces.getFullSpace.queryOptions({ idOrSlug: 'test-space' }),
  );

  const performSignOut = (e: FormEvent) => {
    e.preventDefault();
    authClient.signOut();

    getNameMutation.reset();
    protected_getNameMutation.reset();
  };

  return (
    <>
      <div className="prose-xl flex min-h-screen flex-col items-center justify-center text-center">
        <h2>
          {session.data?.user
            ? `Hi ${session.data.user.name}!`
            : 'Hello user! You are not signed in.'}{' '}
        </h2>

        <div className="flex w-2xs flex-col gap-y-2">
          <p>You can do the following:</p>

          {!session.data?.user && (
            <>
              <Button onClick={() => router.push('/auth/login')}>Login</Button>
              <Button onClick={() => router.push('/auth/signup')}>
                Sign up
              </Button>
            </>
          )}

          {session.data?.user && (
            <>
              <Button
                onClick={() =>
                  createSpaceMutation.mutate({
                    name: 'test space!!!$$$',
                  })
                }
              >
                Create Space
              </Button>
              <Button
                onClick={() =>
                  getSpaceMutation.mutate({
                    idOrSlug: 'test-space',
                  })
                }
              >
                Get Space
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
