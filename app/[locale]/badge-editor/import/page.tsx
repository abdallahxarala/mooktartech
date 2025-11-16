import { getDictionary } from '@/lib/dictionaries'
import { locales } from '@/i18n.config'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function BadgeImportPage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  const t = await getDictionary(locale)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Import de Participants
          </h1>
          <p className="text-gray-600">
            Importez vos données depuis Excel, CSV ou Google Sheets
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Import de Données
            </h2>
            <p className="text-gray-600 mb-8">
              Interface d'import à venir
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <p className="text-gray-500">Drag & drop ici ou cliquez pour sélectionner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

