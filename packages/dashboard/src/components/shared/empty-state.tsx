'use client';
import React from 'react';

interface EmptyStateProps { icon?: React.ReactNode; title: string; description?: string; action?: { label: string; onClick: () => void; }; }

/**
 * TODO: Friendly empty state with illustration and CTA
 * - Large centered icon/illustration
 * - Title + description text
 * - Optional action button
 */
export default function EmptyState(props: EmptyStateProps) {
  return (
    <div data-component="EmptyState">
      {/* TODO: Implement EmptyState */}
    </div>
  );
}
