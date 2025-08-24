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
import type { File } from '@api/types/file';
import { InputItem } from './input-item';

export const FileEditDialog = ({
  data,
  fileBlob,
  dialogOpen,
  setDialogOpen,
}: {
  data: File & { createdAt: string | null; updatedAt: string | null };
  fileBlob: any;
  dialogOpen: boolean;
  setDialogOpen: (val: boolean) => void;
}) => {
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
                {data.mimeType.startsWith('image/') ? (
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
  );
};
