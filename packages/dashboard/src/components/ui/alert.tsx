import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui alert stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add alert
 * This stub exists so imports resolve during development.
 */
export interface alertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const alert = React.forwardRef<HTMLDivElement, alertProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
alert.displayName = 'alert';
export default alert;
