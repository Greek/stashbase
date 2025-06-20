import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { env } from '../env';

export const s3Client = new S3Client({
  endpoint:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:9000'
      : 'undefined',
  credentials:
    process.env.NODE_ENV === 'development'
      ? {
          accessKeyId: 'root',
          secretAccessKey: 'password',
        }
      : undefined,
  forcePathStyle: true,
});

export async function checkForStashbaseBucket() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: env.AWS_BUCKET_NAME }));
  } catch (error) {
    console.log(error);
    console.error(
      `Stashbase bucket "${env.AWS_BUCKET_NAME}" in region ${env.AWS_REGION} does not exist.  Please create it before starting the server.`,
    );
    process.exit(1);
  }
}
