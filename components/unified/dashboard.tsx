"use client";

import { useUnifiedStore } from "@/lib/store/unified";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePrice } from "@/lib/hooks/use-price";
import {
  CreditCard,
  Package,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

export function UnifiedDashboard() {
  const { profile, recentCards, recommendedProducts } = useUnifiedStore();

  if (!profile) {
    return (
      <div className="p-8 text-center animate-fade-in-up">
        <p>Connectez-vous pour accéder à votre tableau de bord</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between animate-fade-in-up">
        <h1 className="text-2xl font-bold animate-fade-in-up">Tableau de bord</h1>
        <Button className="bg-primary-orange hover:bg-primary-orange/90 animate-fade-in-up">
          <Plus className="h-4 w-4 mr-2 animate-fade-in-up" />
          Nouvelle carte
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3 animate-fade-in-up">
        <Card className="p-6 animate-fade-in-up">
          <div className="flex items-center justify-between animate-fade-in-up">
            <div>
              <p className="text-sm font-medium text-gray-500 animate-fade-in-up">Cartes actives</p>
              <h3 className="text-2xl font-bold mt-2 animate-fade-in-up">{profile.cards.length}</h3>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center animate-fade-in-up">
              <CreditCard className="h-6 w-6 text-primary animate-fade-in-up" />
            </div>
          </div>
        </Card>

        <Card className="p-6 animate-fade-in-up">
          <div className="flex items-center justify-between animate-fade-in-up">
            <div>
              <p className="text-sm font-medium text-gray-500 animate-fade-in-up">Commandes</p>
              <h3 className="text-2xl font-bold mt-2 animate-fade-in-up">{profile.orders.length}</h3>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center animate-fade-in-up">
              <Package className="h-6 w-6 text-primary animate-fade-in-up" />
            </div>
          </div>
        </Card>

        <Card className="p-6 animate-fade-in-up">
          <div className="flex items-center justify-between animate-fade-in-up">
            <div>
              <p className="text-sm font-medium text-gray-500 animate-fade-in-up">Total dépensé</p>
              <h3 className="text-2xl font-bold mt-2 animate-fade-in-up">
                {usePrice({
                  amount: profile.orders.reduce((total, order) => total + order.total, 0),
                }).formatted}
              </h3>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center animate-fade-in-up">
              <TrendingUp className="h-6 w-6 text-primary animate-fade-in-up" />
            </div>
          </div>
        </Card>
      </div>

      {/* Cartes récentes */}
      <section>
        <div className="flex items-center justify-between mb-4 animate-fade-in-up">
          <h2 className="text-xl font-semibold animate-fade-in-up">Cartes récentes</h2>
          <Link href="/dashboard/cards">
            <Button variant="ghost" className="text-primary animate-fade-in-up">
              Voir tout
              <ArrowRight className="h-4 w-4 ml-2 animate-fade-in-up" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3 animate-fade-in-up">
          {recentCards.map((card, index) => (
            <div
              key={card.id}
            >
              <Card className="p-6 animate-fade-in-up">
                <div className={`h-32 rounded-lg mb-4 ${card.color}`} />
                <h3 className="font-semibold animate-fade-in-up">{card.name}</h3>
                <p className="text-sm text-gray-600 animate-fade-in-up">
                  Créée le {new Date(card.createdAt).toLocaleDateString()}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Recommandations */}
      <section>
        <div className="flex items-center justify-between mb-4 animate-fade-in-up">
          <h2 className="text-xl font-semibold animate-fade-in-up">Recommandations</h2>
          <Link href="/products">
            <Button variant="ghost" className="text-primary animate-fade-in-up">
              Voir tout
              <ArrowRight className="h-4 w-4 ml-2 animate-fade-in-up" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-4 animate-fade-in-up">
          {recommendedProducts.map((product, index) => (
            <div
              key={product.id}
            >
              <Card className="p-4 animate-fade-in-up">
                <div className="aspect-square rounded-lg overflow-hidden mb-4 animate-fade-in-up">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover animate-fade-in-up"
                  />
                </div>
                <h3 className="font-semibold animate-fade-in-up">{product.name}</h3>
                <p className="text-sm text-gray-600 animate-fade-in-up">
                  {usePrice({ amount: product.price }).formatted}
                </p>
                <Button
                  className="w-full mt-4 bg-primary-orange hover:bg-primary-orange/90 animate-fade-in-up"
                >
                  Ajouter au panier
                </Button>
              </Card>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
