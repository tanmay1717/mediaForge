import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui dialog stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add dialog
 * This stub exists so imports resolve during development.
 */
export interface dialogProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const dialog = React.forwardRef<HTMLDivElement, dialogProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
dialog.displayName = 'dialog';
export default dialog;
