"use client";

import { CheckoutStep } from "@/app/checkout/page";
interface Step {
  id: CheckoutStep;
  label: string;
}

interface CheckoutProgressProps {
  steps: Step[];
  currentStep: CheckoutStep;
}

export function CheckoutProgress({ steps, currentStep }: CheckoutProgressProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="relative animate-fade-in-up">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 animate-fade-in-up" />
        
        <div className="relative flex justify-between animate-fade-in-up">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = step.id === currentStep;
            
            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative animate-fade-in-up"
              >
                <div
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white relative z-10 animate-fade-in-up"
                >
                  <span
                    className={`text-sm font-medium ${
                      isCompleted || isCurrent ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
                <span
                  className={`mt-2 text-sm ${
                    isCurrent ? "text-primary-orange font-medium" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
