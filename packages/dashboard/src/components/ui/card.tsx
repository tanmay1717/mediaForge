import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui card stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add card
 * This stub exists so imports resolve during development.
 */
export interface cardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const card = React.forwardRef<HTMLDivElement, cardProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
card.displayName = 'card';
export default card;
