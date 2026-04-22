'use client';
import React from 'react';

interface UploadFromUrlProps { folderId?: string; onUpload?: (url: string) => void; }

/**
 * TODO: URL input for remote file upload
 * - URL input with paste detection
 * - Fetch preview (show filename, estimated size)
 * - Upload button with loading state
 */
export default function UploadFromUrl(props: UploadFromUrlProps) {
  return (
    <div data-component="UploadFromUrl">
      {/* TODO: Implement UploadFromUrl */}
    </div>
  );
}
