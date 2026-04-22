import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui input stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add input
 * This stub exists so imports resolve during development.
 */
export interface inputProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const input = React.forwardRef<HTMLDivElement, inputProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
input.displayName = 'input';
export default input;
