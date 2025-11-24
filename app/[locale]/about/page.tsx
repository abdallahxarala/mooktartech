'use client'

import React from 'react'
import { useContentStore } from '@/lib/store/content-store'
import Link from 'next/link'
import { 
  ArrowRight, 
  Award, 
  Users, 
  Target, 
  Zap, 
  Shield,
  TrendingUp,
  Heart,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Sparkles,
  Package,
  Clock,
  ThumbsUp,
  Star
} from 'lucide-react'

export default function AboutPage() {
  const { aboutContent, teamMembers, companyValues, stats, milestones, certifications } = useContentStore()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-xl rounded-full text-white text-sm font-bold mb-8 border border-white/30">
              <Sparkles className="w-4 h-4" />
              <span>{aboutContent.heroBadge}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">{aboutContent.heroTitle}</h1>

            <p className="text-xl md:text-2xl text-white/95 mb-10 leading-relaxed max-w-3xl mx-auto">{aboutContent.heroDescription}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/fr/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-white text-gray-900 text-lg font-black rounded-2xl hover:bg-gray-50 transition-all shadow-2xl hover:scale-105"
              >
                <span>Nous contacter</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:+221775398139"
                className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white text-lg font-bold rounded-2xl hover:bg-white/20 transition-all"
              >
                <Phone className="w-5 h-5" />
                <span>+221 77 539 81 39</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS ROW */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat: any, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-600">
                  {/* Icon rendering handled by name; keep placeholder circle */}
                </div>
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOTRE HISTOIRE */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-4">
                <Star className="w-4 h-4" />
                <span>Notre histoire</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{aboutContent.historyTitle}</h2>
              <p className="text-xl text-gray-600">{aboutContent.historySubtitle}</p>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-pink-500 rounded-full hidden md:block" />
              <div className="space-y-12">
                {milestones.map((milestone: any, index) => (
                  <div key={index} className="relative pl-0 md:pl-24">
                    <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-xl hidden md:flex">
                      {milestone.year}
                    </div>
                    <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-orange-500 transition-all hover:shadow-xl">
                      <div className="flex items-center gap-3 mb-3 md:hidden">
                        <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-black rounded-xl">
                          {milestone.year}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-3">{milestone.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOS VALEURS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-4">
              <Heart className="w-4 h-4" />
              <span>Nos valeurs</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Ce qui nous définit</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Les principes qui guident notre action au quotidien
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {companyValues.map((value: any, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  {/* icon by name */}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOTRE ÉQUIPE */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-4">
              <Users className="w-4 h-4" />
              <span>Notre équipe</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Des experts à votre service</h2>
            <p className="text-xl text_gray-600 max-w-2xl mx-auto">Une équipe passionnée et compétente pour vous accompagner</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx_auto">
            {teamMembers.map((member: any, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-gray-100"
              >
                <div className="relative h-48 bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-xl border-4 border-white flex items-center justify-center text-white font-black text-4xl">
                    {member.avatar}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{member.name}</h3>
                  <div className="text-orange-600 font-bold mb-1">{member.role}</div>
                  <div className="text-sm text-gray-600 font-semibold mb-4">{member.expertise}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS & PARTENAIRES */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">
              <Award className="w-4 h-4" />
              <span>Certifications</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{aboutContent.certificationsTitle}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{aboutContent.certificationsSubtitle}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {certifications.map((cert: any, index) => (
              <div
                key={index}
                className="group bg_white rounded-2xl p-8 border-2 border-gray-100 hover:border-orange-500 hover:shadow-xl transition-all flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-orange-600 font-black text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {cert.logo}
                </div>
                <div className="text-sm font-bold text-gray-900">{cert.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg_white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Prêt à démarrer votre projet ?</h2>
            <p className="text-xl text-white/95 mb-10 leading-relaxed">
              Contactez-nous dès aujourd'hui pour un devis gratuit et sans engagement.
              Notre équipe vous répond sous 2h.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/fr/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-white text-gray-900 text-lg font-black rounded-2xl hover:bg-gray-50 transition-all shadow-2xl hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                <span>Demander un devis</span>
              </Link>
              <a
                href="tel:+221775398139"
                className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white text-lg font-bold rounded-2xl hover:bg-white/20 transition-all"
              >
                <Phone className="w-5 h-5" />
                <span>+221 77 539 81 39</span>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Devis sous 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Livraison rapide</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Formation incluse</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
