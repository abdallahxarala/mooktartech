'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useContentStore } from '@/lib/store/content-store'
import { Mail, Phone, MapPin, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const { contactInfo } = useContentStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Veuillez remplir au minimum nom, email et message.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, to: contactInfo.email }),
      })
      if (!res.ok) throw new Error('Erreur envoi')
      toast.success('Message envoyé ! Nous vous répondrons sous 2h.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      toast.error("Impossible d'envoyer le message. Réessayez plus tard.")
    } finally {
      setLoading(false)
    }
  }

  // Build embeddable map url if possible
  const mapEmbed = contactInfo.mapUrl?.includes('google')
    ? contactInfo.mapUrl.replace('maps.google.com', 'www.google.com/maps')
    : contactInfo.mapUrl

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="relative pt-28 pb-12 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl text-center mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">Contactez-nous</h1>
            <p className="text-white/90 text-lg md:text-xl">Nous répondons sous 2 heures ouvrées. Livraison rapide à Dakar et formation incluse.</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-8">
          {/* Infos */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Informations</h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <div className="font-bold">Téléphone</div>
                  <a href={`tel:${contactInfo.phone}`} className="hover:underline">{contactInfo.phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <div className="font-bold">Email</div>
                  <a href={`mailto:${contactInfo.email}`} className="hover:underline">{contactInfo.email}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <div className="font-bold">Adresse</div>
                  <div>{contactInfo.address}</div>
                  <div>{contactInfo.city}, {contactInfo.country} {contactInfo.postalCode}</div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="font-black text-gray-900 mb-2">Horaires</div>
                <div className="flex items-center gap-2 text-sm mb-1"><Clock className="w-4 h-4" /> {contactInfo.hours.weekdays}</div>
                <div className="flex items-center gap-2 text-sm mb-1"><Clock className="w-4 h-4" /> {contactInfo.hours.saturday}</div>
                <div className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4" /> {contactInfo.hours.sunday}</div>
              </div>
              <div className="pt-6 flex flex-wrap gap-3">
                <a href={`tel:${contactInfo.phone}`} className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition">Appeler</a>
                <a href={`mailto:${contactInfo.email}`} className="px-4 py-2 border-2 border-gray-200 rounded-xl font-bold hover:border-orange-500 hover:text-orange-600 transition">Écrire</a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Formulaire de contact</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Nom</label>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Sujet</label>
                <input name="subject" value={form.subject} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={6} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0" />
              </div>
              <div className="md:col-span-2 pt-2">
                <button disabled={loading} className="w-full md:w-auto inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-black rounded-2xl hover:from-orange-600 hover:to-pink-600 transition shadow-lg">
                  {loading ? (
                    <span>Envoi...</span>
                  ) : (
                    <>
                      <span>Envoyer le message</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-16">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100">
            {mapEmbed ? (
              <iframe
                src={mapEmbed}
                className="w-full h-[400px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="p-8 text-gray-600">Carte indisponible</div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}


