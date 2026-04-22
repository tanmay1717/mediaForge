import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui command stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add command
 * This stub exists so imports resolve during development.
 */
export interface commandProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const command = React.forwardRef<HTMLDivElement, commandProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
command.displayName = 'command';
export default command;
