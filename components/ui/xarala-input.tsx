"use client";

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface XaralaInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const XaralaInput = forwardRef<HTMLInputElement, XaralaInputProps>(
  (
    {
      className,
      label,
      error,
      helper,
      leftIcon,
      rightIcon,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("space-y-2", fullWidth && "w-full")}>
        {label && (
          <Label
            htmlFor={props.id}
            className={cn(error && "text-red-500")}
          >
            {label}
          </Label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {leftIcon}
            </div>
          )}
          <Input
            ref={ref}
            className={cn(
              "transition-colors focus:border-primary-orange focus:ring-primary-orange/20",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              fullWidth && "w-full",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helper) && (
          <p
            className={cn(
              "text-sm",
              error ? "text-red-500 flex items-center gap-1" : "text-gray-500"
            )}
          >
            {error && <AlertCircle className="h-4 w-4" />}
            {error || helper}
          </p>
        )}
      </div>
    );
  }
);

XaralaInput.displayName = "XaralaInput";
