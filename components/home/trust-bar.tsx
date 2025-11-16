'use client'

import React from 'react'

const CLIENTS = [
  { name: 'Ministères', icon: '🏛️' },
  { name: 'Télécoms', icon: '📱' },
  { name: 'Universités', icon: '🎓' },
  { name: 'Santé', icon: '🏥' },
  { name: 'Finance', icon: '🏦' },
  { name: 'Entreprises', icon: '🏢' },
]

export function TrustBar() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-12">
          Ils nous font confiance
        </p>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
          {CLIENTS.map((client) => (
            <div
              key={client.name}
              className="flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-all duration-300 group"
            >
              <div className="text-5xl group-hover:scale-125 transition-transform duration-300">
                {client.icon}
              </div>
              <span className="text-xs font-semibold text-gray-600 text-center">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
