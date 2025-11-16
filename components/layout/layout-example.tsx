'use client'

import MainLayout from './main-layout'

/**
 * Exemple d'utilisation du Layout complet
 * Montre comment utiliser le MainLayout avec header et footer
 */
export default function LayoutExample() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Layout Complet - Xarala Solutions
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Header</h2>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Logo "Xarala Solutions"</li>
                <li>✅ Navigation responsive</li>
                <li>✅ Sélecteur de langue</li>
                <li>✅ Panier avec badge</li>
                <li>✅ Authentification</li>
                <li>✅ Effet sticky au scroll</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Footer</h2>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Informations entreprise</li>
                <li>✅ Réseaux sociaux</li>
                <li>✅ Liens rapides</li>
                <li>✅ Contact et horaires</li>
                <li>✅ Copyright et liens légaux</li>
                <li>✅ Design responsive</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-xarala rounded-lg p-8 text-white mb-8">
            <h2 className="text-2xl font-bold mb-4">Utilisation du MainLayout</h2>
            <p className="mb-4">
              Le MainLayout combine automatiquement le header et le footer avec votre contenu.
            </p>
            <pre className="bg-white/10 p-4 rounded-lg text-sm overflow-x-auto">
{`import MainLayout from '@/components/layout/main-layout'

export default function MyPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1>Ma page</h1>
        <p>Contenu de ma page...</p>
      </div>
    </MainLayout>
  )
}`}
            </pre>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Section {i + 1}
                </h3>
                <p className="text-gray-600 text-sm">
                  Contenu de la section {i + 1}. Le header reste fixe en haut
                  et le footer s'affiche en bas de la page.
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Fonctionnalités du Layout</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Header :</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Navigation responsive</li>
                  <li>• Authentification Supabase</li>
                  <li>• Panier avec Zustand</li>
                  <li>• Internationalisation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Footer :</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Informations de contact</li>
                  <li>• Réseaux sociaux</li>
                  <li>• Liens légaux</li>
                  <li>• Animations Framer Motion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
