import { getDictionary } from '@/lib/dictionaries'
import { locales, type Locale } from '@/i18n.config'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function BadgePrintPage({ 
  params: { locale } 
}: { 
  params: { locale: Locale } 
}) {
  const t = await getDictionary(locale)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Impression de Badges
          </h1>
          <p className="text-gray-600">
            Gérer et imprimer vos badges en série
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🖨️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Gestion d'Impression
            </h2>
            <p className="text-gray-600 mb-8">
              Interface d'impression à venir
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <p className="text-gray-500 font-semibold mb-2">Prévisualisation</p>
                <p className="text-sm text-gray-400">Aperçu avant impression</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <p className="text-gray-500 font-semibold mb-2">Paramètres</p>
                <p className="text-sm text-gray-400">Configuration d'impression</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

