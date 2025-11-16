"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
} from "lucide-react";

interface AnalyticsInsightsProps {
  dateRange: [Date, Date];
}

export function AnalyticsInsights({ dateRange }: AnalyticsInsightsProps) {
  const insights = [
    {
      type: "improvement",
      title: "Augmentation du taux de conversion",
      description: "Votre taux de conversion a augmenté de 2.1% cette semaine",
      metric: "+2.1%",
      action: "Voir les détails",
      icon: TrendingUp,
    },
    {
      type: "warning",
      title: "Baisse des scans le weekend",
      description: "Les scans diminuent de 30% pendant les weekends",
      metric: "-30%",
      action: "Analyser",
      icon: TrendingDown,
    },
    {
      type: "suggestion",
      title: "Optimisation mobile recommandée",
      description: "40% de vos visiteurs utilisent des appareils mobiles",
      metric: "40%",
      action: "Optimiser",
      icon: Lightbulb,
    },
    {
      type: "alert",
      title: "Pics de trafic non exploités",
      description: "Vous avez des pics de trafic entre 10h et 14h",
      metric: "3x",
      action: "Voir les horaires",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="grid gap-4 md:grid-cols-2 animate-fade-in-up">
        {insights.map((insight, index) => (
          <div
            key={insight.title}
          >
            <Card className="p-6 animate-fade-in-up">
              <div className="flex items-start gap-4 animate-fade-in-up">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  {
                    improvement: "bg-green-100 text-green-600",
                    warning: "bg-yellow-100 text-yellow-600",
                    suggestion: "bg-blue-100 text-blue-600",
                    alert: "bg-red-100 text-red-600",
                  }[insight.type]
                }`}>
                  <insight.icon className="h-5 w-5 animate-fade-in-up" />
                </div>

                <div className="flex-1 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-2 animate-fade-in-up">
                    <h3 className="font-semibold animate-fade-in-up">{insight.title}</h3>
                    <Badge variant="secondary">{insight.metric}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 animate-fade-in-up">
                    {insight.description}
                  </p>
                  <Button variant="outline" size="sm">
                    {insight.action}
                    <ExternalLink className="h-4 w-4 ml-2 animate-fade-in-up" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
