'use client';
import React from 'react';

interface UploadProgressProps { fileName: string; progress: number; status: 'uploading' | 'done' | 'error'; error?: string; onCancel?: () => void; }

/**
 * TODO: Per-file upload progress bar
 * - File icon + name
 * - Progress bar (0-100%)
 * - Status: uploading (blue), done (green check), error (red x)
 * - Cancel button during upload
 * - Error message display
 */
export default function UploadProgress(props: UploadProgressProps) {
  return (
    <div data-component="UploadProgress">
      {/* TODO: Implement UploadProgress */}
    </div>
  );
}
