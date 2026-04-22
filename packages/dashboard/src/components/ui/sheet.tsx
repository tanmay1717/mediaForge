import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui sheet stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add sheet
 * This stub exists so imports resolve during development.
 */
export interface sheetProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const sheet = React.forwardRef<HTMLDivElement, sheetProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
sheet.displayName = 'sheet';
export default sheet;
