'use client';

import { useSpace } from '@/hooks/use-space';
import DragNDropUploadArea from './_components/drag-n-drop-upload-area';

export default function FilesPage() {
  const { space, isPending } = useSpace();

  if (isPending && !space) {
    return <p>loading</p>;
  }
  return (
    <>
      <DragNDropUploadArea space={space ? space.slug : ''} />
    </>
  );
}
