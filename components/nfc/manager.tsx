"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NFCWriter } from "./writer";
import { NFCReader } from "./reader";

export function NFCManager() {
  const [activeTab, setActiveTab] = useState<"write" | "read">("write");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestionnaire NFC</h1>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "write" | "read")}
        className="space-y-8"
      >
        <TabsList className="w-full max-w-md mx-auto">
          <TabsTrigger value="write" className="flex-1">
            Écriture NFC
          </TabsTrigger>
          <TabsTrigger value="read" className="flex-1">
            Lecture NFC
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write">
          <NFCWriter />
        </TabsContent>

        <TabsContent value="read">
          <NFCReader />
        </TabsContent>
      </Tabs>
    </div>
  );
}
