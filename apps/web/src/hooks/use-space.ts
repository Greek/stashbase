import { SpaceContext } from '@/components/providers/space-provider';
import React from 'react';

export const useSpace = () => {
  const { space, isPending } = React.useContext(SpaceContext);
  if (!space && !isPending) {
    throw new Error('useSpace must be used within a SpaceProvider.');
  }

  return space;
};
