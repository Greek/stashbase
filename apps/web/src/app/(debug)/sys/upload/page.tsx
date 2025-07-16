'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTRPC } from '@/lib/trpc';
import { useMutation } from '@tanstack/react-query';
import { FormEvent } from 'react';

export default function DebugUploadPage() {
  const { app: api } = useTRPC();
  const { mutate: uploadFile, isPending } = useMutation(
    api.files.uploadFile.mutationOptions(),
  );

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem(
      'picture',
    ) as HTMLInputElement | null;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log('File info:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      });

      uploadFile({
        filename: file.name,
        fileSize: file.size,
        fileType: file.type,
        spaceIdOrSlug: 'test-space',
        blob: Array.from(new Uint8Array(await file.arrayBuffer())),
      });
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div className="w-full max-w-sm items-center p-4">
      <form className="grid gap-3" onSubmit={handleOnSubmit}>
        <Label htmlFor="picture">Picture</Label>
        <Input id="picture" type="file" />
        <Button>Upload</Button>
      </form>
    </div>
  );
}
