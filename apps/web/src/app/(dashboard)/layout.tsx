'use client';

import { useSpace } from '@/hooks/use-space';
import { authClient } from '@/lib/auth-client';
import DashboardLayout from './_components/dashboard-layout';

export default function Layout(props: React.PropsWithChildren) {
  const { data: session, isPending } = authClient.useSession();
  const space = useSpace();

  if (!space) {
    return 'loading...';
  }

  return (
    session && (
      <DashboardLayout
        {...props}
        user={session?.user as NonNullable<typeof session>['user']}
        space={space}
        isLoading={isPending}
      />
    )
  );
}
