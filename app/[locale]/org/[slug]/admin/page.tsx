import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Database } from '@/lib/supabase/database.types'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Download,
  ExternalLink,
  BarChart3,
  Clock
} from 'lucide-react'

type Product = Database['public']['Tables']['products']['Row']
type Organization = Database['public']['Tables']['organizations']['Row']

interface AdminDashboardProps {
  params: {
    locale: string
    slug: string
  }
}

export const dynamic = 'force-dynamic'

export default async function AdminDashboard({ params }: AdminDashboardProps) {
  const { locale, slug } = params
  const supabase = await createSupabaseServerClient()

  // ====================================
  // ÉTAPE 1 : RÉCUPÉRER L'ORGANIZATION
  // ====================================
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', slug)
    .single<Organization>()

  // Early return si pas trouvé
  if (orgError || !organization) {
    console.error('❌ Organization not found:', { slug, error: orgError })
    notFound()
  }

  // TypeScript now knows organization is of type Organization after the check above
  const orgId = (organization as any).id

  // Debug log pour vérification
  console.log('✅ Admin Dashboard - Organization found:', { id: orgId, name: (organization as any).name, slug: (organization as any).slug })

  // ====================================
  // ÉTAPE 2 : RÉCUPÉRER LES PRODUITS
  // FILTRÉS PAR organization_id
  // ====================================
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('organization_id', orgId) // ← CRITIQUE : Isolation multitenant
    .order('created_at', { ascending: false })

  if (productsError) {
    console.error('❌ Error fetching products:', productsError)
  }

  const productsList = (products || []) as Product[]

  // Debug log pour vérification
  console.log(`✅ Admin Dashboard - Products count for ${(organization as any).name}:`, productsList.length)

  // Statistiques
  const stats = {
    totalProducts: productsList.length,
    totalStock: productsList.reduce((sum, p) => sum + (p.stock || 0), 0),
    featuredProducts: productsList.filter(p => p.featured).length,
    totalValue: productsList.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900">
                Tableau de bord
              </h1>
              <p className="text-gray-600 mt-2">
                Bienvenue dans votre espace d&apos;administration - {(organization as any).name}
              </p>
            </div>
            <Link
              href={`/${locale}/org/${slug}`}
              className="text-gray-600 hover:text-orange-500 font-semibold transition-colors"
            >
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Produits */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Produits</h3>
              <Package className="w-8 h-8 opacity-50" />
            </div>
            <div className="text-5xl font-black mb-2">
              {stats.totalProducts}
            </div>
            <p className="text-blue-100">
              Total dans le catalogue
            </p>
          </div>

          {/* Stock Total */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Stock</h3>
              <TrendingUp className="w-8 h-8 opacity-50" />
            </div>
            <div className="text-5xl font-black mb-2">
              {stats.totalStock}
            </div>
            <p className="text-green-100">
              Unités disponibles
            </p>
          </div>

          {/* Produits Phares */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Phares</h3>
              <BarChart3 className="w-8 h-8 opacity-50" />
            </div>
            <div className="text-5xl font-black mb-2">
              {stats.featuredProducts}
            </div>
            <p className="text-orange-100">
              Produits mis en avant
            </p>
          </div>

          {/* Valeur Totale */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Valeur</h3>
              <ShoppingCart className="w-8 h-8 opacity-50" />
            </div>
            <div className="text-5xl font-black mb-2">
              {new Intl.NumberFormat('fr-FR', {
                style: 'decimal',
                maximumFractionDigits: 0
              }).format(stats.totalValue / 1000)}K
            </div>
            <p className="text-purple-100">
              FCFA en stock
            </p>
          </div>
        </div>

        {/* Actions Rapides */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">
            Actions rapides
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href={`/${locale}/org/${slug}/admin/products`}
              className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Gérer les produits</h3>
                <p className="text-sm text-gray-600">Ajouter, modifier, supprimer</p>
              </div>
            </Link>

            <Link
              href={`/${locale}/org/${slug}/shop`}
              className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all group"
            >
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Voir la boutique</h3>
                <p className="text-sm text-gray-600">Prévisualiser le shop</p>
              </div>
            </Link>

            <button className="flex items-center gap-4 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all group">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Exporter les données</h3>
                <p className="text-sm text-gray-600">Télécharger en CSV</p>
              </div>
            </button>
          </div>
        </div>

        {/* Liste des Produits Récents */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900">
              Produits récents
            </h2>
            <Link
              href={`/${locale}/org/${slug}/admin/products`}
              className="text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-2"
            >
              Voir tout
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {productsList.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Aucun produit pour le moment</p>
              <Link
                href={`/${locale}/org/${slug}/admin/products`}
                className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Ajouter un produit
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Produit</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Catégorie</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Prix</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Stock</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Statut</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productsList.slice(0, 10).map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            {product.brand && (
                              <p className="text-sm text-gray-500">{product.brand}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {product.category || 'Non catégorisé'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-gray-900">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'decimal',
                            maximumFractionDigits: 0
                          }).format(product.price)} FCFA
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          (product.stock || 0) > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {product.featured ? (
                          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                            Phare
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            Standard
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Link
                          href={`/${locale}/org/${slug}/shop/${product.id}`}
                          className="text-orange-500 hover:text-orange-600 font-semibold text-sm"
                        >
                          Voir →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

