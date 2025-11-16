"use client";

// Base product interface
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  rating?: number;
  reviews?: number;
  features: string[];
  specs?: ProductSpecs;
  warranty?: ProductWarranty;
  shipping?: ProductShipping;
}

// Product specifications
export interface ProductSpecs {
  [category: string]: {
    [key: string]: string;
  };
}

// Product warranty information
export interface ProductWarranty {
  duration: string;
  coverage: string;
  support: string;
}

// Product shipping information
export interface ProductShipping {
  time: string;
  cost: number;
  zones: string[];
  international: boolean;
}

// Props for the Server Component
export interface ProductsPageProps {
  products: Product[];
  categories: string[];
  locale: string;
}

// Props for the Client Component
export interface ProductsClientProps {
  products: Product[];
  categories: string[];
  initialFilters?: ProductFilters;
}

// Filter and sort types
export interface ProductFilters {
  categories: string[];
  priceRange: [number, number];
  availability?: "all" | "in-stock" | "out-of-stock";
  rating?: number;
}

export type SortOption = "newest" | "price-asc" | "price-desc" | "popularity" | "rating";

export interface ProductSortOptions {
  field: keyof Product | "createdAt";
  direction: "asc" | "desc";
}

// View mode type
export type ViewMode = "grid" | "list";

// Props for product catalog component
export interface ProductCatalogProps {
  viewMode: ViewMode;
  sortBy: SortOption;
  selectedCategories: string[];
  priceRange: [number, number];
  onViewModeChange: (mode: ViewMode) => void;
  onSortChange: (sort: SortOption) => void;
}

// Props for product filters component
export interface ProductFiltersProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

// Props for product card component
export interface ProductCardProps {
  product: Product;
  viewMode: ViewMode;
  onAddToCart: (product: Product) => void;
}

// Props for product gallery component
export interface ProductGalleryProps {
  images: string[];
  alt?: string;
}

// Props for product specs component
export interface ProductSpecsProps {
  specs: ProductSpecs;
}

// Props for related products component
export interface RelatedProductsProps {
  category: string;
  currentProductId: number;
  limit?: number;
}