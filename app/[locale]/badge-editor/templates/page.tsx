import { getDictionary } from '@/lib/dictionaries'
import { locales } from '@/i18n.config'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function BadgeTemplatesPage({ 
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
            Templates de Badges
          </h1>
          <p className="text-gray-600">
            Choisissez parmi nos templates professionnels
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="aspect-[3/4] bg-gradient-to-br from-orange-200 to-pink-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">📇</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Template {i}</h3>
              <p className="text-sm text-gray-600">Description du template</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

