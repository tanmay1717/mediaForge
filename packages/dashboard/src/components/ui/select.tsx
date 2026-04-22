import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui select stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add select
 * This stub exists so imports resolve during development.
 */
export interface selectProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const select = React.forwardRef<HTMLDivElement, selectProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
select.displayName = 'select';
export default select;
