import {
  S3Client, PutObjectCommand, GetObjectCommand,
  DeleteObjectCommand, HeadObjectCommand, ListObjectsV2Command,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({});
const BUCKET = process.env.S3_BUCKET_NAME!;

/**
 * S3 operations for asset storage.
 *
 * TODO for each method — implement using the S3 SDK commands:
 * - upload: PutObject with Content-Type, return the S3 key
 * - download: GetObject, return the readable stream + content type
 * - delete: DeleteObject by key
 * - exists: HeadObject, return true/false (catch 404 as false)
 * - listByPrefix: ListObjectsV2 with Prefix, handle pagination
 * - copy: CopyObject for moving assets between folders
 * - deleteMany: Batch delete using DeleteObjects (max 1000 per call)
 * - generatePresignedUploadUrl: Pre-signed PUT URL for direct browser uploads
 * - generatePresignedDownloadUrl: Pre-signed GET URL for temporary access
 */
export class S3Service {
  async upload(key: string, body: Buffer, contentType: string): Promise<string> {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET, Key: key, Body: body, ContentType: contentType,
    }));
    return key;
  }

  async download(key: string): Promise<{ body: ReadableStream | null; contentType: string }> {
    const result = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    return {
      body: result.Body as unknown as ReadableStream | null,
      contentType: result.ContentType ?? 'application/octet-stream',
    };
  }

  async delete(key: string): Promise<void> {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  }

  async exists(key: string): Promise<boolean> {
    try {
      await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
      return true;
    } catch {
      return false;
    }
  }

  async listByPrefix(prefix: string): Promise<string[]> {
    // TODO: Handle pagination for large result sets
    const result = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET, Prefix: prefix,
    }));
    return (result.Contents ?? []).map((obj) => obj.Key!).filter(Boolean);
  }

  async generatePresignedUploadUrl(key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: BUCKET, Key: key, ContentType: contentType,
    });
    return getSignedUrl(s3, command, { expiresIn: 3600 });
  }

  async generatePresignedDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    return getSignedUrl(s3, command, { expiresIn: 3600 });
  }

  // TODO: Implement copy, deleteMany
}
