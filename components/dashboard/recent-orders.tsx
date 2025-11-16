"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePrice } from "@/lib/hooks/use-price";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Package, ChevronRight } from "lucide-react";

const orders = [
  {
    id: "ORD-2024-001",
    date: "2024-03-20T10:00:00Z",
    status: "completed",
    total: 29990,
    items: [
      {
        name: "Carte NFC Premium",
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "2024-03-19T15:30:00Z",
    status: "processing",
    total: 49990,
    items: [
      {
        name: "Lot de 100 cartes PVC",
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-2024-003",
    date: "2024-03-18T09:15:00Z",
    status: "pending",
    total: 799990,
    items: [
      {
        name: "Imprimante XS-2000 Pro",
        quantity: 1,
      },
    ],
  },
];

const statusColors = {
  completed: "bg-green-500",
  processing: "bg-blue-500",
  pending: "bg-yellow-500",
  cancelled: "bg-red-500",
};

const statusLabels = {
  completed: "Complété",
  processing: "En cours",
  pending: "En attente",
  cancelled: "Annulé",
};

export function RecentOrders() {
  return (
    <Card className="p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <h2 className="text-lg font-semibold animate-fade-in-up">Commandes récentes</h2>
        <Button variant="outline" size="sm">
          Voir tout
          <ChevronRight className="ml-2 h-4 w-4 animate-fade-in-up" />
        </Button>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        {orders.map((order, index) => {
          const { formatted: total } = usePrice({ amount: order.total });
          
          return (
            <div
              key={order.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-fade-in-up"
            >
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center animate-fade-in-up">
                <Package className="h-5 w-5 text-primary animate-fade-in-up" />
              </div>

              <div className="flex-1 animate-fade-in-up">
                <div className="flex items-center justify-between animate-fade-in-up">
                  <h3 className="font-medium animate-fade-in-up">{order.id}</h3>
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </Badge>
                </div>

                <div className="mt-1 text-sm text-gray-600 animate-fade-in-up">
                  {order.items.map((item) => (
                    <div key={item.name}>
                      {item.quantity}x {item.name}
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex items-center justify-between text-sm animate-fade-in-up">
                  <span className="text-gray-500 animate-fade-in-up">
                    {format(new Date(order.date), "PPp", { locale: fr })}
                  </span>
                  <span className="font-medium animate-fade-in-up">{total}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
