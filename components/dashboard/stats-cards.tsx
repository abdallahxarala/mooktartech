"use client";

import { Card } from "@/components/ui/card";
import { Eye, UserPlus, QrCode } from "lucide-react";

const stats = [
  {
    title: "Vues totales",
    value: "285",
    change: "+12%",
    icon: Eye,
  },
  {
    title: "Contacts ajoutés",
    value: "16",
    change: "+4",
    icon: UserPlus,
  },
  {
    title: "Scan QR code",
    value: "68",
    change: "+9%",
    icon: QrCode,
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-orange-light text-primary-orange">
              {stat.change}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
