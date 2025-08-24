'use client';

import { useSidebar } from '@/components/ui/sidebar';
import { useSpace } from '@/hooks/use-space';
import { useEffect } from 'react';

export default function DashboardPageRoot() {
  const { space } = useSpace();
  const { setSidebarTitle } = useSidebar();

  useEffect(() => {
    setSidebarTitle('Overview');
  }, [setSidebarTitle]);

  return <h1>{space?.name}</h1>;
}
