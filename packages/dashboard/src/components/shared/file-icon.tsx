'use client';
import React from 'react';

interface FileIconProps { mimeType: string; size?: number; }

/**
 * TODO: File type icon
 * - Map MIME type to icon: image→ImageIcon, video→VideoIcon, pdf→FileTextIcon, etc.
 * - Use lucide-react icons
 * - Color coded by type
 */
export default function FileIcon(props: FileIconProps) {
  return (
    <div data-component="FileIcon">
      {/* TODO: Implement FileIcon */}
    </div>
  );
}
