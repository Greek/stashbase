'use client';

import { SpaceProvider } from '@/components/providers/space-provider';
import { TRPCProviders } from '@/lib/trpc/query-client';
import { useParams } from 'next/navigation';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { spaceSlug }: { spaceSlug: string } = useParams();

  return (
    <html lang="en">
      <body>
        <TRPCProviders>
          <SpaceProvider spaceSlug={spaceSlug}>{children}</SpaceProvider>
        </TRPCProviders>
      </body>
    </html>
  );
}
