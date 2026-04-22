import React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const SwitchToggle = React.forwardRef<HTMLDivElement, SwitchProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
SwitchToggle.displayName = 'SwitchToggle';
export { SwitchToggle as Switch };
export default SwitchToggle;
