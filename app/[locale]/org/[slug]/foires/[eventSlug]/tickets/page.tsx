'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Check } from 'lucide-react'

interface TicketType {
  id: string
  type: string
  name: string
  description: string
  price: number
  currency: string
  features: string[]
  max_per_order?: number
}

export default function TicketsPage({
  params,
}: {
  params: { locale: string; slug: string; eventSlug: string }
}) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Types de billets (à terme depuis Supabase, pour l'instant hardcodé)
  const ticketTypes: TicketType[] = [
    {
      id: 'standard',
      type: 'standard',
      name: 'Billet Visiteur',
      description: 'Accès complet à tous les pavillons',
      price: 1000,
      currency: 'FCFA',
      features: [
        'Accès à tous les pavillons',
        'Catalogue digital inclus',
        'Entrée valable toute la journée',
        'Accès aux animations'
      ],
      max_per_order: 10
    },
    {
      id: 'vip',
      type: 'vip',
      name: 'Pass VIP',
      description: 'Accès VIP avec avantages exclusifs',
      price: 5000,
      currency: 'FCFA',
      features: [
        'Tous les avantages Visiteur',
        'Accès salon VIP',
        'Cocktail d\'ouverture',
        'Parking réservé',
        'Badge VIP personnalisé'
      ],
      max_per_order: 5
    },
    {
      id: 'group',
      type: 'group',
      name: 'Billet Groupe',
      description: 'Pour les groupes de 10 personnes minimum',
      price: 8000,
      currency: 'FCFA',
      features: [
        'Tarif groupe (min 10 pers)',
        'Guide accompagnateur',
        'Visite guidée des pavillons',
        'Espace pique-nique réservé'
      ],
      max_per_order: 50
    }
  ]

  const [quantities, setQuantities] = useState<Record<string, number>>(
    ticketTypes.reduce((acc, t) => ({ ...acc, [t.id]: 0 }), {})
  )

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
  })

  useEffect(() => {
    loadEvent()
  }, [params.eventSlug])

  async function loadEvent() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', params.eventSlug)
        .single()

      if (error) {
        console.error('Error loading event:', error)
      } else {
        setEvent(data)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    } finally {
      setLoading(false)
    }
  }

  function updateQuantity(ticketId: string, delta: number) {
    setQuantities((prev) => {
      const ticket = ticketTypes.find((t) => t.id === ticketId)
      const newQty = Math.max(0, Math.min((ticket?.max_per_order || 100), prev[ticketId] + delta))
      return { ...prev, [ticketId]: newQty }
    })
  }

  const totalTickets = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  const totalPrice = ticketTypes.reduce(
    (sum, ticket) => sum + ticket.price * quantities[ticket.id],
    0
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (totalTickets === 0) {
      alert('Veuillez sélectionner au moins un billet')
      return
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    setSubmitting(true)

    try {
      const createdTickets: Array<{ id: string; qrCode: string; ticketType: string }> = []

      // Créer les billets pour chaque type sélectionné
      for (const ticket of ticketTypes) {
        const qty = quantities[ticket.id]
        if (qty === 0) continue

        // Mapper le type de billet
        const ticketTypeMap: Record<string, string> = {
          standard: 'adulte',
          vip: 'vip',
          group: 'groupe',
        }
        const dbTicketType = ticketTypeMap[ticket.id] || 'adulte'

        // Créer une entrée dans la table tickets (une par type, avec quantité)
        const buyerName = `${formData.firstName} ${formData.lastName}`
        const unitPrice = ticket.price
        const totalPrice = unitPrice * qty

        // Générer les données QR
        const { buildTicketQRData, generateTicketQR } = await import('@/lib/services/tickets/qr-generator')
        const qrData = buildTicketQRData(
          '', // Sera rempli après création
          params.eventSlug,
          dbTicketType,
          qty,
          formData.email
        )

        // Créer le ticket dans la base
        const { data: createdTicket, error: ticketError } = await supabase
          .from('tickets')
          .insert({
            event_id: event.id,
            organization_id: event.organization_id,
            buyer_name: buyerName,
            buyer_email: formData.email,
            buyer_phone: formData.phone || null,
            ticket_type: dbTicketType,
            quantity: qty,
            unit_price: unitPrice,
            total_price: totalPrice,
            qr_code_data: JSON.stringify(qrData), // Temporaire, sera mis à jour avec l'ID
            payment_status: 'pending', // Sera mis à jour après paiement
            metadata: {
              company: formData.company || null,
              order_date: new Date().toISOString(),
            },
          })
          .select()
          .single()

        if (ticketError || !createdTicket) {
          console.error('Error creating ticket:', ticketError)
          throw new Error(`Erreur lors de la création du billet: ${ticketError?.message || 'Unknown error'}`)
        }

        // Mettre à jour les données QR avec l'ID réel
        const finalQrData = buildTicketQRData(
          createdTicket.id,
          params.eventSlug,
          dbTicketType,
          qty,
          formData.email
        )

        // Générer l'image QR code
        const qrCodeImage = await generateTicketQR(finalQrData)

        // Mettre à jour le ticket avec les données QR finales
        const { error: updateError } = await supabase
          .from('tickets')
          .update({
            qr_code_data: JSON.stringify(finalQrData),
            qr_code_image_url: qrCodeImage, // Stocker l'image base64
          })
          .eq('id', createdTicket.id)

        if (updateError) {
          console.warn('Warning: Failed to update QR code data:', updateError)
        }

        createdTickets.push({
          id: createdTicket.id,
          qrCode: qrCodeImage,
          ticketType: dbTicketType,
        })

        // Créer aussi les event_attendees pour compatibilité (un par billet individuel)
        for (let i = 0; i < qty; i++) {
          const badgeId = `BADGE-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`

          await supabase.from('event_attendees').insert({
            event_id: event.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone || null,
            company: formData.company || null,
            badge_id: badgeId,
            access_level: ticket.type === 'vip' ? 'vip' : 'attendee',
            metadata: {
              ticket_id: createdTicket.id,
              ticket_type: ticket.type,
              ticket_price: ticket.price,
              order_date: new Date().toISOString(),
            },
          })
        }
      }

      // Envoyer email avec QR codes (en arrière-plan, non bloquant)
      try {
        const { sendTicketsEmail } = await import('@/lib/services/email/templates')
        await sendTicketsEmail({
          to: formData.email,
          buyerName: `${formData.firstName} ${formData.lastName}`,
          eventName: event.name || 'Foire Dakar 2025',
          tickets: createdTickets.map((t) => ({
            id: t.id,
            type: t.ticketType,
            qrCode: t.qrCode,
          })),
          eventSlug: params.eventSlug,
        })
        console.log('✅ Email avec QR codes envoyé')
      } catch (emailError) {
        console.warn('⚠️ Erreur envoi email (non bloquant):', emailError)
      }

      // Redirection vers page de succès avec les IDs des tickets
      const ticketIds = createdTickets.map((t) => t.id).join(',')
      router.push(
        `/${params.locale}/org/${params.slug}/foires/${params.eventSlug}/tickets/success?email=${encodeURIComponent(formData.email)}&tickets=${encodeURIComponent(ticketIds)}`
      )
    } catch (error) {
      console.error('Error creating tickets:', error)
      alert(`Erreur lors de la création des billets: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Billetterie</h1>
          <p className="text-xl">{event?.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* TYPES DE BILLETS */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold mb-6">Choisissez vos billets</h2>

                {ticketTypes.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{ticket.name}</h3>
                        <p className="text-gray-600 mb-4">{ticket.description}</p>

                        <ul className="space-y-2 mb-4">
                          {ticket.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="text-2xl font-bold text-purple-600">
                          {new Intl.NumberFormat('fr-FR').format(ticket.price)} {ticket.currency}
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => updateQuantity(ticket.id, -1)}
                            disabled={quantities[ticket.id] === 0}
                            className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition"
                          >
                            <Minus className="h-5 w-5" />
                          </button>
                          <span className="text-2xl font-bold w-12 text-center">
                            {quantities[ticket.id]}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(ticket.id, 1)}
                            disabled={quantities[ticket.id] >= (ticket.max_per_order || 100)}
                            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition"
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        </div>
                        {quantities[ticket.id] > 0 && (
                          <div className="text-sm text-gray-600">
                            Sous-total: {new Intl.NumberFormat('fr-FR').format(ticket.price * quantities[ticket.id])} FCFA
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* FORMULAIRE */}
                {totalTickets > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6">Vos informations</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Prénom <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Nom <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Téléphone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">Entreprise (optionnel)</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RÉCAPITULATIF */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                  <h2 className="text-2xl font-bold mb-6">Récapitulatif</h2>

                  {totalTickets === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Sélectionnez vos billets
                    </p>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6">
                        {ticketTypes.map((ticket) => {
                          const qty = quantities[ticket.id]
                          if (qty === 0) return null

                          return (
                            <div key={ticket.id} className="flex justify-between text-sm">
                              <span>
                                {ticket.name} × {qty}
                              </span>
                              <span className="font-semibold">
                                {new Intl.NumberFormat('fr-FR').format(ticket.price * qty)} FCFA
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      <div className="border-t pt-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold">Total</span>
                          <span className="text-2xl font-bold text-purple-600">
                            {new Intl.NumberFormat('fr-FR').format(totalPrice)} FCFA
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {totalTickets} billet{totalTickets > 1 ? 's' : ''}
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition"
                      >
                        {submitting ? 'Traitement...' : 'Procéder au paiement'}
                      </button>

                      <p className="text-xs text-gray-500 text-center mt-4">
                        Paiement sécurisé • Billets envoyés par email
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

