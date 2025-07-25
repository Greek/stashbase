import { TUploadFileInput } from '@api/modules/files/files.types';

export type CreateFileMetadataInput = TUploadFileInput & {
  uploaderId: string;
};

export type DeleteFileInput = {
  slug: string;
};
