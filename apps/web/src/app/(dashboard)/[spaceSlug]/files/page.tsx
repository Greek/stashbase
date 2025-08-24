'use client';

import { useSidebar } from '@/components/ui/sidebar';

import { useSpace } from '@/hooks/use-space';
import { useTRPC } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import DragNDropUploadArea from './_components/drag-n-drop-upload-area';
import FilesList from './_components/files-list';

export default function FilesPage() {
  const trpc = useTRPC();
  const { space, isPending } = useSpace();
  const { setSidebarTitle } = useSidebar();

  const { data: files, refetch } = useQuery({
    ...trpc.app.files.getFiles.queryOptions(
      { spaceIdOrSlug: space?.id || '' },
      { enabled: !!space },
    ),
    select: (data) =>
      data.map((file) => ({
        ...file,
        createdAt: new Date(file.createdAt as string),
        updatedAt: new Date(file.updatedAt as string),
      })),
  });

  useEffect(() => {
    setSidebarTitle('Files');
  }, [setSidebarTitle]);

  if (isPending && !space) {
    return <p>loading</p>;
  }

  return (
    <>
      <DragNDropUploadArea
        space={space ? space.slug : ''}
        refetchFiles={refetch}
      />

      {files && files.length > 0 ? (
        <div className="mt-6">
          <FilesList files={files} />
        </div>
      ) : (
        <div className="text-muted-foreground mt-6 text-center">
          <p>
            No files uploaded yet. Drag and drop files above to get started.
          </p>
        </div>
      )}
    </>
  );
}
