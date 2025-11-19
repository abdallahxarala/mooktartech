'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { useParams, usePathname } from 'next/navigation'
import { 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  ArrowRight,
  Heart,
  Sparkles,
  Package,
  Building2,
  Sparkles as SparklesIcon,
  HelpCircle
} from 'lucide-react'

/**
 * Footer ultra-moderne 2025 avec gradient sombre et effets
 * Design avec glassmorphism, animations et micro-interactions
 * Adapté pour la structure multitenant
 */
export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const params = useParams()
  const pathname = usePathname()
  
  // Détecter le contexte multitenant
  const slug = params?.slug as string | undefined
  const isMultitenant = pathname?.includes('/org/') && slug
  const basePath = isMultitenant ? `/${locale}/org/${slug}` : `/${locale}`

  const quickLinks = [
    { label: 'Accueil', href: basePath },
    { label: 'Produits', href: `${basePath}/shop` },
    { label: 'Créer ma carte NFC', href: `${basePath}/nfc-editor` },
    { label: 'Éditeur de Badges', href: `${basePath}/badge-editor/pro` },
    { label: 'Contact', href: `${basePath}/contact` },
  ]

  const legalLinks = [
    { label: 'Mentions légales', href: `${basePath}/terms` },
    { label: 'Confidentialité', href: `${basePath}/privacy` },
    { label: 'Cookies', href: `${basePath}/cookies` },
  ]

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/company/xarala-solutions', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/xarala_solutions', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com/xarala.solutions', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/xarala_solutions', label: 'Instagram' },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-float animation-delay-2000" />
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1 animate-fade-in-up">
              <Link href={basePath} className="flex items-center gap-3 mb-6 group">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <span className="text-2xl font-black text-white">X</span>
                </motion.div>
                <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-500 group-hover:from-orange-500 group-hover:to-orange-600 transition-all">
                  Xarala Solutions
                </span>
              </Link>
              
              <p className="text-gray-200 mb-6 leading-relaxed">
                Solutions innovantes pour cartes PVC, NFC et badges professionnels. 
                Créez votre carte digitale en quelques minutes.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center text-gray-200 hover:text-white hover:bg-white/20 hover:scale-110 hover:-translate-y-1 active:scale-90 transition-all group animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="animate-fade-in-up animation-delay-100">
              <h3 className="text-xl font-bold text-white mb-6">
                Liens rapides
              </h3>
              
              <ul className="space-y-4">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center text-gray-200 hover:text-white transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      <span className="group-hover:translate-x-2 transition-transform">
                        {link.label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-white mb-6">
                Contact
              </h3>
              
              <div className="space-y-4">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3 group"
                >
                  <MapPin className="w-5 h-5 text-orange-400 mt-1 group-hover:text-orange-300 transition-colors" />
                  <div>
                    <p className="text-gray-200 font-medium">Dakar, Sénégal</p>
                    <p className="text-gray-300/70 text-sm">Afrique de l'Ouest</p>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 group"
                >
                  <Mail className="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors" />
                  <a 
                    href="mailto:contact@xarala.sn"
                    className="text-gray-200 hover:text-white transition-colors"
                  >
                    contact@xarala.sn
                  </a>
                </motion.div>
                
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 group"
                >
                  <Phone className="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors" />
                  <a 
                    href="tel:+221338232326"
                    className="text-gray-200 hover:text-white transition-colors"
                  >
                    +221 33 823 23 26
                  </a>
                </motion.div>
                
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 group"
                >
                  <Phone className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors" />
                  <a 
                    href="https://wa.me/221775398139"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-white transition-colors"
                  >
                    +221 77 539 81 39 (WhatsApp)
                  </a>
                </motion.div>
                
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 group"
                >
                  <Clock className="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors" />
                  <div>
                    <p className="text-gray-200">Lun-Ven : 8h-18h</p>
                    <p className="text-gray-300/70 text-sm">Sam : 9h-15h</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-6">
                Newsletter
              </h3>
              
              <p className="text-gray-200 mb-6">
                Restez informé de nos dernières nouveautés et offres spéciales.
              </p>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-2 top-2 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
                  >
                    S'abonner
                  </motion.button>
                </div>
                
                <p className="text-gray-300/70 text-xs">
                  Nous ne partagerons jamais votre email avec des tiers.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2 text-gray-200"
              >
                <span>© 2025 Xarala Solutions. Tous droits réservés.</span>
                <span className="inline-block animate-pulse text-red-400">
                  ❤️
                </span>
                <span>Fait avec passion au Sénégal</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center gap-6"
              >
                {legalLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-200 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-gray-400" />
        
        {/* Sparkle Effects */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 text-orange-400/30"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
        
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
          className="absolute bottom-20 left-20 text-gray-400/30"
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
      </div>
    </footer>
  )
}
