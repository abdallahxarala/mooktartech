"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Pencil, Copy, Trash } from "lucide-react";

const cards = [
  {
    id: 1,
    title: "Carte Professionnelle",
    lastModified: "2024-03-15",
    color: "bg-primary",
  },
  {
    id: 2,
    title: "Carte Événement",
    lastModified: "2024-03-14",
    color: "bg-primary-orange",
  },
  {
    id: 3,
    title: "Carte Personnelle",
    lastModified: "2024-03-13",
    color: "bg-blue-500",
  },
];

export function VirtualCardsGrid() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Vos cartes virtuelles</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.id} className="group relative overflow-hidden">
            <div className={`h-40 ${card.color} rounded-t-lg p-6 text-white`}>
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="text-sm opacity-80">
                Modifié le {new Date(card.lastModified).toLocaleDateString()}
              </p>
            </div>
            <div className="p-4 flex items-center justify-between">
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Éditer
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Dupliquer
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}

        <Button
          variant="outline"
          className="h-[232px] border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <Plus className="h-6 w-6 mr-2" />
          Nouvelle carte
        </Button>
      </div>
    </div>
  );
}
