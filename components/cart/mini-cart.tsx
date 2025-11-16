"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { usePrice } from "@/lib/hooks/use-price";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export function MiniCart() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { locale } = useParams();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Ne pas calculer le total avant le montage pour éviter l'hydration mismatch
  const { formatted: total } = usePrice({ amount: mounted ? getTotal() : 0 });

  // Ne pas afficher le badge avant le montage pour éviter l'hydration mismatch
  const itemCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingBag className="h-5 w-5" />
        {mounted && itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary-orange text-white text-xs flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Votre panier</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {!mounted || items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 text-center mb-4">
                    Votre panier est vide
                  </p>
                  <Link href={`/${locale}/products`}>
                    <Button
                      className="bg-primary-orange hover:bg-primary-orange/90"
                      onClick={() => setIsOpen(false)}
                    >
                      Découvrir nos produits
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {items.map((item) => {
                        const { formatted: price } = usePrice({ amount: item.price * item.quantity });
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg"
                          >
                            <div className="w-20 h-20 bg-white rounded-md overflow-hidden">
                              {item.mainImage || item.image ? (
                                <img
                                  src={item.mainImage || item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">📦</div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-600">{price}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    updateQuantity(item.productId, Math.max(0, item.quantity - 1))
                                  }
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  disabled={item.stock !== undefined && item.quantity >= item.stock}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              onClick={() => removeItem(item.productId)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4 border-t bg-gray-50">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Total</span>
                        <span className="font-semibold">{total}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link href={`/${locale}/cart`} className="block">
                        <Button
                          className="w-full bg-primary-orange hover:bg-primary-orange/90"
                          onClick={() => setIsOpen(false)}
                        >
                          Voir le panier
                        </Button>
                      </Link>
                      <Link href={`/${locale}/checkout`} className="block">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          Commander
                        </Button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
