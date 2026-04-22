import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui badge stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add badge
 * This stub exists so imports resolve during development.
 */
export interface badgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const badge = React.forwardRef<HTMLDivElement, badgeProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
badge.displayName = 'badge';
export default badge;
