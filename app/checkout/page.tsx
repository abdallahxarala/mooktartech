'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper'
import { CustomerForm } from '@/components/checkout/CustomerForm'
import { DeliveryOptions } from '@/components/checkout/DeliveryOptions'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { PaymentMethods } from '@/components/checkout/PaymentMethods'
import { PaymentProcessor } from '@/components/checkout/PaymentProcessor'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { checkoutFormSchema, CheckoutFormValues } from '@/lib/validations/checkout'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { useCartStore } from '@/lib/store/cart-store'

const steps = [
  'Informations client',
  'Livraison',
  'Récapitulatif',
  'Paiement'
]

const stepFields: Record<number, (keyof CheckoutFormValues)[]> = {
  1: ['firstName', 'lastName', 'email', 'phone', 'address', 'city'],
  2: ['deliveryMethod', 'deliveryAddress'],
  3: [],
  4: ['paymentMethod']
}

export default function CheckoutPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const locale = 'fr'

  const {
    customerInfo,
    deliveryMethod,
    deliveryAddress,
    paymentMethod,
    currentStep,
    setCustomerInfo,
    setDeliveryMethod,
    setDeliveryAddress,
    setPaymentMethod,
    setCurrentStep
  } = useCheckoutStore((state) => ({
    customerInfo: state.customerInfo,
    deliveryMethod: state.deliveryMethod,
    deliveryAddress: state.deliveryAddress,
    paymentMethod: state.paymentMethod,
    currentStep: state.currentStep,
    setCustomerInfo: state.setCustomerInfo,
    setDeliveryMethod: state.setDeliveryMethod,
    setDeliveryAddress: state.setDeliveryAddress,
    setPaymentMethod: state.setPaymentMethod,
    setCurrentStep: state.setCurrentStep
  }))

  const { items, subtotal, tax } = useCartStore((state) => ({
    items: state.items,
    subtotal: state.getSubtotal(),
    tax: state.getTaxAmount()
  }))

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName,
      email: customerInfo.email,
      phone: customerInfo.phone,
      address: customerInfo.address,
      city: customerInfo.city,
      notes: customerInfo.notes ?? '',
      deliveryMethod,
      deliveryAddress,
      paymentMethod
    }
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    form.reset({
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName,
      email: customerInfo.email,
      phone: customerInfo.phone,
      address: customerInfo.address,
      city: customerInfo.city,
      notes: customerInfo.notes ?? '',
      deliveryMethod,
      deliveryAddress,
      paymentMethod
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (!values) return
      setCustomerInfo({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        notes: values.notes
      })
      setDeliveryMethod(values.deliveryMethod)
      setDeliveryAddress(values.deliveryAddress ?? '')
      setPaymentMethod(values.paymentMethod)
    })

    return () => subscription.unsubscribe()
  }, [form, setCustomerInfo, setDeliveryMethod, setDeliveryAddress, setPaymentMethod])

  const deliveryMethodValue = form.watch('deliveryMethod')
  const deliveryAddressValue = form.watch('deliveryAddress')
  const customerSnapshot = {
    firstName: form.watch('firstName'),
    lastName: form.watch('lastName'),
    email: form.watch('email'),
    phone: form.watch('phone')
  }

  const shipping = useMemo(() => {
    if (deliveryMethodValue === 'pickup') return 0
    return subtotal >= 500000 ? 0 : 5000
  }, [deliveryMethodValue, subtotal])

  const total = useMemo(() => subtotal + tax + shipping, [subtotal, tax, shipping])

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  const handleNext = async () => {
    const fields = stepFields[currentStep] ?? []
    if (fields.length > 0) {
      const isValid = await form.trigger(fields as any, { shouldFocus: true })
      if (!isValid) return
    }

    setCurrentStep(Math.min(currentStep + 1, steps.length))
  }

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 1))
  }

  const onSubmit = async (values: CheckoutFormValues) => {
    setIsSubmitting(true)
    try {
      const payload = {
        customer: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          notes: values.notes
        },
        delivery: {
          method: values.deliveryMethod,
          address: values.deliveryMethod === 'delivery' ? values.deliveryAddress : null
        },
        payment: {
          method: values.paymentMethod
        },
        totals: {
          subtotal,
          tax,
          shipping,
          total
        },
        items
      }

      console.log('🧾 Checkout submission', payload)

      if (values.paymentMethod === 'cash') {
        toast.success('Commande confirmée - paiement à la livraison.')
      } else if (values.paymentMethod === 'bank_transfer') {
        toast.success('Nous vous envoyons les instructions de virement par email.')
      } else {
        toast.success('Commande prête à être confirmée !')
      }
    } catch (error) {
      console.error('Checkout submit error:', error)
      toast.error("Une erreur est survenue. Merci de réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-pink-500 pb-32 pt-24 text-white">
        <div className="absolute inset-0 opacity-20 mix-blend-soft-light">
          <div className="absolute -right-20 top-10 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -left-10 bottom-10 h-40 w-40 rounded-full bg-pink-400/30 blur-3xl" />
        </div>
        <div className="container relative mx-auto max-w-5xl px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/80">
            Finaliser la commande
          </p>
          <h1 className="text-4xl font-black sm:text-5xl">Checkout sécurisé</h1>
          <p className="mt-4 max-w-2xl text-white/90">
            Vérifiez vos informations et choisissez votre mode de paiement. Livraison express
            disponible sur Dakar, expédition rapide partout au Sénégal.
          </p>
        </div>
      </section>

      <div className="-mt-24">
        <div className="container mx-auto max-w-5xl px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
            >
              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
                <CheckoutStepper steps={steps} currentStep={currentStep} />
                <AnimatePresence mode="wait">
                  {currentStep === 1 && <CustomerForm key="step-1" form={form} />}
                  {currentStep === 2 && <DeliveryOptions key="step-2" form={form} />}
                  {currentStep === 3 && (
                    <OrderSummary
                      key="step-3"
                      items={items}
                      subtotal={subtotal}
                      tax={tax}
                      shipping={shipping}
                      total={total}
                      deliveryMethod={deliveryMethodValue}
                    />
                  )}
                  {currentStep === 4 && (
                    <motion.div key="step-4" className="space-y-6">
                      <PaymentMethods form={form} />
                      <PaymentProcessor
                        customer={customerSnapshot}
                        delivery={{
                          method: deliveryMethodValue,
                          address: deliveryMethodValue === 'delivery' ? deliveryAddressValue ?? '' : null
                        }}
                        totals={{
                          subtotal,
                          tax,
                          shipping,
                          total,
                          currency: 'XOF'
                        }}
                        locale={locale}
                        onCashSelected={() => form.handleSubmit(onSubmit)()}
                        onBankTransferSelected={() => form.handleSubmit(onSubmit)()}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900"
                    onClick={handlePrevious}
                    disabled={currentStep === 1 || isSubmitting}
                  >
                    Retour
                  </Button>

                  {currentStep < steps.length ? (
                    <Button
                      type="button"
                      className="bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:from-orange-600 hover:to-pink-600"
                      onClick={handleNext}
                    >
                      Continuer
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:from-orange-600 hover:to-pink-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Validation en cours...' : 'Confirmer la commande'}
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <OrderSummary
                  items={items}
                  subtotal={subtotal}
                  tax={tax}
                  shipping={shipping}
                  total={total}
                  deliveryMethod={deliveryMethodValue}
                />
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

