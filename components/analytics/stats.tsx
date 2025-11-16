"use client";

import { Card } from "@/components/ui/card";
import { Eye, UserPlus, QrCode, TrendingUp } from "lucide-react";

interface AnalyticsStatsProps {
  dateRange: [Date, Date];
}

export function AnalyticsStats({ dateRange }: AnalyticsStatsProps) {
  const stats = [
    {
      title: "Vues totales",
      value: "285",
      change: "+12%",
      trend: "up",
      icon: Eye,
    },
    {
      title: "Nouveaux contacts",
      value: "24",
      change: "+4",
      trend: "up",
      icon: UserPlus,
    },
    {
      title: "Scans QR code",
      value: "68",
      change: "+9%",
      trend: "up",
      icon: QrCode,
    },
    {
      title: "Taux de conversion",
      value: "8.4%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
        >
          <Card className="p-6 animate-fade-in-up">
            <div className="flex items-center justify-between animate-fade-in-up">
              <div>
                <p className="text-sm font-medium text-gray-500 animate-fade-in-up">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold mt-2 animate-fade-in-up">{stat.value}</h3>
                <div className="mt-2 animate-fade-in-up">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    stat.trend === "up"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
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
      ))}
    </div>
  );
}
