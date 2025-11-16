/**
 * Hook pour gérer les produits exposants
 */

'use client'

import { useEffect, useCallback } from 'react'
import { useFoireStore } from '@/lib/store/foire-store'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByExhibitor,
} from '@/lib/services/exhibitor-product.service'
import { useToast } from '@/components/ui/use-toast'
import type { CreateProductParams, UpdateProductParams } from '@/lib/services/exhibitor-product.service'

export function useProducts(exhibitorId: string | null) {
  const {
    products,
    isLoadingProducts,
    productsError,
    setProducts,
    addProduct,
    updateProduct: updateProductInStore,
    removeProduct,
    setLoadingProducts,
    setProductsError,
  } = useFoireStore()

  const { toast } = useToast()

  // Charger les produits
  const fetchProducts = useCallback(async () => {
    if (!exhibitorId) return

    setLoadingProducts(true)
    setProductsError(null)

    const { products: fetchedProducts, error } = await getProductsByExhibitor(exhibitorId)

    if (error) {
      setProductsError(error)
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: `Impossible de charger les produits: ${error}`,
      })
    } else {
      setProducts(fetchedProducts)
    }

    setLoadingProducts(false)
  }, [exhibitorId, setProducts, setLoadingProducts, setProductsError, toast])

  // Créer un produit
  const create = useCallback(
    async (params: CreateProductParams) => {
      if (!exhibitorId) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Aucun exposant sélectionné',
        })
        return null
      }

      setLoadingProducts(true)
      const result = await createProduct({ ...params, exhibitor_id: exhibitorId })

      if (result.error || !result.product) {
        setProductsError(result.error || 'Erreur inconnue')
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: result.error || 'Impossible de créer le produit',
        })
        setLoadingProducts(false)
        return null
      }

      addProduct(result.product)
      toast({
        title: 'Succès',
        description: 'Produit créé avec succès',
      })
      setLoadingProducts(false)
      return result.product
    },
    [exhibitorId, addProduct, setLoadingProducts, setProductsError, toast]
  )

  // Mettre à jour un produit
  const update = useCallback(
    async (params: UpdateProductParams) => {
      setLoadingProducts(true)
      const result = await updateProduct(params)

      if (result.error || !result.product) {
        setProductsError(result.error || 'Erreur inconnue')
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: result.error || 'Impossible de mettre à jour le produit',
        })
        setLoadingProducts(false)
        return null
      }

      updateProductInStore(params.product_id, result.product)
      toast({
        title: 'Succès',
        description: 'Produit mis à jour avec succès',
      })
      setLoadingProducts(false)
      return result.product
    },
    [updateProductInStore, setLoadingProducts, setProductsError, toast]
  )

  // Supprimer un produit
  const remove = useCallback(
    async (productId: string) => {
      setLoadingProducts(true)
      const result = await deleteProduct(productId)

      if (result.error || !result.success) {
        setProductsError(result.error || 'Erreur inconnue')
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: result.error || 'Impossible de supprimer le produit',
        })
        setLoadingProducts(false)
        return false
      }

      removeProduct(productId)
      toast({
        title: 'Succès',
        description: 'Produit supprimé avec succès',
      })
      setLoadingProducts(false)
      return true
    },
    [removeProduct, setLoadingProducts, setProductsError, toast]
  )

  // Toggle visibilité
  const toggleVisibility = useCallback(
    async (productId: string, isAvailable: boolean) => {
      return update({
        product_id: productId,
        updates: { is_available: !isAvailable },
      })
    },
    [update]
  )

  // Charger au montage et quand exhibitorId change
  useEffect(() => {
    if (exhibitorId) {
      fetchProducts()
    }
  }, [exhibitorId, fetchProducts])

  return {
    products,
    isLoadingProducts,
    productsError,
    fetchProducts,
    create,
    update,
    remove,
    toggleVisibility,
  }
}

