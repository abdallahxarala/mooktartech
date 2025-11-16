'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Type, Link2, Mail, Phone, MapPin, Calendar, Briefcase, Hash, Edit3 } from 'lucide-react'
import { useNFCEditorStore } from '@/lib/store/nfc-editor-store'

const FIELD_TYPES = [
  { id: 'text', name: 'Texte', icon: Type },
  { id: 'url', name: 'Lien', icon: Link2 },
  { id: 'email', name: 'Email', icon: Mail },
  { id: 'phone', name: 'Téléphone', icon: Phone }
]

const FIELD_ICONS = [
  { id: 'briefcase', icon: Briefcase },
  { id: 'map-pin', icon: MapPin },
  { id: 'calendar', icon: Calendar },
  { id: 'hash', icon: Hash },
  { id: 'edit', icon: Edit3 }
]

export function CustomFieldsStep({ profile }: any) {
  const { addCustomField, updateCustomField, deleteCustomField } = useNFCEditorStore()
  const [isAdding, setIsAdding] = useState(false)
  const [newField, setNewField] = useState({
    label: '',
    value: '',
    type: 'text' as 'text' | 'url' | 'email' | 'phone',
    icon: 'briefcase'
  })

  if (!profile) return null

  const handleAdd = () => {
    if (!newField.label.trim()) return
    addCustomField(newField)
    setNewField({ label: '', value: '', type: 'text', icon: 'briefcase' })
    setIsAdding(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <div className="text-sm font-bold text-gray-700 mb-3">
          Suggestions rapides :
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Numéro de bureau', icon: 'hash', type: 'text' },
            { label: 'Département', icon: 'briefcase', type: 'text' },
            { label: 'Horaires', icon: 'calendar', type: 'text' },
            { label: 'Adresse bureau', icon: 'map-pin', type: 'text' }
          ].map((preset, index) => (
            <button
              key={index}
              onClick={() => addCustomField({...preset, value: '', type: preset.type as any})}
              className="px-4 py-2 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 text-sm font-semibold rounded-xl transition-colors"
            >
              + {preset.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {profile.customFields.map((field: any) => {
          const fieldIcon = FIELD_ICONS.find(i => i.id === field.icon)
          const IconComponent = fieldIcon?.icon || Briefcase

          return (
            <motion.div
              key={field.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-orange-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                    placeholder="Nom du champ"
                    className="w-full px-0 py-1 border-0 border-b-2 border-gray-200 focus:border-orange-500 focus:ring-0 font-bold transition-colors"
                  />
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
                    placeholder="Valeur"
                    className="w-full px-0 py-1 border-0 border-b-2 border-gray-200 focus:border-orange-500 focus:ring-0 text-sm transition-colors"
                  />
                </div>
                <button
                  onClick={() => deleteCustomField(field.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 w-full px-6 py-4 border-2 border-dashed border-gray-300 hover:border-orange-500 text-gray-600 hover:text-orange-600 font-bold rounded-2xl transition-all hover:bg-orange-50"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un champ personnalisé</span>
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-2xl p-6 border-2 border-orange-500 shadow-xl"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nom du champ
              </label>
              <input
                type="text"
                value={newField.label}
                onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                placeholder="Ex: Numéro de bureau"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Type de champ
              </label>
              <div className="grid grid-cols-4 gap-2">
                {FIELD_TYPES.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => setNewField({ ...newField, type: type.id as any })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        newField.type === type.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-xs font-semibold">{type.name}</div>
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Icône
              </label>
              <div className="grid grid-cols-5 gap-2">
                {FIELD_ICONS.map((iconOption) => {
                  const IconComponent = iconOption.icon
                  return (
                    <button
                      key={iconOption.id}
                      onClick={() => setNewField({ ...newField, icon: iconOption.id })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        newField.icon === iconOption.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mx-auto" />
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={!newField.label.trim()}
                className="flex-1 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-all"
              >
                Ajouter
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

