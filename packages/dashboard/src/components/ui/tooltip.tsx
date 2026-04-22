import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui tooltip stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add tooltip
 * This stub exists so imports resolve during development.
 */
export interface tooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const tooltip = React.forwardRef<HTMLDivElement, tooltipProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
tooltip.displayName = 'tooltip';
export default tooltip;
