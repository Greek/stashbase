'use client';

import { useSpace } from '@/hooks/use-space';

export default function DashboardPageRoot() {
  const space = useSpace();
  return <h1>{space?.name}</h1>;
}
