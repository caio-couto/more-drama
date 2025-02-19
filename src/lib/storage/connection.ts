import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

const clientConfig: S3ClientConfig = {
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!
  }
}

export const s3Client: S3Client = new S3Client(clientConfig);