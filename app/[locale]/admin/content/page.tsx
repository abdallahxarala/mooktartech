'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Plus,
  Edit2,
  Trash2,
  Info,
  Users,
  Award,
  BarChart3,
  Clock,
  Shield,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import { useContentStore } from '@/lib/store/content-store'
import toast from 'react-hot-toast'

type Section = 'about' | 'team' | 'values' | 'stats' | 'timeline' | 'certifications' | 'contact'

export default function ContentManagementPage() {
  const [activeSection, setActiveSection] = useState<Section>('about')
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    aboutContent,
    teamMembers,
    companyValues,
    stats,
    milestones,
    certifications,
    contactInfo,
    updateAboutContent,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addValue,
    updateValue,
    deleteValue,
    addStat,
    updateStat,
    deleteStat,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addCertification,
    updateCertification,
    deleteCertification,
    updateContactInfo,
  } = useContentStore()

  const sections = [
    { id: 'about' as Section, name: 'À propos', icon: <Info className="w-5 h-5" />, color: 'orange' },
    { id: 'team' as Section, name: 'Équipe', icon: <Users className="w-5 h-5" />, color: 'blue' },
    { id: 'values' as Section, name: 'Valeurs', icon: <Award className="w-5 h-5" />, color: 'purple' },
    { id: 'stats' as Section, name: 'Statistiques', icon: <BarChart3 className="w-5 h-5" />, color: 'green' },
    { id: 'timeline' as Section, name: 'Timeline', icon: <Clock className="w-5 h-5" />, color: 'pink' },
    { id: 'certifications' as Section, name: 'Certifications', icon: <Shield className="w-5 h-5" />, color: 'cyan' },
    { id: 'contact' as Section, name: 'Contact', icon: <Phone className="w-5 h-5" />, color: 'red' },
  ]

  const handleSave = () => {
    toast.success('Modifications enregistrées !')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/fr/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Gestion du Contenu</h1>
                <p className="text-gray-600">Gérez tous les textes et informations du site</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-lg"
            >
              <Save className="w-5 h-5" />
              <span>Tout enregistrer</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-32">
              <div className="text-sm font-semibold text-gray-500 mb-4">SECTIONS</div>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                      activeSection === section.id
                        ? `bg-${section.color}-100 text-${section.color}-600`
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {section.icon}
                    <span>{section.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="/fr/about"
                  target="_blank"
                  className="block text-center px-4 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all text-sm"
                >
                  Voir la page →
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* About Section */}
            {activeSection === 'about' && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Textes de la page À propos</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Titre Principal Hero</label>
                    <input
                      type="text"
                      value={aboutContent.heroTitle}
                      onChange={(e) => updateAboutContent({ heroTitle: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description Hero</label>
                    <textarea
                      value={aboutContent.heroDescription}
                      onChange={(e) => updateAboutContent({ heroDescription: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Badge Hero</label>
                    <input
                      type="text"
                      value={aboutContent.heroBadge}
                      onChange={(e) => updateAboutContent({ heroBadge: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div className="pt-6 border-t border-gray-200">
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Titre Section Histoire</label>
                      <input
                        type="text"
                        value={aboutContent.historyTitle}
                        onChange={(e) => updateAboutContent({ historyTitle: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Sous-titre Section Histoire</label>
                      <input
                        type="text"
                        value={aboutContent.historySubtitle}
                        onChange={(e) => updateAboutContent({ historySubtitle: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-200">
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Titre CTA Final</label>
                      <input
                        type="text"
                        value={aboutContent.ctaTitle}
                        onChange={(e) => updateAboutContent({ ctaTitle: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Description CTA</label>
                      <textarea
                        value={aboutContent.ctaDescription}
                        onChange={(e) => updateAboutContent({ ctaDescription: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team Section */}
            {activeSection === 'team' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center justify_between mb-6">
                    <h2 className="text-2xl font-black text-gray-900">Membres de l'équipe</h2>
                    <button
                      onClick={() => {
                        const newMember = {
                          name: 'Nouveau Membre',
                          role: 'Poste',
                          expertise: 'Expertise',
                          description: 'Description...',
                          avatar: 'NM',
                          order: teamMembers.length + 1,
                        }
                        addTeamMember(newMember)
                        toast.success('Membre ajouté !')
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Ajouter</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {teamMembers
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((member) => (
                        <div key={member.id} className="border-2 border-gray-200 rounded-xl p-6">
                          {editingId === member.id ? (
                            <div className="space-y-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-2">Nom</label>
                                  <input
                                    type="text"
                                    value={member.name}
                                    onChange={(e) => updateTeamMember(member.id, { name: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-2">Poste</label>
                                  <input
                                    type="text"
                                    value={member.role}
                                    onChange={(e) => updateTeamMember(member.id, { role: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Expertise</label>
                                <input
                                  type="text"
                                  value={member.expertise}
                                  onChange={(e) => updateTeamMember(member.id, { expertise: e.target.value })}
                                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                  value={member.description}
                                  onChange={(e) => updateTeamMember(member.id, { description: e.target.value })}
                                  rows={3}
                                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Avatar (initiales)</label>
                                <input
                                  type="text"
                                  value={member.avatar}
                                  onChange={(e) =>
                                    updateTeamMember(member.id, {
                                      avatar: e.target.value.toUpperCase().slice(0, 2),
                                    })
                                  }
                                  maxLength={2}
                                  className="w-24 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 text-center font-bold"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingId(null)
                                    toast.success('Modifications enregistrées !')
                                  }}
                                  className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
                                >
                                  Enregistrer
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600"
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-black text-xl flex items-center justify-center flex-shrink-0">
                                  {member.avatar}
                                </div>
                                <div>
                                  <h3 className="text-lg font-black text-gray-900">{member.name}</h3>
                                  <div className="text-sm text-blue-600 font-semibold">{member.role}</div>
                                  <div className="text-sm text-gray-600 mt-1">{member.expertise}</div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingId(member.id)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm('Supprimer ce membre ?')) {
                                      deleteTeamMember(member.id)
                                      toast.success('Membre supprimé !')
                                    }
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder other sections */}
            {['values', 'stats', 'timeline', 'certifications'].includes(activeSection) && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-black text-gray-900 mb-4">
                  Section {sections.find((s) => s.id === activeSection)?.name}
                </h2>
                <p className="text-gray-600">Interface d'édition similaire à "Équipe" - à décliner.</p>
              </div>
            )}

            {activeSection === 'contact' && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Informations de Contact</h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" /> Téléphone
                      </label>
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => updateContactInfo({ phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" /> Email
                      </label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => updateContactInfo({ email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" /> Adresse
                    </label>
                    <input
                      type="text"
                      value={contactInfo.address}
                      onChange={(e) => updateContactInfo({ address: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Ville</label>
                      <input
                        type="text"
                        value={contactInfo.city}
                        onChange={(e) => updateContactInfo({ city: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Pays</label>
                      <input
                        type="text"
                        value={contactInfo.country}
                        onChange={(e) => updateContactInfo({ country: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Code Postal</label>
                      <input
                        type="text"
                        value={contactInfo.postalCode}
                        onChange={(e) => updateContactInfo({ postalCode: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0"
                      />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-black text-gray-900 mb-4">Horaires d'ouverture</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Lundi - Vendredi</label>
                        <input
                          type="text"
                          value={contactInfo.hours.weekdays}
                          onChange={(e) => updateContactInfo({ hours: { ...contactInfo.hours, weekdays: e.target.value } })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Samedi</label>
                        <input
                          type="text"
                          value={contactInfo.hours.saturday}
                          onChange={(e) => updateContactInfo({ hours: { ...contactInfo.hours, saturday: e.target.value } })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Dimanche</label>
                        <input
                          type="text"
                          value={contactInfo.hours.sunday}
                          onChange={(e) => updateContactInfo({ hours: { ...contactInfo.hours, sunday: e.target.value } })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


