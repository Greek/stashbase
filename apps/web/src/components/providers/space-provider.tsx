'use client';

import { useTRPC } from '@/lib/trpc';
import type { Space } from '@api/types/space';
import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai/react';
import { atomWithStorage } from 'jotai/utils';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

// Store the space in localStorage so we don't have to call the API each time...
const spaceAtom = atomWithStorage<Space | undefined>('currentSpace', undefined);

export const SpaceContext = React.createContext<{
  space?: Space;
  isPending?: boolean;
}>({ space: undefined, isPending: undefined });

export const SpaceProvider = ({
  children,
  spaceSlug,
}: React.PropsWithChildren & { spaceSlug: string }) => {
  const [spaceFromAtom, setSpaceFromAtom] = useAtom(spaceAtom);
  const router = useRouter();

  // useEffect(() => {
  //   if (spaceFromAtom?.slug !== spaceSlug) {
  //     setSpaceFromAtom(undefined);
  //   }
  // }, [spaceSlug, spaceFromAtom, setSpaceFromAtom]);

  const spaceNotExist = spaceFromAtom === null || spaceFromAtom === undefined;
  const { app: api } = useTRPC();

  const { data: userSpaces, isPending: isUserSpacesPending } = useQuery(
    api.spaces.getUserSpaces.queryOptions(undefined, {
      enabled: spaceNotExist,
    }),
  );

  const {
    data: spaceDataFromApi,
    isPending: isFullSpacePending,
    error,
  } = useQuery(
    api.spaces.getFullSpace.queryOptions(
      { idOrSlug: spaceSlug },
      {
        enabled: spaceNotExist,
        retry: 0,
      },
    ),
  );

  useEffect(() => {
    if (error && userSpaces && userSpaces.length > 0) {
      const firstSpace = userSpaces[0];
      if (firstSpace) {
        router.push(`/${firstSpace.slug}/overview`);
      }
    }
  }, [error, userSpaces, router]);

  useEffect(() => {
    if (!spaceFromAtom && spaceDataFromApi) {
      setSpaceFromAtom(spaceDataFromApi as Space);
    }
  }, [spaceDataFromApi, spaceFromAtom, setSpaceFromAtom]);

  const isPending = isUserSpacesPending || isFullSpacePending;

  const value = React.useMemo(
    () => ({
      space: spaceFromAtom,
      isPending,
    }),
    [spaceFromAtom, isPending],
  );

  return (
    <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>
  );
};
