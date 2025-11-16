"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LeadsStatsProps {
  totalLeads: number
  todaysLeads: number
  contacted: number
  conversionRate: number
}

export function LeadsStats({
  totalLeads,
  todaysLeads,
  contacted,
  conversionRate,
}: LeadsStatsProps) {
  const stats = useMemo(
    () => [
      {
        title: "Leads aujourd'hui",
        value: todaysLeads,
        subtitle: "Capturés via cartes NFC & formulaires",
      },
      {
        title: "Leads contactés",
        value: contacted,
        subtitle: "Marqués comme contactés",
      },
      {
        title: "Conversion",
        value: `${conversionRate.toFixed(1)} %`,
        subtitle: "Leads contactés / total",
      },
      {
        title: "Leads totaux",
        value: totalLeads,
        subtitle: "Depuis le début",
      },
    ],
    [todaysLeads, contacted, conversionRate, totalLeads],
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border border-gray-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-500">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

