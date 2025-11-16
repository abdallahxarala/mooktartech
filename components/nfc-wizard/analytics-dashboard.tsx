'use client'

import React from 'react'
import { useNFCEditorStore, Analytics } from '@/lib/store/nfc-editor-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, Eye, Heart, Share2, 
  MapPin, Globe, Smartphone, MousePointerClick,
  Calendar, BarChart3, Target, Zap
} from 'lucide-react'
import { motion } from 'framer-motion'

interface AnalyticsDashboardProps {
  profileId: string
}

export function AnalyticsDashboard({ profileId }: AnalyticsDashboardProps) {
  const { getAnalytics } = useNFCEditorStore()
  const analytics = getAnalytics(profileId)

  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Aucune donnée pour le moment</p>
        </CardContent>
      </Card>
    )
  }

  const conversionRate = analytics.totalViews > 0 
    ? ((analytics.totalSaves + analytics.totalShares) / analytics.totalViews * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          icon={Eye}
          label="Total Vues"
          value={analytics.totalViews.toLocaleString()}
          trend={analytics.totalViews > 0 ? 'up' : 'neutral'}
          color="blue"
        />
        <StatCard
          icon={Heart}
          label="Enregistrements"
          value={analytics.totalSaves.toLocaleString()}
          trend={analytics.totalSaves > 0 ? 'up' : 'neutral'}
          color="pink"
        />
        <StatCard
          icon={Share2}
          label="Partages"
          value={analytics.totalShares.toLocaleString()}
          trend={analytics.totalShares > 0 ? 'up' : 'neutral'}
          color="purple"
        />
        <StatCard
          icon={Target}
          label="Taux conversion"
          value={`${conversionRate}%`}
          trend={parseFloat(conversionRate) > 5 ? 'up' : 'neutral'}
          color="green"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Views by Source */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Vues par source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SourceBar
                label="NFC"
                value={analytics.viewsBySource.nfc}
                total={analytics.totalViews}
                icon={Smartphone}
                color="blue"
              />
              <SourceBar
                label="QR Code"
                value={analytics.viewsBySource.qr}
                total={analytics.totalViews}
                icon={MousePointerClick}
                color="green"
              />
              <SourceBar
                label="Lien direct"
                value={analytics.viewsBySource.link}
                total={analytics.totalViews}
                icon={Globe}
                color="purple"
              />
            </div>
          </CardContent>
        </Card>

        {/* Views Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Vue d'ensemble (7 jours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-between gap-2">
              {Object.entries(analytics.viewsByDay)
                .slice(-7)
                .map(([date, count], index) => (
                  <Bar key={date} value={count} max={Math.max(...Object.values(analytics.viewsByDay))} index={index} />
                ))}
              {Object.keys(analytics.viewsByDay).length === 0 && (
                <div className="text-center w-full text-gray-400">
                  Aucune donnée sur 7 jours
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Locations */}
      {analytics.topLocations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              Zones géographiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topLocations.slice(0, 5).map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="font-medium text-gray-900">{location.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${(location.count / analytics.topLocations[0].count) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700 w-8 text-right">
                      {location.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, trend, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    pink: 'bg-pink-50 border-pink-200 text-pink-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    green: 'bg-green-50 border-green-200 text-green-600',
  }

  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend === 'up' && (
            <TrendingUp className="w-5 h-5 text-green-500" />
          )}
        </div>
        <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </CardContent>
    </Card>
  )
}

function SourceBar({ label, value, total, icon: Icon, color }: any) {
  const percentage = total > 0 ? (value / total * 100).toFixed(0) : 0
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-900">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-700">{value}</span>
          <span className="text-xs text-gray-500">({percentage}%)</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full`}
        />
      </div>
    </div>
  )
}

function Bar({ value, max, index }: { value: number; max: number; index: number }) {
  const height = max > 0 ? (value / max) * 100 : 0
  
  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="text-xs text-gray-500 mb-2">{value}</div>
      <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden relative h-full">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          className="absolute bottom-0 w-full bg-gradient-to-t from-orange-500 to-pink-500 rounded-t-lg"
        />
      </div>
    </div>
  )
}

