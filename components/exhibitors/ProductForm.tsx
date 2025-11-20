'use client'

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ProductCard, type ExhibitorProduct } from "./ProductCard";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(Number(value)), { message: "Montant invalide" }),
  currency: z.string().default("XOF"),
  tags: z.string().optional(),
  stockQuantity: z
    .string()
    .optional()
    .refine((value) => !value || Number.isInteger(Number(value)), {
      message: "Quantité invalide"
    }),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  images: z.array(z.object({ url: z.string().url().optional() })).optional()
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      currency: "XOF",
      isAvailable: true,
      isFeatured: false,
      images: [{ url: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images"
  });

  const handleSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const newProduct: ExhibitorProduct = {
        id: crypto.randomUUID(),
        name: values.name,
        description: values.description,
        price: values.price ? Number(values.price) : undefined,
        currency: values.currency,
        featured: values.isFeatured,
        tags: values.tags?.split(",").map((tag) => tag.trim()),
        featuredImage: values.images?.[0]?.url
      };

      // Émettre un événement personnalisé pour notifier le parent (sérialisable)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('productAdded', { detail: newProduct })
        );
      }

      // Réinitialiser le formulaire après succès
      form.reset();
      console.log("✅ Produit enregistré", newProduct);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du produit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du produit</Label>
          <Input id="name" placeholder="Badge NFC Premium" {...form.register("name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Prix</Label>
          <Input id="price" placeholder="50000" {...form.register("price")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Devise</Label>
          <Input id="currency" placeholder="XOF" {...form.register("currency")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stockQuantity">Stock disponible</Label>
          <Input id="stockQuantity" placeholder="25" {...form.register("stockQuantity")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            placeholder="Décrivez les fonctionnalités, matériaux, options..."
            {...form.register("description")}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
          <Input id="tags" placeholder="NFC, Premium, Accessoire" {...form.register("tags")} />
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Label>Images</Label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                placeholder="https://..."
                {...form.register(`images.${index}.url` as const)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => append({ url: "" })}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une image
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Produit visible</h3>
              <p className="text-xs text-slate-500">
                Masquez le produit tout en le conservant dans votre catalogue.
              </p>
            </div>
            <Switch
              checked={form.watch("isAvailable")}
              onCheckedChange={(checked) => form.setValue("isAvailable", checked)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Mettre en avant</h3>
              <p className="text-xs text-slate-500">
                Affiche ce produit en priorité sur la boutique publique.
              </p>
            </div>
            <Switch
              checked={form.watch("isFeatured")}
              onCheckedChange={(checked) => form.setValue("isFeatured", checked)}
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : "Enregistrer le produit"}
      </Button>
    </form>
  );
}

export function ProductManager() {
  const [products, setProducts] = useState<ExhibitorProduct[]>([
    {
      id: "product-1",
      name: "Badge NFC Premium",
      description: "Badge personnalisé avec impression UV et encapsulation haute résistance.",
      price: 50000,
      currency: "XOF",
      featured: true,
      tags: ["NFC", "Premium", "Badge"]
    }
  ]);

  // Écouter l'événement personnalisé pour mettre à jour la liste des produits
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleProductAdded = (event: Event) => {
      const customEvent = event as CustomEvent<ExhibitorProduct>;
      if (customEvent.detail) {
        setProducts((prev) => [customEvent.detail, ...prev]);
      }
    };

    window.addEventListener('productAdded', handleProductAdded);
    return () => {
      window.removeEventListener('productAdded', handleProductAdded);
    };
  }, []);

  const baseHref = "/expo/demo-event/xarala-tech-lab";

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Nouveau produit</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            href={`${baseHref}/${product.id}`}
          />
        ))}
      </div>
    </div>
  );
}

