'use client'

import { useState } from 'react'
import { useTranslations } from '@/lib/utils/next-intl-fallback'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Smartphone, Wallet, CreditCard } from 'lucide-react'
import type { PaymentProvider } from '@/lib/payments/types'

interface PaymentProviderSelectorProps {
  amount: number
  currency?: string
  onProviderSelect: (provider: PaymentProvider) => void
  selectedProvider?: PaymentProvider | null
  disabled?: boolean
}

const PROVIDERS: Array<{
  id: PaymentProvider
  name: string
  nameKey: string
  descriptionKey: string
  icon: React.ComponentType<{ className?: string }>
  available: boolean
}> = [
  {
    id: 'wave',
    name: 'Wave',
    nameKey: 'wave',
    descriptionKey: 'waveDescription',
    icon: Smartphone,
    available: true
  },
  {
    id: 'orange_money',
    name: 'Orange Money',
    nameKey: 'orangeMoney',
    descriptionKey: 'orangeMoneyDescription',
    icon: Wallet,
    available: false // TODO: Enable when implemented
  },
  {
    id: 'free_money',
    name: 'Free Money',
    nameKey: 'freeMoney',
    descriptionKey: 'freeMoneyDescription',
    icon: CreditCard,
    available: false // TODO: Enable when implemented
  }
]

export function PaymentProviderSelector({
  amount,
  currency = 'XOF',
  onProviderSelect,
  selectedProvider,
  disabled = false
}: PaymentProviderSelectorProps) {
  const t = useTranslations('checkout.payment')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSelect = async (provider: PaymentProvider) => {
    if (disabled || isProcessing) return

    const providerConfig = PROVIDERS.find((p) => p.id === provider)
    if (!providerConfig?.available) {
      return
    }

    setIsProcessing(true)
    try {
      onProviderSelect(provider)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">{t('selectMethod')}</h3>
        <p className="text-sm text-gray-600 mb-4">{t('selectMethodDescription')}</p>
      </div>

      <RadioGroup
        value={selectedProvider || undefined}
        onValueChange={(value) => handleSelect(value as PaymentProvider)}
        disabled={disabled || isProcessing}
        className="space-y-3"
      >
        {PROVIDERS.map((provider) => {
          const Icon = provider.icon
          const isSelected = selectedProvider === provider.id
          const isDisabled = disabled || isProcessing || !provider.available

          return (
            <Card
              key={provider.id}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'border-2 border-orange-500 bg-orange-50'
                  : 'border border-gray-200 hover:border-gray-300'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !isDisabled && handleSelect(provider.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <RadioGroupItem
                    value={provider.id}
                    id={provider.id}
                    disabled={isDisabled}
                    className="flex-shrink-0"
                  />
                  <Label
                    htmlFor={provider.id}
                    className="flex-1 cursor-pointer flex items-center space-x-3"
                  >
                    <Icon className="w-6 h-6 text-orange-500" />
                    <div className="flex-1">
                      <div className="font-medium">{t(provider.nameKey)}</div>
                      <div className="text-sm text-gray-600">
                        {t(provider.descriptionKey)}
                      </div>
                    </div>
                  </Label>
                  {isProcessing && isSelected && (
                    <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                  )}
                  {!provider.available && (
                    <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">
                      {t('comingSoon')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </RadioGroup>

      {selectedProvider && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            {t('selectedProvider', { provider: t(PROVIDERS.find((p) => p.id === selectedProvider)?.nameKey || '') })}
          </p>
        </div>
      )}
    </div>
  )
}

