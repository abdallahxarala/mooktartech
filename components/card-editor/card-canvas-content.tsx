'use client'

import React from 'react'
import { CardData } from '@/lib/store/card-editor-store'
import { generateStyledQRCode } from '@/lib/utils/qr-generator'

interface CardCanvasContentProps {
  card: CardData
}

export function CardCanvasContent({ card }: CardCanvasContentProps) {
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    generateStyledQRCode(card).then(setQrCodeUrl).catch(console.error)
  }, [card])

  const getBackgroundStyle = () => {
    switch (card.backgroundType) {
      case 'gradient':
        return {
          background: card.colors.background.includes('gradient') 
            ? card.colors.background 
            : `linear-gradient(135deg, ${card.colors.primary}, ${card.colors.secondary})`
        }
      case 'image':
        return {
          backgroundImage: card.backgroundImage ? `url(${card.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      case 'pattern':
        return {
          backgroundImage: 'url(/grid.svg)',
          backgroundSize: '20px 20px',
          backgroundColor: card.colors.background
        }
      default:
        return {
          backgroundColor: card.colors.background
        }
    }
  }

  const getLayoutClasses = () => {
    switch (card.layout) {
      case 'left':
        return 'flex-row'
      case 'right':
        return 'flex-row-reverse'
      case 'center':
        return 'flex-col'
      default:
        return 'flex-row'
    }
  }

  return (
    <div 
      className={`w-full h-full p-6 flex ${getLayoutClasses()} justify-between items-center`}
      style={getBackgroundStyle()}
    >
      {/* Left/Content Section */}
      <div className={`flex-1 ${card.layout === 'center' ? 'text-center' : ''}`}>
        {/* Photo */}
        {card.photo && (
          <div className="mb-4">
            <img
              src={card.photo}
              alt="Photo de profil"
              className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
            />
          </div>
        )}

        {/* Name */}
        <h1 
          className="text-2xl font-bold mb-1"
          style={{ 
            color: card.colors.primary,
            fontFamily: card.fonts.heading
          }}
        >
          {card.firstName} {card.lastName}
        </h1>

        {/* Title */}
        {card.title && (
          <p 
            className="opacity-80 mb-1"
            style={{ 
              color: card.colors.secondary,
              fontFamily: card.fonts.body,
              fontSize: `${card.fonts.size}px`
            }}
          >
            {card.title}
          </p>
        )}

        {/* Company */}
        {card.company && (
          <p 
            className="opacity-60 text-sm"
            style={{ 
              color: card.colors.secondary,
              fontFamily: card.fonts.body
            }}
          >
            {card.company}
          </p>
        )}

        {/* Contact Info */}
        <div className="mt-4 space-y-1">
          {card.email && (
            <p 
              className="text-sm opacity-80"
              style={{ 
                color: card.colors.secondary,
                fontFamily: card.fonts.body
              }}
            >
              {card.email}
            </p>
          )}
          {card.phone && (
            <p 
              className="text-sm opacity-80"
              style={{ 
                color: card.colors.secondary,
                fontFamily: card.fonts.body
              }}
            >
              {card.phone}
            </p>
          )}
        </div>

        {/* Social Links */}
        {card.socialLinks.length > 0 && (
          <div className="flex space-x-2 mt-4">
            {card.socialLinks.slice(0, 4).map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <span className="text-xs font-bold">
                  {link.platform.charAt(0).toUpperCase()}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Right/QR Section */}
      {qrCodeUrl && (
        <div className="flex-shrink-0 ml-4">
          <img
            src={qrCodeUrl}
            alt="QR Code"
            className="w-20 h-20 bg-white rounded-lg p-1"
          />
        </div>
      )}

      {/* Logo */}
      {card.logo && (
        <div className="absolute top-4 right-4">
          <img
            src={card.logo}
            alt="Logo entreprise"
            className="w-8 h-8 object-contain"
          />
        </div>
      )}
    </div>
  )
}
