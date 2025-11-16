'use client'

import Footer from './footer'

/**
 * Exemple d'utilisation du Footer
 * Montre comment intégrer le footer dans une page
 */
export default function FooterExample() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenu de la page */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Exemple d'utilisation du Footer
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Structure du Footer</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Logo + description de l'entreprise</li>
                <li>✅ Réseaux sociaux avec icônes</li>
                <li>✅ Liens rapides de navigation</li>
                <li>✅ Informations de contact</li>
                <li>✅ Copyright et liens légaux</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Fonctionnalités</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Design responsive (3 colonnes → mobile)</li>
                <li>✅ Animations Framer Motion</li>
                <li>✅ Liens externes avec sécurité</li>
                <li>✅ Accessibilité ARIA</li>
                <li>✅ Internationalisation complète</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Technologies</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Next.js Link pour navigation</li>
                <li>✅ next-intl pour traductions</li>
                <li>✅ lucide-react pour icônes</li>
                <li>✅ Tailwind CSS pour styling</li>
                <li>✅ TypeScript strict</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Utilisation du Footer</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Import basique :</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import Footer from '@/components/layout/footer'

export default function Layout({ children }) {
  return (
    <div>
      <main>{children}</main>
      <Footer />
    </div>
  )
}`}
                </pre>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Avec personnalisation :</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<Footer className="mt-16" />`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gradient-xarala rounded-lg text-white">
            <h3 className="text-xl font-bold mb-2">Informations de Contact</h3>
            <p className="mb-4">
              Le footer affiche les informations de contact de Xarala Solutions :
            </p>
            <ul className="space-y-1 text-sm">
              <li>📍 Dakar, Sénégal</li>
              <li>📧 contact@xarala.sn</li>
              <li>📞 +221 33 XXX XX XX</li>
              <li>🕒 Lun-Ven : 8h-18h</li>
            </ul>
          </div>
        </div>
      </main>
      
      {/* Footer avec toutes les fonctionnalités */}
      <Footer />
    </div>
  )
}
