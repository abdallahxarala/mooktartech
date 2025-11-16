'use client'

import React, { useState } from 'react'
import { useNFCEditorStore } from '@/lib/store/nfc-editor-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, User, Building, Phone, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface LeadCaptureFormProps {
  profileId: string
  onSuccess?: () => void
}

export function LeadCaptureForm({ profileId, onSuccess }: LeadCaptureFormProps) {
  const { addLead } = useNFCEditorStore()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Add lead to store
    addLead({
      profileId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      notes: formData.notes,
      source: 'nfc' as const
    })

    setSubmitted(true)
    
    if (onSuccess) {
      onSuccess()
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">
          Merci !
        </h3>
        <p className="text-gray-600">
          Vos informations ont été enregistrées
        </p>
      </motion.div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajoutez-moi à vos contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="lead-name">Nom complet *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="lead-name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Votre nom"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lead-email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="lead-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="votre@email.com"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lead-phone">Téléphone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="lead-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+221 77 123 45 67"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lead-company">Entreprise</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="lead-company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Votre entreprise"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lead-notes">Message (optionnel)</Label>
            <Textarea
              id="lead-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ajoutez un message..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white"
          >
            Enregistrer
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

