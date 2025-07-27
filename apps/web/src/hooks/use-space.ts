import { SpaceContext } from '@/components/providers/space-provider';
import React from 'react';

export const useSpace = () => {
  const { space, isPending } = React.useContext(SpaceContext);

  if (isPending === undefined && !space) {
    throw new Error('SpaceProvider must be present when using useSpace');
  }

  return { space, isPending };
};
