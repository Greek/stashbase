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
import { useSpace } from '@/hooks/use-space';
import { useTRPC } from '@/lib/trpc';
import type { File } from '@api/types/file';
import { useQuery } from '@tanstack/react-query';
import { InputItem } from './input-item';

export const FileEditDialog = ({
  data,
  dialogOpen,
  setDialogOpen,
}: {
  data: Omit<File, 'uploaderId' | 'spaceId' | 'id'> & {
    createdAt: string | Date | null;
    updatedAt: string | Date | null;
  };
  dialogOpen: boolean;
  setDialogOpen: (val: boolean) => void;
}) => {
  const space = useSpace();
  const trpc = useTRPC();
  const { data: fileBlob, isLoading: isBlobLoading } = useQuery(
    trpc.app.files.getBlob.queryOptions({
      fileId: data.slug,
      spaceIdOrSlug: space.space?.id as string,
    }),
  );

  return (
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
                  defaultValue={data.filename}
                  className="col-span-3"
                />
              </InputItem>
              <InputItem>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" defaultValue={data.slug} />
              </InputItem>
            </div>
            <InputItem>
              <Label htmlFor="preview">Preview</Label>
              <div className="col-span-3 flex h-24 w-full items-center justify-center rounded-md bg-gray-200">
                {fileBlob && data.mimeType.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(
                      fileBlob.data instanceof Blob
                        ? fileBlob.data
                        : new Blob([new Uint8Array(fileBlob.data)], {
                            type: data.mimeType,
                          }),
                    )}
                    alt="File preview"
                    className="max-h-full max-w-full"
                  />
                ) : isBlobLoading ? (
                  <p>Loading...</p>
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
  );
};
