"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useTranslations } from "@/lib/utils/next-intl-fallback";
import { AnalyticsHeader } from "./header";
import { AnalyticsStats } from "./stats";
import { AnalyticsCharts } from "./charts";
import { AnalyticsMap } from "./map";
import { AnalyticsContacts } from "./contacts";
import { AnalyticsInsights } from "./insights";

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date(),
  ]);

  const [activeTab, setActiveTab] = useState("overview");
  const t = useTranslations("analytics");

  return (
    <div className="space-y-8">
      <AnalyticsHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full max-w-2xl mx-auto">
          <TabsTrigger value="overview" className="flex-1">
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex-1">
            Contacts
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex-1">
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 mt-8">
          <AnalyticsStats dateRange={dateRange} />
          
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Activité temporelle
              </h3>
              <AnalyticsCharts dateRange={dateRange} />
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Distribution géographique
              </h3>
              <AnalyticsMap dateRange={dateRange} />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="mt-8">
          <AnalyticsContacts dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="insights" className="mt-8">
          <AnalyticsInsights dateRange={dateRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
