"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface Step {
  id: string;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: string;
  onStepClick?: (stepId: string) => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className,
}: StepperProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className={cn("relative", className)}>
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 animate-fade-in-up" />
      
      <div className="relative flex justify-between animate-fade-in-up">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = step.id === currentStep;
          
          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative animate-fade-in-up"
              onClick={() => onStepClick?.(step.id)}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white relative z-10",
                  onStepClick && "cursor-pointer"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 text-white animate-fade-in-up" />
                ) : (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isCompleted || isCurrent ? "text-white" : "text-gray-500"
                    )}
                  >
                    {index + 1}
                  </span>
                )}
              </div>

              <div className="mt-2 text-center animate-fade-in-up">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-primary-orange" : "text-gray-500"
                  )}
                >
                  {step.title}
                </span>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1 animate-fade-in-up">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
