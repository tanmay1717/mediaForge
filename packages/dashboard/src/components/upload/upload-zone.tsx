'use client';
import React from 'react';

interface UploadZoneProps { folderId?: string; onUpload?: (files: File[]) => void; }

/**
 * TODO: Drag-and-drop file upload zone
 * - Large dashed border area
 * - Drag over: highlight border, show 'Drop files here'
 * - Click: open native file picker (accept: ALLOWED_MIME_TYPES)
 * - Multiple files supported
 * - Validate each file (type, size) before starting upload
 * - Show rejection reasons for invalid files
 */
export default function UploadZone(props: UploadZoneProps) {
  return (
    <div data-component="UploadZone">
      {/* TODO: Implement UploadZone */}
    </div>
  );
}
