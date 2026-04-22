import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui button stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add button
 * This stub exists so imports resolve during development.
 */
export interface buttonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const button = React.forwardRef<HTMLDivElement, buttonProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
button.displayName = 'button';
export default button;
