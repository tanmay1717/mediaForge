import { useState } from 'react';
import api from '@/lib/api-client';

/** TODO: Upload state machine: idle → uploading → done/error
 * - Support multiple concurrent uploads
 * - Track progress per file using axios onUploadProgress
 * - Support cancel via AbortController
 * - After success, invalidate assets query
 */
export type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';
export interface UploadItem { file: File; status: UploadStatus; progress: number; error?: string; }

export function useUpload() {
  const [items, setItems] = useState<UploadItem[]>([]);

  const uploadFile = async (file: File, folderId: string) => {
    // TODO: Convert file to base64 or use presigned URL flow
    // TODO: Call POST /v1/upload with the file data
    // TODO: Update progress via onUploadProgress callback
    setItems(prev => [...prev, { file, status: 'uploading', progress: 0 }]);
  };

  const reset = () => setItems([]);
  return { items, uploadFile, reset };
}
