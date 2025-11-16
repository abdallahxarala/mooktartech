"use client";

import { forwardRef } from "react";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

export interface XaralaAlertProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

export const XaralaAlert = forwardRef<HTMLDivElement, XaralaAlertProps>(
  (
    {
      className,
      variant = "info",
      title,
      dismissible = false,
      onDismiss,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      info: "bg-primary/10 border-primary text-primary",
      success: "bg-green-50 border-green-500 text-green-700",
      warning: "bg-yellow-50 border-yellow-500 text-yellow-700",
      error: "bg-red-50 border-red-500 text-red-700",
    };

    const variantIcons = {
      info: Info,
      success: CheckCircle,
      warning: AlertTriangle,
      error: AlertCircle,
    };

    const Icon = icon || variantIcons[variant];

    return (
      <Alert
          ref={ref}
          className={cn(
            "border-l-4 relative",
            variantStyles[variant],
            className
          )}
          {...props}
        >
          <div className="flex items-start gap-3 animate-fade-in-up">
            {Icon && <Icon className="h-5 w-5 mt-0.5 animate-fade-in-up" />}
            <div className="flex-1 animate-fade-in-up">
              {title && (
                <h5 className="font-medium mb-1 animate-fade-in-up">{title}</h5>
              )}
              <div className="text-sm animate-fade-in-up">{children}</div>
            </div>
            {dismissible && (
              <button
                onClick={onDismiss}
                className="text-gray-500 hover:text-gray-700 animate-fade-in-up"
              >
                <X className="h-4 w-4 animate-fade-in-up" />
              </button>
            )}
          </div>
        </Alert>
    );
  }
);

XaralaAlert.displayName = "XaralaAlert";
