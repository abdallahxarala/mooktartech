'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CheckoutStepperProps {
  steps: string[]
  currentStep: number
}

export function CheckoutStepper({ steps, currentStep }: CheckoutStepperProps) {
  return (
    <div className="relative mb-8">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        <div className="mx-auto h-1 w-full max-w-3xl rounded-full bg-gradient-to-r from-orange-100 via-pink-100 to-orange-100" />
      </div>

      <div className="relative flex items-center justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1
          const isActive = currentStep === stepNumber
          const isCompleted = currentStep > stepNumber

          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-3 text-center">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0.6 }}
                  animate={{
                    scale: isActive ? 1.05 : isCompleted ? 1 : 0.9,
                    opacity: isCompleted || isActive ? 1 : 0.7
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-semibold shadow-sm transition-colors',
                    isActive
                      ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-pink-500 text-white'
                      : isCompleted
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-gray-200 bg-white text-gray-500'
                  )}
                >
                  {isCompleted ? '✓' : stepNumber}
                </motion.div>
                {isActive && (
                  <motion.span
                    layoutId="stepper-highlight"
                    className="absolute -inset-2 rounded-full bg-orange-100/60 blur-sm"
                    transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                  />
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-semibold uppercase tracking-wide',
                  isActive ? 'text-orange-600' : 'text-gray-400'
                )}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

