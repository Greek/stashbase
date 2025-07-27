'use client';

import { SpaceProvider } from '@/components/providers/space-provider';
import { authClient } from '@/lib/auth-client';
import { useParams } from 'next/navigation';
import DashboardLayout from './_components/dashboard-layout';

export default function Layout(props: React.PropsWithChildren) {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const { spaceSlug }: { spaceSlug: string } = useParams();
  const isLoading = isSessionPending as boolean;

  return (
    session && (
      <SpaceProvider spaceSlug={spaceSlug}>
        <DashboardLayout
          {...props}
          user={session.user as NonNullable<typeof session>['user']}
          isLoading={isLoading}
        />
      </SpaceProvider>
    )
  );
}
