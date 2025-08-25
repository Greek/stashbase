'use client';

import { useTRPC } from '@/lib/trpc';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileEditDialog } from './file-edit-dialog';

export default function DragNDropUploadArea({
  space,
  refetchFiles,
  dialogOpen,
  setDialogOpen,
}: {
  space: string;
  refetchFiles: () => void;
  dialogOpen: boolean;
  setDialogOpen: (v: boolean) => void;
}) {
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);

  const { app: api } = useTRPC();
  const { mutate: uploadFile, data: uploadedFile } = useMutation(
    api.files.uploadFile.mutationOptions({
      onSuccess: () => {
        setDialogOpen(true);
        refetchFiles();
      },
    }),
  );

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const bytes = Array.from(new Uint8Array(await file.arrayBuffer()));
      uploadFile({
        filename: file.name,
        fileSize: file.size,
        fileType: file.type,
        spaceIdOrSlug: space,
        blob: bytes,
      });
      setFileBlob(file);
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
  } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: false,
  });

  return (
    <>
      {uploadedFile && (
        <FileEditDialog
          // TODO: omg fix
          data={uploadedFile.file as any}
          fileBlob={fileBlob}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        />
      )}

      <div className="w-full items-center">
        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white'
          }`}
          tabIndex={0}
          role="button"
          aria-label="File upload area"
          onClick={openFileDialog}
        >
          <input {...getInputProps()} />
          <span className="text-gray-500">
            Drag & drop a file here, or click to select
          </span>
        </div>
      </div>
    </>
  );
}
