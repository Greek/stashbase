'use client';

import { useTRPC } from '@/lib/trpc';
import type { Space } from '@api/types/space';
import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai/react';
import { atomWithStorage } from 'jotai/utils';
import React from 'react';

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

  if (spaceFromAtom && spaceSlug && spaceFromAtom.slug !== spaceSlug) {
    setSpaceFromAtom(undefined);
  }

  const { app: api } = useTRPC();
  const {
    data: spaceDataFromApi,
    isPending,
    error,
  } = useQuery(
    api.spaces.getFullSpace.queryOptions(
      { idOrSlug: spaceSlug },
      { enabled: spaceFromAtom === undefined },
    ),
  );

  // if (error) {
  //   // Default to first space we can find.
  //   if (error.data?.code === "NOT_FOUND") {

  //   }
  // }

  if (!spaceFromAtom && spaceDataFromApi) {
    setSpaceFromAtom(spaceDataFromApi as Space);
  }

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
