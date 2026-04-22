'use client';
import React from 'react';

interface SearchInputProps { onSearch: (query: string) => void; placeholder?: string; }

/**
 * TODO: Debounced search input
 * - Use useDebounce(300ms) on input value
 * - Search icon (left), clear button (right, when has value)
 * - Cmd+K keyboard shortcut to focus
 * - Suggestions dropdown (future)
 */
export default function SearchInput(props: SearchInputProps) {
  return (
    <div data-component="SearchInput">
      {/* TODO: Implement SearchInput */}
    </div>
  );
}
