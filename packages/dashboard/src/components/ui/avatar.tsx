import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui avatar stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add avatar
 * This stub exists so imports resolve during development.
 */
export interface avatarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const avatar = React.forwardRef<HTMLDivElement, avatarProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
avatar.displayName = 'avatar';
export default avatar;
