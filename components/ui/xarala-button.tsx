"use client";

import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
export interface XaralaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  animated?: boolean;
}

export const XaralaButton = forwardRef<HTMLButtonElement, XaralaButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      fullWidth = false,
      animated = true,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "font-medium transition-all";
    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg",
    };
    const variantStyles = {
      primary: "bg-primary-orange hover:bg-primary-orange/90 text-white",
      secondary: "bg-primary hover:bg-primary/90 text-white",
      outline: "border-2 border-primary-orange text-primary-orange hover:bg-primary-orange/10",
      ghost: "text-primary-orange hover:bg-primary-orange/10",
    };

    const ButtonComponent = animated ? button : "button";
    const animationProps = animated
      ? {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          transition: { duration: 0.2 },
        }
      : {};

    return (
      <ButtonComponent
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && "w-full",
          "rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        disabled={loading || props.disabled}
        {...animationProps}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          icon && <span className="h-4 w-4 animate-fade-in-up">{icon}</span>
        )}
        {children}
      </ButtonComponent>
    );
  }
);

XaralaButton.displayName = "XaralaButton";
