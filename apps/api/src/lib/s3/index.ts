import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { env } from '../env';

export const s3Client = new S3Client({ region: env.AWS_REGION });

export async function checkForStashbaseBucket() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: env.AWS_BUCKET_NAME }));
  } catch (error) {
    console.error(
      `Stashbase bucket "${env.AWS_BUCKET_NAME}" in region ${env.AWS_REGION} does not exist.  Please create it before starting the server.`,
    );
    process.exit(1);
  }
}
