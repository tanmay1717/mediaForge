import React from 'react';
import { cn } from '@/lib/utils';

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
}

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
DropdownMenu.displayName = 'DropdownMenu';
export default DropdownMenu;
