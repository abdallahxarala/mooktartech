"use client";

import { Card } from "@/components/ui/card";
import { Users, UserPlus, Share2 } from "lucide-react";

const stats = [
  {
    title: "Total des contacts",
    value: "256",
    icon: Users,
  },
  {
    title: "Nouveaux contacts (7j)",
    value: "24",
    change: "+12%",
    icon: UserPlus,
  },
  {
    title: "Sources principales",
    value: "Carte Pro",
    subtext: "45% des contacts",
    icon: Share2,
  },
];

export function ContactStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
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
              {stat.subtext && (
                <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
              )}
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
