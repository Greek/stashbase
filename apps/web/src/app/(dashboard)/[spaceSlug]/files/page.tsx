'use client';

import { useSidebar } from '@/components/ui/sidebar';
import { useSpace } from '@/hooks/use-space';
import { useEffect } from 'react';
import DragNDropUploadArea from './_components/drag-n-drop-upload-area';

export default function FilesPage() {
  const { space, isPending } = useSpace();
  const { setSidebarTitle } = useSidebar();

  useEffect(() => {
    setSidebarTitle('Files');
  }, [setSidebarTitle]);

  if (isPending && !space) {
    return <p>loading</p>;
  }
  return (
    <>
      <DragNDropUploadArea space={space ? space.slug : ''} />
    </>
  );
}
