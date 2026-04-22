'use client';
import React from 'react';

interface CreateKeyDialogProps { open: boolean; onClose: () => void; }

/**
 * TODO: Create API key dialog
 * - Label input
 * - On create: show the raw key in a copyable field
 * - WARNING: 'This key will not be shown again'
 * - Copy button + confirmation that user has saved it
 * - Use useCreateApiKey() mutation
 */
export default function CreateKeyDialog(props: CreateKeyDialogProps) {
  return (
    <div data-component="CreateKeyDialog">
      {/* TODO: Implement CreateKeyDialog */}
    </div>
  );
}
