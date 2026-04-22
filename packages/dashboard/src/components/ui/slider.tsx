import React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui slider stub.
 * TODO: Generate the real component with: npx shadcn-ui@latest add slider
 * This stub exists so imports resolve during development.
 */
export interface sliderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const slider = React.forwardRef<HTMLDivElement, sliderProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
slider.displayName = 'slider';
export default slider;
