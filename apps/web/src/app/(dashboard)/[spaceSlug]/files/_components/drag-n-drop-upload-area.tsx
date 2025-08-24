'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTRPC } from '@/lib/trpc';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { InputItem } from './input-item';

export default function DragNDropUploadArea({
  space,
  refetchFiles,
}: {
  space: string;
  refetchFiles: () => void;
}) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);

  const { app: api } = useTRPC();
  const { mutate: uploadFile, data } = useMutation(
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New file</DialogTitle>
            <DialogDescription>
              You've uploaded a new file. Edit it's information here!
            </DialogDescription>
          </DialogHeader>
          {data && (
            <form className="flex flex-col gap-y-5">
              <div className="flex w-full justify-between gap-x-4">
                <InputItem>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    defaultValue={data.file.filename}
                    className="col-span-3"
                  />
                </InputItem>
                <InputItem>
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" defaultValue={data.file.slug} />
                </InputItem>
              </div>
              <InputItem>
                <Label htmlFor="preview">Preview</Label>
                <div className="col-span-3 flex h-24 w-full items-center justify-center rounded-md bg-gray-200">
                  {data.file.mimeType.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(fileBlob as Blob)}
                      alt="File preview"
                      className="max-h-full max-w-full"
                    />
                  ) : (
                    <span className="text-gray-500">No preview available</span>
                  )}
                </div>
              </InputItem>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

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
