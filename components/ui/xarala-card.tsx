"use client";

import { forwardRef } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
export interface XaralaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gradient" | "outline";
  interactive?: boolean;
  loading?: boolean;
  elevated?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const XaralaCard = forwardRef<HTMLDivElement, XaralaCardProps>(
  (
    {
      className,
      variant = "default",
      interactive = false,
      loading = false,
      elevated = false,
      header,
      footer,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "rounded-xl overflow-hidden transition-all";
    const variantStyles = {
      default: "bg-white",
      gradient: "bg-gradient-to-br from-primary to-primary-orange text-white",
      outline: "border-2 border-primary-orange bg-white",
    };
    const elevationStyles = elevated
      ? "shadow-lg hover:shadow-xl"
      : "shadow-sm hover:shadow-md";

    const CardComponent = interactive ? div : "div";
    const animationProps = interactive
      ? {
          whileHover: { y: -4 },
          transition: { duration: 0.2 },
        }
      : {};

    return (
      <CardComponent
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          elevationStyles,
          className
        )}
        {...animationProps}
        {...props}
      >
        {header && (
          <div className="px-6 py-4 border-b border-gray-200 animate-fade-in-up">{header}</div>
        )}
        <div className={cn("p-6", loading && "animate-pulse")}>{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 animate-fade-in-up">{footer}</div>
        )}
      </CardComponent>
    );
  }
);

XaralaCard.displayName = "XaralaCard";
