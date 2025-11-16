"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Search,
  Plus,
  Filter,
} from "lucide-react";

const stats = [
  {
    title: "Commandes totales",
    value: "156",
    change: "+12%",
    icon: ShoppingBag,
  },
  {
    title: "Produits actifs",
    value: "24",
    change: "+3",
    icon: Package,
  },
  {
    title: "Chiffre d'affaires",
    value: "4,320€",
    change: "+8%",
    icon: DollarSign,
  },
  {
    title: "Taux de conversion",
    value: "3.2%",
    change: "+0.8%",
    icon: TrendingUp,
  },
];

export function ShopManager() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Boutique</h1>
        <Button className="bg-primary-orange hover:bg-primary-orange/90">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau produit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                {stat.change && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher un produit..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="cards">Cartes NFC</SelectItem>
                  <SelectItem value="readers">Lecteurs</SelectItem>
                  <SelectItem value="accessories">Accessoires</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center py-12 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Aucun produit pour le moment</p>
            <p className="text-sm">Commencez par ajouter des produits à votre boutique</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
