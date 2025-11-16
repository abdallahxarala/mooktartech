'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ScrollAreaProps
  extends React.HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, viewportClassName, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        {...props}
      >
        <div
          className={cn(
            'h-full w-full overflow-auto scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent',
            viewportClassName
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';
