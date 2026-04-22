'use client';
import React from 'react';

interface BreadcrumbsProps { path?: string; }

/**
 * TODO: Build breadcrumbs from folder path
 * - Split path by '/' into segments
 * - Each segment is a link to its folder
 * - Last segment is plain text (current location)
 * - Home icon for root
 */
export default function Breadcrumbs(props: BreadcrumbsProps) {
  return (
    <div data-component="Breadcrumbs">
      {/* TODO: Implement Breadcrumbs */}
    </div>
  );
}
