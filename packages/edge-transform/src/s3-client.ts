import { S3Client, GetObjectCommand, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

/**
 * Lightweight S3 client for Lambda@Edge.
 * Only includes get, put, and head — no list, delete, or presign.
 * Reuses the client instance across warm invocations.
 *
 * NOTE: Lambda@Edge runs in the region closest to the viewer,
 * but the S3 bucket is in a fixed region. We pass the bucket region explicitly.
 */
const BUCKET = process.env.S3_BUCKET_NAME || '';
const REGION = process.env.S3_BUCKET_REGION || 'us-east-1';

const s3 = new S3Client({ region: REGION });

export async function getObject(key: string): Promise<Buffer> {
  const result = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  // TODO: Convert result.Body (ReadableStream) to Buffer
  const chunks: Uint8Array[] = [];
  const stream = result.Body as AsyncIterable<Uint8Array>;
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function putObject(key: string, body: Buffer, contentType: string): Promise<void> {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET, Key: key, Body: body, ContentType: contentType,
    CacheControl: 'public, max-age=2592000, immutable',
  }));
}

export async function objectExists(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}
