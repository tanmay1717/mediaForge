import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui progress stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add progress
 * This stub exists so imports resolve during development.
 */
export interface progressProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const progress = React.forwardRef<HTMLDivElement, progressProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
progress.displayName = 'progress';
export default progress;
