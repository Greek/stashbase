export interface CreateFileMetadataInput {
  id: string;
  slug: string;
  s3Path: string;
  filename: string;
  uploaderId: string;
  spaceId: string;
}
