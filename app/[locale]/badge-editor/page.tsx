"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Palette, Users, Upload, Printer, Settings } from "lucide-react";
import { DesignHub } from "@/components/badge-editor/design/design-hub";
import { EventsList } from "@/components/badge-editor/events/events-list";

export default function BadgeEditorPage() {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Badge Editor Hub
              </h1>
              <p className="text-gray-600 mt-1">
                Gestion des événements, design et impression
              </p>
            </div>
            
            {activeEvent && (
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-gray-500">Événement actif :</span>
                  <span className="font-semibold ml-2">{activeEvent}</span>
                </div>
                <button className="text-primary-orange hover:underline text-sm">
                  Changer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden md:inline">Événements</span>
            </TabsTrigger>
            
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden md:inline">Design</span>
            </TabsTrigger>
            
            <TabsTrigger value="participants" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">Participants</span>
            </TabsTrigger>
            
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden md:inline">Import</span>
            </TabsTrigger>
            
            <TabsTrigger value="print" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              <span className="hidden md:inline">Impression</span>
            </TabsTrigger>
            
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Réglages</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <EventsList onSelectEvent={setActiveEvent} />
          </TabsContent>

          <TabsContent value="design">
            <DesignHub eventId={activeEvent} />
          </TabsContent>

          <TabsContent value="participants">
            {/* ParticipantsManager component placeholder */}
            <div className="bg-white rounded-lg p-8 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Gestion des Participants</h3>
              <p className="text-gray-600">Interface à venir</p>
            </div>
          </TabsContent>

          <TabsContent value="import">
            {/* ImportCSV component placeholder */}
            <div className="bg-white rounded-lg p-8 text-center">
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Import CSV</h3>
              <p className="text-gray-600">Interface à venir</p>
            </div>
          </TabsContent>

          <TabsContent value="print">
            {/* PrintQueue component placeholder */}
            <div className="bg-white rounded-lg p-8 text-center">
              <Printer className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">File d'Impression</h3>
              <p className="text-gray-600">Interface à venir</p>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            {/* Settings component placeholder */}
            <div className="bg-white rounded-lg p-8 text-center">
              <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Réglages</h3>
              <p className="text-gray-600">Interface à venir</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

