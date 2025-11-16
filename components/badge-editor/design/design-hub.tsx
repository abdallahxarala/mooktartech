"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout, FileText, Download } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface DesignHubProps {
  eventId: string | null;
}

export function DesignHub({ eventId }: DesignHubProps) {
  const { locale } = useParams();
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  if (!eventId) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Layout className="w-8 h-8 text-primary-orange" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Sélectionnez un événement
          </h3>
          <p className="text-gray-600 mb-4">
            Pour commencer à designer vos badges, créez ou sélectionnez d'abord un événement dans l'onglet "Événements"
          </p>
          <Link href={`/${locale}/badge-editor/events`}>
            <Button>
              Aller aux événements
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Design de Badges</h2>
            <p className="text-gray-600 mt-1">
              Créez des badges professionnels avec notre éditeur avancé
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </Card>

      {/* Design Tabs */}
      <Tabs defaultValue="canvas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
        </TabsList>

        <TabsContent value="canvas">
          <Card className="p-6">
            {/* Link to actual designer */}
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Ouverture du canvas de design professionnel
              </p>
              <Link href={`/${locale}/badge-editor/design`}>
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  Ouvrir le Canvas
                </Button>
              </Link>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="p-6">
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Bibliothèque de templates professionnels
              </p>
              <p className="text-sm text-gray-500">
                {activeTemplate && `Template sélectionné: ${activeTemplate}`}
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="variables">
          <Card className="p-6">
            {/* Variables manager */}
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Variables dynamiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-1">Nom</div>
                  <div className="text-sm text-gray-600">{`{nom}`}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-1">Email</div>
                  <div className="text-sm text-gray-600">{`{email}`}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-1">QR Code</div>
                  <div className="text-sm text-gray-600">{`{qr}`}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-1">Compagnie</div>
                  <div className="text-sm text-gray-600">{`{company}`}</div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

