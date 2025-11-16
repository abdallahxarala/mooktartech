/**
 * Exemples d'utilisation des clients Supabase pour Xarala Solutions
 * Démonstrations pratiques des fonctionnalités
 */

import { createSupabaseBrowserClient } from './client'
// Note: createSupabaseServerClient is imported dynamically in server-side examples to avoid bundling issues
import { useSupabaseQuery, useSupabaseMutation, useSupabaseListQuery } from '../hooks/use-supabase-query'

// === EXEMPLES CÔTÉ CLIENT ===

/**
 * Exemple 1: Obtenir les produits avec gestion d'erreurs
 */
export async function getProductsExample() {
  const supabase = createSupabaseBrowserClient()

  // Utilisation simple
  const { data: products, error } = await supabase.products.getAll({
    category: 'cartes-virtuelles',
    search: 'professionnel',
    limit: 10
  })

  if (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return []
  }

  return products
}

/**
 * Exemple 2: Créer une carte virtuelle
 */
export async function createVirtualCardExample() {
  const supabase = createSupabaseBrowserClient()

  const cardData = {
    user_id: 'user-uuid',
    name: 'John Doe',
    title: 'Développeur Full Stack',
    company: 'Xarala Solutions',
    template_id: 'modern-template',
    short_id: 'john-doe-2024',
    metadata: {
      design: {
        backgroundColor: '#2563eb',
        textColor: '#ffffff',
        accentColor: '#10b981'
      },
      socialMedia: {
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: '@johndoe'
      }
    },
    is_public: true
  }

  const { data: card, error } = await supabase.virtualCards.create(cardData)

  if (error) {
    console.error('Erreur lors de la création de la carte:', error)
    return null
  }

  return card
}

/**
 * Exemple 3: Gestion des commandes
 */
export async function processOrderExample() {
  const supabase = createSupabaseBrowserClient()

  // 1. Créer la commande
  const orderData = {
    user_id: 'user-uuid',
    total: 50000, // 50,000 FCFA
    shipping_address: {
      street: '123 Avenue Léopold Sédar Senghor',
      city: 'Dakar',
      region: 'Dakar',
      postal_code: '10000',
      country: 'Sénégal'
    },
    payment_intent_id: 'pi_stripe_payment_intent_id'
  }

  const { data: order, error: orderError } = await supabase.orders.create(orderData)

  if (orderError) {
    console.error('Erreur lors de la création de la commande:', orderError)
    return null
  }

  // 2. Ajouter les articles
  const orderItems = [
    {
      order_id: order.id,
      product_id: 'product-uuid-1',
      quantity: 2,
      price: 25000
    },
    {
      order_id: order.id,
      product_id: 'product-uuid-2',
      quantity: 1,
      price: 25000
    }
  ]

  for (const item of orderItems) {
    const { error: itemError } = await supabase.supabase
      .from('order_items')
      .insert(item)

    if (itemError) {
      console.error('Erreur lors de l\'ajout de l\'article:', itemError)
      return null
    }
  }

  return order
}

// === EXEMPLES CÔTÉ SERVEUR ===

/**
 * Exemple 4: Obtenir les statistiques admin
 */
export async function getAdminStatsExample() {
  // Dynamic import to avoid bundling server code in client
  const { createSupabaseServerClient } = await import('./server')
  const supabase = createSupabaseServerClient()

  // Vérifier les permissions admin
  const { data: user, error: userError } = await supabase.auth.getCurrentUser()
  if (userError || !user) {
    throw new Error('Utilisateur non authentifié')
  }

  const { isAdmin } = await supabase.auth.checkAdminPermissions(user.id)
  if (!isAdmin) {
    throw new Error('Permissions administrateur requises')
  }

  // Obtenir les statistiques
  const [
    { data: users },
    { data: orders },
    { data: products },
    { data: cards }
  ] = await Promise.all([
    supabase.users.getAllUsers({ limit: 1000 }),
    supabase.orders.getAllOrders({ limit: 1000 }),
    supabase.products.getAll({ limit: 1000 }),
    supabase.virtualCards.getPublicCards({ limit: 1000 })
  ])

  return {
    totalUsers: users?.length || 0,
    totalOrders: orders?.length || 0,
    totalProducts: products?.length || 0,
    totalCards: cards?.length || 0,
    totalRevenue: orders?.reduce((sum, order) => sum + order.total, 0) || 0
  }
}

// === EXEMPLES AVEC HOOKS ===

/**
 * Exemple 5: Hook pour les produits avec pagination
 */
export function useProductsExample() {
  const supabase = createSupabaseBrowserClient()

  return useSupabaseListQuery(
    async (offset, limit) => {
      const { data, error } = await supabase.products.getAll({
        limit,
        offset
      })
      return { data, error }
    },
    {
      pageSize: 12,
      immediate: true,
      onSuccess: (data) => {
        console.log(`${data?.length || 0} produits chargés`)
      },
      onError: (error) => {
        console.error('Erreur lors du chargement des produits:', error)
      }
    }
  )
}

/**
 * Exemple 6: Hook pour créer une carte virtuelle
 */
export function useCreateVirtualCardExample() {
  const supabase = createSupabaseBrowserClient()

  return useSupabaseMutation(
    async (cardData) => {
      return await supabase.virtualCards.create(cardData)
    },
    {
      onSuccess: (card) => {
        console.log('Carte créée avec succès:', card?.short_id)
      },
      onError: (error) => {
        console.error('Erreur lors de la création de la carte:', error)
      }
    }
  )
}

/**
 * Exemple 7: Hook pour les analytics en temps réel
 */
export function useCardAnalyticsExample(cardId: string) {
  const supabase = createSupabaseBrowserClient()

  return useSupabaseQuery(
    async () => {
      return await supabase.analytics.getCardAnalytics(cardId)
    },
    {
      immediate: true,
      refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
      onSuccess: (data) => {
        console.log(`${data?.length || 0} événements d'analytics`)
      }
    }
  )
}

// === EXEMPLES DE GESTION D'ERREURS ===

/**
 * Exemple 8: Gestion d'erreurs robuste
 */
export async function robustErrorHandlingExample() {
  const supabase = createSupabaseBrowserClient()

  try {
    // Tentative de connexion
    const { data: session, error: sessionError } = await supabase.auth.getCurrentSession()
    
    if (sessionError) {
      if (sessionError.message.includes('JWT')) {
        // Session expirée - rediriger vers la connexion
        window.location.href = '/fr/auth'
        return
      }
      
      if (sessionError.message.includes('network')) {
        // Erreur réseau - afficher un message et permettre le retry
        throw new Error('Problème de connexion. Vérifiez votre internet.')
      }
      
      // Autre erreur
      throw new Error('Erreur d\'authentification')
    }

    if (!session) {
      throw new Error('Utilisateur non connecté')
    }

    // Requête avec retry automatique
    const { data: user, error: userError } = await supabase.users.getProfile(session.user.id)
    
    if (userError) {
      throw new Error(userError)
    }

    return user

  } catch (error) {
    console.error('Erreur dans robustErrorHandlingExample:', error)
    
    // Gestion des erreurs selon le type
    if (error instanceof Error) {
      if (error.message.includes('permission')) {
        // Erreur de permissions
        console.error('Accès refusé')
      } else if (error.message.includes('not found')) {
        // Ressource non trouvée
        console.error('Ressource non trouvée')
      } else {
        // Erreur générique
        console.error('Erreur inattendue:', error.message)
      }
    }
    
    throw error
  }
}

// === EXEMPLES DE PERFORMANCE ===

/**
 * Exemple 9: Requêtes optimisées avec cache
 */
export function useOptimizedProductsExample() {
  const supabase = createSupabaseBrowserClient()

  return useSupabaseCachedQuery(
    async () => {
      return await supabase.products.getAll({
        limit: 50,
        inStock: true
      })
    },
    'products-in-stock',
    {
      cacheTime: 5 * 60 * 1000, // 5 minutes
      staleTime: 1 * 60 * 1000, // 1 minute
      immediate: true
    }
  )
}

/**
 * Exemple 10: Recherche avec debounce
 */
export function useSearchProductsExample() {
  const supabase = createSupabaseBrowserClient()
  const [searchTerm, setSearchTerm] = useState('')

  const queryFn = useCallback(async () => {
    if (!searchTerm.trim()) {
      return { data: null, error: null }
    }

    return await supabase.products.getAll({
      search: searchTerm,
      limit: 20
    })
  }, [searchTerm, supabase])

  const result = useSupabaseDebouncedQuery(queryFn, 300, {
    immediate: false
  })

  return {
    ...result,
    searchTerm,
    setSearchTerm
  }
}

// === EXEMPLES DE TESTS ===

/**
 * Exemple 11: Tests unitaires pour les fonctions Supabase
 */
export async function testSupabaseFunctions() {
  const supabase = createSupabaseBrowserClient()

  // Test de connexion
  console.log('Test de connexion...')
  const { data: session } = await supabase.auth.getCurrentSession()
  console.log('Session:', session ? 'Connecté' : 'Non connecté')

  // Test de récupération des produits
  console.log('Test de récupération des produits...')
  const { data: products, error: productsError } = await supabase.products.getAll({ limit: 5 })
  console.log('Produits:', productsError ? 'Erreur' : `${products?.length || 0} produits`)

  // Test de récupération des templates
  console.log('Test de récupération des templates...')
  const { data: templates, error: templatesError } = await supabase.cardTemplates.getAll()
  console.log('Templates:', templatesError ? 'Erreur' : `${templates?.length || 0} templates`)

  return {
    connected: !!session,
    productsCount: products?.length || 0,
    templatesCount: templates?.length || 0
  }
}

// === EXEMPLES D'INTÉGRATION ===

/**
 * Exemple 12: Intégration avec Zustand store
 */
export function useSupabaseWithZustand() {
  const supabase = createSupabaseBrowserClient()
  const { setUser, setCart } = useAppStore()

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const loadUser = async () => {
      const { data: session } = await supabase.auth.getCurrentSession()
      if (session?.user) {
        const { data: profile } = await supabase.users.getProfile(session.user.id)
        if (profile) {
          setUser(profile)
        }
      }
    }

    loadUser()
  }, [supabase, setUser])

  // Écouter les changements d'authentification
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase.users.getProfile(session.user.id)
          if (profile) {
            setUser(profile)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setCart(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, setUser, setCart])

  return { supabase }
}
