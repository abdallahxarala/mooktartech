"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalyticsMapProps {
  dateRange: [Date, Date];
}

interface RegionData {
  name: string;
  views: number;
  contacts: number;
}

const regions: RegionData[] = [
  { name: "Dakar", views: 245, contacts: 18 },
  { name: "Thiès", views: 120, contacts: 8 },
  { name: "Saint-Louis", views: 85, contacts: 6 },
  { name: "Kaolack", views: 65, contacts: 4 },
];

export function AnalyticsMap({ dateRange }: AnalyticsMapProps) {
  return (
    <div className="space-y-4">
      <div className="aspect-[4/3] bg-gray-100 rounded-lg relative">
        {/* Placeholder pour la carte - À remplacer par une vraie carte interactive */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Carte du Sénégal
        </div>
      </div>

      <div className="grid gap-2">
        {regions.map((region) => (
          <Card key={region.name} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{region.name}</h4>
                <p className="text-sm text-gray-500">
                  {region.contacts} contacts
                </p>
              </div>
              <Badge variant="secondary">
                {region.views} vues
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
