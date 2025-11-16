"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Phone, Mail, MessageSquare, X } from "lucide-react";
import { Contact } from "@/lib/types";

interface ContactDetailsProps {
  contact: Contact;
  onClose: () => void;
}

export function ContactDetails({ contact, onClose }: ContactDetailsProps) {
  return (
    <div className="h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Détails du contact</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="info" className="h-[calc(100%-57px)]">
        <div className="px-4 pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="flex-1">
              Informations
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              Historique
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">
              Notes
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="info" className="p-4 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={contact.photo} />
              <AvatarFallback>
                {contact.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{contact.name}</h4>
              <p className="text-sm text-gray-600">{contact.title}</p>
              <p className="text-sm text-gray-600">{contact.company}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Appeler
            </Button>
            <Button size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-600">Contact</h5>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {contact.email}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Téléphone:</span> {contact.phone}
                </p>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-600">Mots-clés</h5>
              <div className="mt-2 flex gap-1">
                {contact.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-600">Carte associée</h5>
              <p className="text-sm mt-2">{contact.cardName}</p>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-600">Date d'ajout</h5>
              <p className="text-sm mt-2">
                {format(new Date(contact.createdAt), "PPP", { locale: fr })}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="p-4">
          <div className="space-y-4">
            {contact.history.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary-orange" />
                <div>
                  <p className="text-sm">{event.description}</p>
                  <p className="text-xs text-gray-600">
                    {format(new Date(event.date), "PP", { locale: fr })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="p-4">
          <div className="space-y-4">
            {contact.notes.map((note, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm">{note.content}</p>
                <p className="text-xs text-gray-600 mt-2">
                  {format(new Date(note.date), "PP", { locale: fr })}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
