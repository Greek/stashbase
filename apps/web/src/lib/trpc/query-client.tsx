'use client';

import { BACKEND_URL } from '@/lib/constants';
import type { AppRouter } from '@api/server';
import {
  defaultShouldDehydrateQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import superjson from 'superjson';
import { TRPCProvider } from '.';

let browserQueryClient: QueryClient | undefined = undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function TRPCProviders({ children }: { children: any }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/internal`,
          fetch(url, options) {
            return fetch(url, {
              ...(options as RequestInit),
              credentials: 'include',
            });
          },
        }),
      ],
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  return `${BACKEND_URL}`;
}
