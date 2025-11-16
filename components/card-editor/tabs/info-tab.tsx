'use client'

import React from 'react'
import { useCardEditorStore } from '@/lib/store/card-editor-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from './image-uploader'
import { Upload, User, Building, Mail, Phone, Globe, MapPin } from 'lucide-react'

export function InfoTab() {
  const { card, updateField, uploadImage } = useCardEditorStore()

  const handleImageUpload = async (type: 'photo' | 'logo', file: File) => {
    await uploadImage(type, file)
  }

  return (
    <div className="p-4 space-y-6">
      {/* Photo de profil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Photo de profil</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader
            currentImage={card.photo}
            onUpload={(file) => handleImageUpload('photo', file)}
            onRemove={() => updateField('photo', null)}
            type="photo"
          />
        </CardContent>
      </Card>

      {/* Informations personnelles */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                placeholder="Jean"
                value={card.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                placeholder="Dupont"
                value={card.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="title">Fonction / Titre</Label>
            <Input
              id="title"
              placeholder="Directeur Commercial"
              value={card.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Entreprise */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="w-5 h-5" />
            <span>Entreprise</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company">Nom de l'entreprise</Label>
            <Input
              id="company"
              placeholder="Xarala Solutions"
              value={card.company}
              onChange={(e) => updateField('company', e.target.value)}
            />
          </div>

          <div>
            <Label>Logo entreprise</Label>
            <ImageUploader
              currentImage={card.logo}
              onUpload={(file) => handleImageUpload('logo', file)}
              onRemove={() => updateField('logo', null)}
              type="logo"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@xarala.sn"
              value={card.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Téléphone</span>
            </Label>
            <Input
              id="phone"
              placeholder="+221 33 XXX XX XX"
              value={card.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="website" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Site web</span>
            </Label>
            <Input
              id="website"
              placeholder="https://xarala.sn"
              value={card.website}
              onChange={(e) => updateField('website', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="address" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Adresse</span>
            </Label>
            <Textarea
              id="address"
              placeholder="Dakar, Sénégal"
              value={card.address}
              onChange={(e) => updateField('address', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
