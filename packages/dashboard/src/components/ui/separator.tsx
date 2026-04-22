import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui separator stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add separator
 * This stub exists so imports resolve during development.
 */
export interface separatorProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const separator = React.forwardRef<HTMLDivElement, separatorProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
separator.displayName = 'separator';
export default separator;
