/**
 * Composant de sélection de type de ticket
 */

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TICKET_TYPES, type TicketType } from '@/lib/types/ticket'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TicketSelectorProps {
  selectedType: TicketType | null
  onSelect: (type: TicketType) => void
}

export function TicketSelector({ selectedType, onSelect }: TicketSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.values(TICKET_TYPES).map((ticket) => (
        <Card
          key={ticket.type}
          className={cn(
            'cursor-pointer transition-all hover:shadow-lg border-2',
            selectedType === ticket.type
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-orange-300'
          )}
          onClick={() => onSelect(ticket.type)}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{ticket.icon}</span>
                <div>
                  <CardTitle className="text-xl">{ticket.name}</CardTitle>
                  <CardDescription className="mt-1">{ticket.description}</CardDescription>
                </div>
              </div>
              {selectedType === ticket.type && (
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">
                  {ticket.price.toLocaleString()}
                </span>
                <span className="text-lg text-gray-600">{ticket.currency}</span>
              </div>
              <ul className="space-y-2">
                {ticket.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={cn(
                  'w-full mt-4',
                  selectedType === ticket.type
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(ticket.type)
                }}
              >
                {selectedType === ticket.type ? 'Sélectionné' : 'Sélectionner'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

