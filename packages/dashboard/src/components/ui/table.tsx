import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui table stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add table
 * This stub exists so imports resolve during development.
 */
export interface tableProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const table = React.forwardRef<HTMLDivElement, tableProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
table.displayName = 'table';
export default table;
