/**
 * Formulaire d'ajout/édition de produit avec IA
 */

'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
// Temporarily disabled due to build error
// import { ImageUpload } from '@/components/ui/image-upload'
import { useProductAI } from '@/lib/hooks/use-product-ai'
// Temporarily disabled - requires server component
// import { useProducts } from '@/lib/hooks/use-products'
import { useFoireStore } from '@/lib/store/foire-store'
import { Sparkles, Loader2, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import type { ExhibitorProduct } from '@/lib/types/exhibitor-product'

const productSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  price: z.number().nullable(),
  currency: z.enum(['XOF', 'EUR', 'USD']).default('XOF'),
  price_on_request: z.boolean().default(false),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  stock_quantity: z.number().nullable(),
  unlimited_stock: z.boolean().default(true),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  images: z.array(z.string()).default([]),
  featured_image: z.string().nullable(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  exhibitorId: string
  product?: ExhibitorProduct | null
  onSuccess?: () => void
}

export function ProductForm({ exhibitorId, product, onSuccess }: ProductFormProps) {
  const { isProductFormOpen, closeProductForm } = useFoireStore()
  // Temporarily disabled - requires server component
  // const { create, update } = useProducts(exhibitorId)
  const create = async () => ({ error: null })
  const update = async () => ({ error: null })
  const { generateDescription, isGenerating } = useProductAI()
  const { toast } = useToast()

  const [images, setImages] = useState<string[]>(product?.images || [])
  const [featuredImage, setFeaturedImage] = useState<string | null>(
    product?.featured_image || null
  )

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price ? Number(product.price) : null,
      currency: (product?.currency as 'XOF' | 'EUR' | 'USD') || 'XOF',
      price_on_request: product?.price_on_request || false,
      category: product?.category || '',
      tags: product?.tags || [],
      stock_quantity: product?.stock_quantity ? Number(product.stock_quantity) : null,
      unlimited_stock: product?.unlimited_stock ?? true,
      is_available: product?.is_available ?? true,
      is_featured: product?.is_featured || false,
      images: images,
      featured_image: featuredImage,
    },
  })

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description || '',
        price: product.price ? Number(product.price) : null,
        currency: (product.currency as 'XOF' | 'EUR' | 'USD') || 'XOF',
        price_on_request: product.price_on_request || false,
        category: product.category || '',
        tags: product.tags || [],
        stock_quantity: product.stock_quantity ? Number(product.stock_quantity) : null,
        unlimited_stock: product.unlimited_stock ?? true,
        is_available: product.is_available ?? true,
        is_featured: product.is_featured || false,
        images: product.images || [],
        featured_image: product.featured_image || null,
      })
      setImages(product.images || [])
      setFeaturedImage(product.featured_image || null)
    }
  }, [product, form])

  const handleGenerateDescription = async () => {
    const productName = form.getValues('name')
    if (!productName) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez d\'abord saisir le nom du produit',
      })
      return
    }

    const description = await generateDescription({
      productName,
      images,
      category: form.getValues('category'),
    })

    if (description) {
      form.setValue('description', description)
      toast({
        title: 'Succès',
        description: 'Description générée avec succès',
      })
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (product) {
        await update({
          product_id: product.id,
          updates: {
            ...data,
            images,
            featured_image: featuredImage,
          },
        })
      } else {
        await create({
          exhibitor_id: exhibitorId,
          ...data,
          images,
          featured_image: featuredImage || undefined,
        })
      }

      onSuccess?.()
      closeProductForm()
      form.reset()
      setImages([])
      setFeaturedImage(null)
    } catch (error) {
      console.error('Error submitting product:', error)
    }
  }

  const addImage = (url: string) => {
    if (!images.includes(url)) {
      const newImages = [...images, url]
      setImages(newImages)
      if (!featuredImage) {
        setFeaturedImage(url)
      }
    }
  }

  const removeImage = (url: string) => {
    setImages(images.filter((img) => img !== url))
    if (featuredImage === url) {
      setFeaturedImage(images.length > 1 ? images[0] : null)
    }
  }

  return (
    <Dialog open={isProductFormOpen} onOpenChange={closeProductForm}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {product ? 'Modifier le produit' : 'Nouveau produit'}
          </DialogTitle>
          <DialogDescription>
            {product
              ? 'Modifiez les informations de votre produit'
              : 'Ajoutez un nouveau produit à votre boutique'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Nom */}
          <div>
            <Label htmlFor="name">Nom du produit *</Label>
            <Input
              id="name"
              {...form.register('name')}
              className="mt-1"
              placeholder="Ex: Produit XYZ"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Images */}
          <div>
            <Label>Images du produit</Label>
            <div className="mt-2 space-y-4">
              {/* Temporarily disabled due to build error */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    // TODO: Implement file upload
                    console.log('File selected:', file.name)
                  }
                }}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg"
              />
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((url) => (
                    <div key={url} className="relative group">
                      <img
                        src={url}
                        alt="Product"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      {featuredImage === url && (
                        <div className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                          Principale
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                        onClick={() => removeImage(url)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      {featuredImage !== url && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100"
                          onClick={() => setFeaturedImage(url)}
                        >
                          Définir principale
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description avec IA */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="description">Description *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={isGenerating || !form.watch('name')}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer avec IA
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="description"
              {...form.register('description')}
              className="min-h-[120px]"
              placeholder="Décrivez votre produit..."
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Prix */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Prix</Label>
              <Input
                id="price"
                type="number"
                {...form.register('price', { valueAsNumber: true })}
                className="mt-1"
                placeholder="0"
                disabled={form.watch('price_on_request')}
              />
            </div>
            <div>
              <Label htmlFor="currency">Devise</Label>
              <Select
                value={form.watch('currency')}
                onValueChange={(value) => form.setValue('currency', value as 'XOF' | 'EUR' | 'USD')}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XOF">XOF (Franc CFA)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="USD">USD (Dollar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="price_on_request"
              checked={form.watch('price_on_request')}
              onCheckedChange={(checked) => form.setValue('price_on_request', checked)}
            />
            <Label htmlFor="price_on_request">Prix sur demande</Label>
          </div>

          {/* Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock_quantity">Quantité en stock</Label>
              <Input
                id="stock_quantity"
                type="number"
                {...form.register('stock_quantity', { valueAsNumber: true })}
                className="mt-1"
                placeholder="0"
                disabled={form.watch('unlimited_stock')}
              />
            </div>
            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Switch
                  id="unlimited_stock"
                  checked={form.watch('unlimited_stock')}
                  onCheckedChange={(checked) => form.setValue('unlimited_stock', checked)}
                />
                <Label htmlFor="unlimited_stock">Stock illimité</Label>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_available"
                checked={form.watch('is_available')}
                onCheckedChange={(checked) => form.setValue('is_available', checked)}
              />
              <Label htmlFor="is_available">Produit visible</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={form.watch('is_featured')}
                onCheckedChange={(checked) => form.setValue('is_featured', checked)}
              />
              <Label htmlFor="is_featured">Mettre en avant</Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={closeProductForm}>
              Annuler
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              {product ? 'Enregistrer les modifications' : 'Créer le produit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

