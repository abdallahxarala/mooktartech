"use client";

import { Card } from "@/components/ui/card";
import { usePrice } from "@/lib/hooks/use-price";
import {
  Eye,
  UserPlus,
  QrCode,
  CreditCard,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Vues totales",
    value: "285",
    change: "+12%",
    trend: "up",
    icon: Eye,
  },
  {
    title: "Contacts ajoutés",
    value: "16",
    change: "+4",
    trend: "up",
    icon: UserPlus,
  },
  {
    title: "Scan QR code",
    value: "68",
    change: "+9%",
    trend: "up",
    icon: QrCode,
  },
  {
    title: "Cartes actives",
    value: "3",
    change: "0",
    trend: "neutral",
    icon: CreditCard,
  },
  {
    title: "Revenus",
    value: "125000",
    change: "+15%",
    trend: "up",
    icon: TrendingUp,
    isPrice: true,
  },
  {
    title: "Visiteurs uniques",
    value: "142",
    change: "+7%",
    trend: "up",
    icon: Users,
  },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
      {stats.map((stat, index) => {
        const value = stat.isPrice 
          ? usePrice({ amount: parseInt(stat.value) }).formatted
          : stat.value;

        return (
          <div
            key={stat.title}
          >
            <Card className="p-6 animate-fade-in-up">
              <div className="flex items-center justify-between animate-fade-in-up">
                <div>
                  <p className="text-sm font-medium text-gray-500 animate-fade-in-up">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-2 animate-fade-in-up">{value}</h3>
                  <div className="mt-2 animate-fade-in-up">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      stat.trend === "up" 
                        ? "bg-green-100 text-green-800"
                        : stat.trend === "down"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center animate-fade-in-up">
                  <stat.icon className="h-6 w-6 text-primary animate-fade-in-up" />
                </div>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
