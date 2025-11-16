"use client";

import { forwardRef } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
export interface XaralaBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  icon?: React.ReactNode;
}

export const XaralaBadge = forwardRef<HTMLDivElement, XaralaBadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      animated = true,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "font-medium inline-flex items-center gap-1";
    const sizeStyles = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-sm",
      lg: "px-3 py-1.5 text-base",
    };
    const variantStyles = {
      default: "bg-primary-orange text-white",
      outline: "border-2 border-primary-orange text-primary-orange bg-transparent",
      success: "bg-green-500 text-white",
      warning: "bg-yellow-500 text-white",
      error: "bg-red-500 text-white",
    };

    const BadgeComponent = animated ? div : "div";
    const animationProps = animated
      ? {
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 0.2 },
        }
      : {};

    return (
      <BadgeComponent
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          "rounded-full",
          className
        )}
        {...animationProps}
        {...props}
      >
        {icon && <span className="h-3 w-3 animate-fade-in-up">{icon}</span>}
        {children}
      </BadgeComponent>
    );
  }
);

XaralaBadge.displayName = "XaralaBadge";
