/**
 * Liste des produits avec actions
 */

'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { useProducts } from '@/lib/hooks/use-products'
import { useFoireStore } from '@/lib/store/foire-store'
import {
  MoreVertical,
  Edit,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Image from 'next/image'
import type { ExhibitorProduct } from '@/lib/types/exhibitor-product'

interface ProductListProps {
  exhibitorId: string
}

export function ProductList({ exhibitorId }: ProductListProps) {
  const { products, isLoadingProducts, toggleVisibility, remove } = useProducts(exhibitorId)
  const { openProductForm } = useFoireStore()
  const { toast } = useToast()
  const [productToDelete, setProductToDelete] = useState<ExhibitorProduct | null>(null)

  const handleDuplicate = async (product: ExhibitorProduct) => {
    const duplicatedProduct = {
      ...product,
      name: `${product.name} (Copie)`,
      is_featured: false,
    }
    delete (duplicatedProduct as any).id
    delete (duplicatedProduct as any).created_at
    delete (duplicatedProduct as any).updated_at

    // TODO: Créer le produit dupliqué via le service
    toast({
      title: 'Info',
      description: 'Fonctionnalité de duplication à implémenter',
    })
  }

  const handleDelete = async () => {
    if (!productToDelete) return

    const success = await remove(productToDelete.id)
    if (success) {
      setProductToDelete(null)
    }
  }

  if (isLoadingProducts) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">Aucun produit pour le moment</p>
        <Button onClick={() => openProductForm()} className="bg-orange-500 hover:bg-orange-600">
          Ajouter un produit
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.featured_image ? (
                    <Image
                      src={product.featured_image}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-[60px] h-[60px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-semibold">{product.name}</div>
                    {product.category && (
                      <div className="text-sm text-gray-500">{product.category}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {product.price_on_request ? (
                    <Badge variant="outline">Sur demande</Badge>
                  ) : product.price ? (
                    <span className="font-semibold">
                      {Number(product.price).toLocaleString()} {product.currency}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {product.unlimited_stock ? (
                    <Badge variant="outline">Illimité</Badge>
                  ) : (
                    <span>{product.stock_quantity || 0}</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={product.is_available}
                      onCheckedChange={() =>
                        toggleVisibility(product.id, product.is_available)
                      }
                    />
                    <Badge variant={product.is_available ? 'default' : 'secondary'}>
                      {product.is_available ? 'Visible' : 'Masqué'}
                    </Badge>
                    {product.is_featured && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700">
                        En vedette
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openProductForm(product)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Éditer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(product)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Dupliquer
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toggleVisibility(product.id, product.is_available)}
                      >
                        {product.is_available ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Masquer
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Afficher
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setProductToDelete(product)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmation suppression */}
      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{productToDelete?.name}" ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

