'use client'

import { useMemo } from 'react'
import { Check, X } from 'lucide-react'

interface PasswordStrengthProps {
  password: string
  className?: string
}

/**
 * Composant d'indicateur de force du mot de passe
 * Affiche une barre de progression colorée et des critères de validation
 */
export default function PasswordStrength({ password, className = '' }: PasswordStrengthProps) {
  // Calcul de la force du mot de passe
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '', criteria: [] }

    let score = 0
    const criteria = []

    // Longueur minimale (8 caractères)
    if (password.length >= 8) {
      score += 1
      criteria.push({ text: 'Au moins 8 caractères', valid: true })
    } else {
      criteria.push({ text: 'Au moins 8 caractères', valid: false })
    }

    // Majuscule
    if (/[A-Z]/.test(password)) {
      score += 1
      criteria.push({ text: 'Une majuscule', valid: true })
    } else {
      criteria.push({ text: 'Une majuscule', valid: false })
    }

    // Chiffre
    if (/\d/.test(password)) {
      score += 1
      criteria.push({ text: 'Un chiffre', valid: true })
    } else {
      criteria.push({ text: 'Un chiffre', valid: false })
    }

    // Caractère spécial
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1
      criteria.push({ text: 'Un caractère spécial', valid: true })
    } else {
      criteria.push({ text: 'Un caractère spécial', valid: false })
    }

    // Longueur supplémentaire (12+ caractères)
    if (password.length >= 12) {
      score += 1
      criteria.push({ text: '12+ caractères (bonus)', valid: true })
    }

    // Détermination du label et de la couleur
    let label = ''
    let color = ''

    if (score <= 1) {
      label = 'Très faible'
      color = 'bg-red-500'
    } else if (score === 2) {
      label = 'Faible'
      color = 'bg-orange-500'
    } else if (score === 3) {
      label = 'Moyen'
      color = 'bg-yellow-500'
    } else if (score === 4) {
      label = 'Fort'
      color = 'bg-green-500'
    } else {
      label = 'Très fort'
      color = 'bg-green-600'
    }

    return { score, label, color, criteria }
  }, [password])

  if (!password) return null

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Barre de progression */}
      <div className="space-y-2 animate-fade-in-up">
        <div className="flex justify-between items-center animate-fade-in-up">
          <span className="text-sm font-medium text-gray-700 animate-fade-in-up">Force du mot de passe</span>
          <span className={`text-sm font-semibold ${
            strength.score <= 2 ? 'text-red-600' :
            strength.score === 3 ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {strength.label}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden animate-fade-in-up">
          <div
            className={`h-full ${strength.color} transition-colors duration-300`}
            style={{ width: `${strength.score * 20}%` }}
          />
        </div>
      </div>

      {/* Critères de validation */}
      <div className="space-y-1 animate-fade-in-up">
        {strength.criteria.map((criterion, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 text-xs ${
              criterion.valid ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            {criterion.valid ? (
              <Check className="h-3 w-3 text-green-600 animate-fade-in-up" />
            ) : (
              <X className="h-3 w-3 text-gray-400 animate-fade-in-up" />
            )}
            <span>{criterion.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
