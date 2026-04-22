import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui toast stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add toast
 * This stub exists so imports resolve during development.
 */
export interface toastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const toast = React.forwardRef<HTMLDivElement, toastProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
toast.displayName = 'toast';
export default toast;
