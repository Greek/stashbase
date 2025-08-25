import { TUploadFileInput } from '@api/modules/files/dto/upload-file.dto';

export type CreateFileMetadataInput = TUploadFileInput & {
  uploaderId: string;
};

export type DeleteFileInput = {
  slug: string;
};
