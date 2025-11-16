"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/lib/store/cart";
import { usePrice } from "@/lib/hooks/use-price";
import { useInView } from "react-intersection-observer";
import { LayoutGrid, List, ShoppingCart, Star, Clock, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { Product, ViewMode, SortOption } from "@/lib/types/product";

interface ProductCatalogProps {
  products?: Product[];
  viewMode: ViewMode;
  sortBy: SortOption;
  currentPage: number;
  totalPages: number;
  onViewModeChange: (mode: ViewMode) => void;
  onSortChange: (sort: SortOption) => void;
  onPageChange: (page: number) => void;
  translations?: Record<string, any>;
  locale: string;
  connectionSpeed: string;
}

export const ProductCatalog = memo(function ProductCatalog({
  products = [], // Provide default empty array
  viewMode,
  sortBy,
  currentPage,
  totalPages,
  onViewModeChange,
  onSortChange,
  onPageChange,
  translations = {}, // Provide default empty object
  locale,
  connectionSpeed,
}: ProductCatalogProps) {
  const { addItem } = useCartStore();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Determine image quality based on connection speed
  const imageQuality = connectionSpeed === "4g" ? 75 : 50;
  const loadingStrategy = connectionSpeed === "4g" ? "eager" : "lazy";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const sortOptions = {
    newest: translations?.sort?.newest || "Plus récents",
    "price-asc": translations?.sort?.priceAsc || "Prix croissant",
    "price-desc": translations?.sort?.priceDesc || "Prix décroissant", 
    popularity: translations?.sort?.popularity || "Popularité"
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <p className="text-gray-500 animate-fade-in-up">{translations?.empty || "Aucun produit trouvé"}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[200px] animate-fade-in-up">
            <SelectValue placeholder={translations?.sort?.title || "Trier par"} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(sortOptions).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2 animate-fade-in-up">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("grid")}
          >
            <LayoutGrid className="h-4 w-4 animate-fade-in-up" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("list")}
          >
            <List className="h-4 w-4 animate-fade-in-up" />
          </Button>
        </div>
      </div>

      <div
        ref={ref}
        initial="hidden"
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
            onAddToCart={addItem}
            translations={translations}
            imageQuality={imageQuality}
            loadingStrategy={loadingStrategy}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2 animate-fade-in-up">
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
});

const ProductCard = memo(function ProductCard({
  product,
  viewMode,
  onAddToCart,
  translations = {}, // Provide default empty object
  imageQuality,
  loadingStrategy,
}: {
  product: Product;
  viewMode: ViewMode;
  onAddToCart: (item: any) => void;
  translations?: Record<string, any>;
  imageQuality: number;
  loadingStrategy: "eager" | "lazy";
}) {
  const { formatted: price } = usePrice({ amount: product.price });

  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${
        viewMode === "list" ? "flex" : ""
      }`}
    >
      <div
        className={`relative ${
          viewMode === "list" ? "w-48" : "aspect-square w-full"
        }`}
      >
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover animate-fade-in-up"
          quality={imageQuality}
          loading={loadingStrategy}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIB4gHh4eIB0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
        {product.stock > 0 ? (
          <Badge className="absolute top-2 right-2 bg-green-500 animate-fade-in-up">
            {translations?.inStock || "En stock"}
          </Badge>
        ) : (
          <Badge className="absolute top-2 right-2 bg-orange-500 animate-fade-in-up">
            {translations?.onOrder || "Sur commande"}
          </Badge>
        )}
      </div>

      <div className="p-4 flex-1 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-2 animate-fade-in-up">
          <h3 className="font-semibold animate-fade-in-up">{product.name}</h3>
          {product.rating && (
            <div className="flex items-center animate-fade-in-up">
              <Star className="h-4 w-4 text-yellow-400 fill-current animate-fade-in-up" />
              <span className="ml-1 text-sm animate-fade-in-up">{product.rating}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 animate-fade-in-up">{product.description}</p>

        <div className="space-y-4 animate-fade-in-up">
          {viewMode === "list" && product.features && (
            <ul className="space-y-2 animate-fade-in-up">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm animate-fade-in-up">
                  <Shield className="h-4 w-4 text-primary-orange animate-fade-in-up" />
                  {feature}
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-between animate-fade-in-up">
            <div>
              <div className="text-2xl font-bold text-primary-orange animate-fade-in-up">
                {price}
              </div>
              {product.stock > 0 && (
                <div className="text-sm text-gray-500 flex items-center gap-1 animate-fade-in-up">
                  <Clock className="h-4 w-4 animate-fade-in-up" />
                  {translations?.shipping?.time || "Livraison 24-48h"}
                </div>
              )}
            </div>
            <Button
              onClick={() => onAddToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.mainImage || product.images?.[0],
                brand: product.brand,
                slug: product.slug,
                shortDescription: product.shortDescription,
                stock: product.stock,
                mainImage: product.mainImage,
              })}
              className="bg-primary-orange hover:bg-primary-orange/90 animate-fade-in-up"
            >
              <ShoppingCart className="h-4 w-4 mr-2 animate-fade-in-up" />
              {translations?.addToCart || "Ajouter au panier"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
