import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui checkbox stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add checkbox
 * This stub exists so imports resolve during development.
 */
export interface checkboxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const checkbox = React.forwardRef<HTMLDivElement, checkboxProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
checkbox.displayName = 'checkbox';
export default checkbox;
