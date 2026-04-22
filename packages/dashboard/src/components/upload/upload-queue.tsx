'use client';
import React from 'react';

interface UploadQueueProps { items: Array<{ file: File; status: string; progress: number; error?: string; }>; }

/**
 * TODO: Queue of files being uploaded
 * - Show UploadProgress for each item
 * - Summary at top: 'Uploading 3 of 5 files'
 * - Clear all button (when all done)
 */
export default function UploadQueue(props: UploadQueueProps) {
  return (
    <div data-component="UploadQueue">
      {/* TODO: Implement UploadQueue */}
    </div>
  );
}
