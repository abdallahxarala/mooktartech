'use client'

import { motion } from 'framer-motion'
import { CartItem } from '@/lib/store/cart-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  deliveryMethod: 'pickup' | 'delivery'
}

const formatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'XOF',
  maximumFractionDigits: 0
})

export function OrderSummary({
  items,
  subtotal,
  tax,
  shipping,
  total,
  deliveryMethod
}: OrderSummaryProps) {
  return (
    <motion.div
      key="order-summary"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Card className="border-2 border-orange-100/60 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-500/10 to-pink-500/10">
          <CardTitle className="text-xl font-black text-gray-900">Résumé de la commande</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Votre panier est vide. Ajoutez des produits pour continuer.
              </p>
            )}

            {items.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatter.format(item.price)} × {item.quantity}
                  </p>
                  {item.options?.nfcType && (
                    <p className="text-xs text-muted-foreground">
                      NFC : {item.options.nfcType}
                    </p>
                  )}
                  {item.options?.finish && (
                    <p className="text-xs text-muted-foreground">
                      Finition : {item.options.finish}
                    </p>
                  )}
                </div>
                <p className="font-semibold text-gray-900">
                  {formatter.format(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-dashed border-gray-200 pt-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span className="font-medium text-gray-900">{formatter.format(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>TVA (18%)</span>
              <span className="font-medium text-gray-900">{formatter.format(tax)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Livraison</span>
              <span className="font-medium text-gray-900">
                {shipping === 0
                  ? deliveryMethod === 'pickup'
                    ? 'Retrait gratuit'
                    : 'Livraison offerte'
                  : formatter.format(shipping)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-3 text-white">
            <span className="text-base font-semibold uppercase">Total à payer</span>
            <span className="text-2xl font-black">{formatter.format(total)}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

