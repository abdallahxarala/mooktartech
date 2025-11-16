'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNFCEditorStore } from '@/lib/store/nfc-editor-store'
import { GamifiedProgress } from './gamified-progress'
import { CardPreview3D } from './card-preview-3d'
import { CardPreview } from './card-preview'
import { SocialLinksStep } from './social-links-step'
import { CustomFieldsStep } from './custom-fields-step'
import { ExportStep } from './export-step'
import { ImageUpload } from './image-upload'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft, ChevronRight, User, Mail, Phone, Globe, MapPin, Building, Palette } from 'lucide-react'

const steps = [
  { id: 1, label: 'Mode', icon: User },
  { id: 2, label: 'Informations', icon: Building },
  { id: 3, label: 'Contact', icon: Mail },
  { id: 4, label: 'Social', icon: Globe },
  { id: 5, label: 'Design', icon: User },
  { id: 6, label: 'Publication', icon: Globe },
]

export function NFCWizard() {
  const { 
    currentProfile, 
    wizardStep, 
    wizardProgress, 
    createProfile, 
    updateProfile, 
    nextWizardStep, 
    prevWizardStep 
  } = useNFCEditorStore()

  React.useEffect(() => {
    if (!currentProfile) {
      // Demander le mode au départ
    }
  }, [currentProfile])

  if (!currentProfile) {
    return <ModeSelector onCreate={createProfile} />
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <GamifiedProgress 
          progress={wizardProgress} 
          currentStep={wizardStep} 
          totalSteps={6} 
        />
      </div>

      {/* Split Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Wizard Form */}
        <div>
          <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900">
              Étape {wizardStep}/6 : {steps[wizardStep - 1]?.label}
            </h2>
            <div className="flex gap-2">
              {steps.map((step) => (
                <button
                  key={step.id}
                  className={`w-3 h-3 rounded-full transition-all ${
                    step.id === wizardStep
                      ? 'bg-orange-500 scale-125'
                      : step.id < wizardStep
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                  onClick={() => useNFCEditorStore.getState().setWizardStep(step.id)}
                />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            {wizardStep === 1 && <ModeStep profile={currentProfile} update={updateProfile} key="mode" />}
            {wizardStep === 2 && <BasicInfoStep profile={currentProfile} update={updateProfile} key="info" />}
            {wizardStep === 3 && <ContactStep profile={currentProfile} update={updateProfile} key="contact" />}
            {wizardStep === 4 && <SocialLinksStep profile={currentProfile} update={updateProfile} key="social" />}
            {wizardStep === 5 && (
              <div className="space-y-6">
                <DesignStep profile={currentProfile} update={updateProfile} />
                <div className="border-t pt-6">
                  <ImagesStep profile={currentProfile} update={updateProfile} />
                </div>
                <div className="border-t pt-6">
                  <CustomFieldsStep profile={currentProfile} />
                </div>
              </div>
            )}
            {wizardStep === 6 && <ExportStep profile={currentProfile} key="export" />}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevWizardStep}
              disabled={wizardStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>

            {wizardStep < 6 ? (
              <Button
                onClick={nextWizardStep}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90"
              >
                Suivant
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => useNFCEditorStore.getState().publishProfile()}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
              >
                Publier !
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
        </div>

        {/* Right: 3D Preview */}
        <div className="hidden lg:block">
          <Card className="sticky top-8">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">Aperçu en direct</h3>
                <div className="text-xs text-gray-500">3D</div>
              </div>
              <CardPreview3D profile={currentProfile} isAnimating={wizardStep > 2} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Mode Selector
function ModeSelector({ onCreate }: { onCreate: (mode: 'personal' | 'business') => void }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <motion.button
        onClick={() => onCreate('personal')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-8 rounded-2xl border-2 border-orange-500 bg-orange-50 hover:shadow-xl transition-shadow text-left"
      >
        <User className="w-16 h-16 text-orange-500 mb-4" />
        <h3 className="text-2xl font-black text-gray-900 mb-2">Personnel</h3>
        <p className="text-gray-600">Carte de visite digitale</p>
      </motion.button>

      <motion.button
        onClick={() => onCreate('business')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-8 rounded-2xl border-2 border-blue-500 bg-blue-50 hover:shadow-xl transition-shadow text-left"
      >
        <Building className="w-16 h-16 text-blue-500 mb-4" />
        <h3 className="text-2xl font-black text-gray-900 mb-2">Entreprise</h3>
        <p className="text-gray-600">Solutions professionnelles</p>
      </motion.button>
    </div>
  )
}

// Step 1: Mode (déjà géré dans ModeSelector)
function ModeStep({ profile, update }: any) {
  return <div className="py-8">Mode sélectionné : {profile.mode}</div>
}

// Step 2: Basic Info
function BasicInfoStep({ profile, update }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            value={profile.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            placeholder="Jean"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            value={profile.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            placeholder="Dupont"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="title">Titre / Poste *</Label>
        <Input
          id="title"
          value={profile.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Directeur Commercial"
        />
      </div>

      <div>
        <Label htmlFor="company">Entreprise *</Label>
        <Input
          id="company"
          value={profile.company}
          onChange={(e) => update({ company: e.target.value })}
          placeholder="Xarala Solutions"
        />
      </div>

      <div>
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          value={profile.tagline}
          onChange={(e) => update({ tagline: e.target.value })}
          placeholder="Innovation & Excellence"
        />
      </div>
    </motion.div>
  )
}

// Step 3: Contact
function ContactStep({ profile, update }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="email">Email *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="jean@xarala.sn"
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Téléphone *</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="phone"
            value={profile.phone}
            onChange={(e) => update({ phone: e.target.value })}
            placeholder="+221 77 123 45 67"
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="website">Site web</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="website"
            value={profile.website}
            onChange={(e) => update({ website: e.target.value })}
            placeholder="https://xarala.sn"
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Localisation</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="location"
            value={profile.location}
            onChange={(e) => update({ location: e.target.value })}
            placeholder="Dakar, Sénégal"
            className="pl-10"
          />
        </div>
      </div>
    </motion.div>
  )
}

// Step 4: Social - Using SocialLinksStep component

// Step 5: Design
function DesignStep({ profile, update }: any) {
  const themes = [
    { id: 'sunset', name: 'Sunset', colors: { primary: '#f97316', secondary: '#ec4899' } },
    { id: 'ocean', name: 'Ocean', colors: { primary: '#0ea5e9', secondary: '#06b6d4' } },
    { id: 'forest', name: 'Forest', colors: { primary: '#10b981', secondary: '#14b8a6' } },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-3 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => update({ 
              theme: theme.id as any, 
              primaryColor: theme.colors.primary,
              secondaryColor: theme.colors.secondary
            })}
            className={`p-6 rounded-xl border-2 transition-all ${
              profile.theme === theme.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
            }`}
          >
            <div 
              className="w-full h-20 rounded-lg mb-2"
              style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
            />
            <div className="font-bold text-gray-900">{theme.name}</div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// Step: Images
function ImagesStep({ profile, update }: any) {
  const TEMPLATES = [
    { id: 'classic', name: 'Classic', preview: 'from-orange-500 via-pink-500 to-purple-600', isPremium: false, description: 'Centré et élégant' },
    { id: 'minimalist', name: 'Minimalist', preview: 'from-blue-500 via-cyan-500 to-teal-500', isPremium: false, description: 'Épuré et moderne' },
    { id: 'corporate', name: 'Corporate', preview: 'from-gray-800 via-gray-900 to-black', isPremium: true, description: 'Professionnel avec sidebar' },
    { id: 'creative', name: 'Creative', preview: 'from-purple-600 via-pink-500 to-orange-500', isPremium: true, description: 'Coloré et audacieux' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Images Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            Images & Branding
          </h2>
          <p className="text-gray-600">
            Personnalisez l'apparence de votre carte avec vos images
          </p>
        </div>

        {/* Photo de profil */}
        <ImageUpload
          label="Photo de profil"
          value={profile.avatar}
          onChange={(url) => update({ avatar: url })}
          aspectRatio="circle"
          maxSize={2}
          helpText="Recommandé : 400x400px, visage centré"
          feature="avatar"
        />

        {/* Photo de couverture */}
        <ImageUpload
          label="Photo de couverture"
          value={profile.backgroundImage}
          onChange={(url) => update({ backgroundImage: url })}
          aspectRatio="wide"
          maxSize={3}
          helpText="Recommandé : 1200x400px, image horizontale"
          feature="background"
        />

        {/* Logo - Visible pour tous */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black text-gray-900">Logo / Marque</h3>
              <p className="text-sm text-gray-600">Votre logo ou celui de votre entreprise</p>
            </div>
            {profile.mode === 'business' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                Recommandé pour entreprises
              </span>
            )}
          </div>
          <ImageUpload
            label=""
            value={profile.logo}
            onChange={(url) => update({ logo: url })}
            aspectRatio="square"
            feature="logo"
            maxSize={2}
            helpText="Format PNG avec fond transparent recommandé • 200x200px minimum"
          />
        </div>
      </div>

      {/* Couleurs du thème */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-purple-600" />
          <h3 className="text-xl font-black text-gray-900">
            Style de mise en page
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {TEMPLATES.map((template) => (
            <motion.div 
              key={template.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => update({ template: template.id as any })}
                className={`w-full aspect-[9/16] rounded-xl bg-gradient-to-br ${template.preview} transition-all mb-2 relative overflow-hidden ${
                  profile.template === template.id
                    ? 'ring-4 ring-orange-500 ring-offset-2 scale-105 shadow-xl'
                    : 'opacity-50 hover:opacity-100 hover:scale-102'
                }`}
              >
                {/* Selected indicator */}
                {profile.template === template.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
              <div className="text-xs text-gray-600 text-center font-semibold">
                {template.name}
              </div>
              <div className="text-xs text-gray-500 text-center">
                {template.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Step 6: Publish
function PublishStep({ profile, update }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="slug">URL personnalisée</Label>
        <Input
          id="slug"
          value={profile.slug}
          onChange={(e) => update({ slug: e.target.value })}
          placeholder="jean-dupont"
        />
        <p className="text-sm text-gray-500 mt-1">
          https://xarala.sn/u/{profile.slug}
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold">Options</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={profile.enableQRCode}
            onChange={(e) => update({ enableQRCode: e.target.checked })}
          />
          <span>Activer QR Code</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={profile.enableAnalytics}
            onChange={(e) => update({ enableAnalytics: e.target.checked })}
          />
          <span>Analytics activés</span>
        </label>
      </div>
    </motion.div>
  )
}

