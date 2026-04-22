import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui skeleton stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add skeleton
 * This stub exists so imports resolve during development.
 */
export interface skeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const skeleton = React.forwardRef<HTMLDivElement, skeletonProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
skeleton.displayName = 'skeleton';
export default skeleton;
