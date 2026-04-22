import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui tabs stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add tabs
 * This stub exists so imports resolve during development.
 */
export interface tabsProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const tabs = React.forwardRef<HTMLDivElement, tabsProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
tabs.displayName = 'tabs';
export default tabs;
