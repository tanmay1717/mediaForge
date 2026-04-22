/**
 * Video poster frame extractor.
 *
 * MediaForge does NOT do full video transcoding at the edge (too slow).
 * Instead, it extracts a single frame and transforms it as an image.
 *
 * TODO:
 * - Write the video buffer to /tmp/{uuid}.mp4
 * - Use ffmpeg (via Lambda layer) to extract a frame:
 *   ffmpeg -i /tmp/{uuid}.mp4 -ss 00:00:01 -frames:v 1 -f image2 /tmp/{uuid}.jpg
 * - Read the extracted frame back as a Buffer
 * - Pass the frame to imageTransformer for resize/format/quality
 * - Clean up /tmp files
 *
 * NOTE: Lambda@Edge has a 1MB response limit for origin-request triggers.
 * For video poster frames, this is usually fine (they're single JPEG frames).
 * If the frame exceeds 1MB, reduce quality or dimensions.
 */
export async function extractPosterFrame(
  _videoBuffer: Buffer,
  _timestamp: number = 1,
): Promise<Buffer> {
  // TODO: Implement ffmpeg frame extraction
  // Requires ffmpeg binary in a Lambda layer
  throw new Error('Video poster frame extraction not yet implemented');
}
