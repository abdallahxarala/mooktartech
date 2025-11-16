"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MapPin, Users, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Event {
  id: string;
  name: string;
  date: Date;
  location: string;
  participants: number;
  status: "draft" | "active" | "completed";
}

interface EventsListProps {
  onSelectEvent: (eventId: string) => void;
}

export function EventsList({ onSelectEvent }: EventsListProps) {
  const { locale } = useParams();
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      name: "Conférence Tech 2025",
      date: new Date("2025-03-15"),
      location: "Dakar, Sénégal",
      participants: 250,
      status: "active"
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Mes Événements</h2>
            <p className="text-gray-600 mt-1">
              Gérez vos événements et badges
            </p>
          </div>
          <Link href={`/${locale}/badge-editor/events/new`}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Créer un événement
            </Button>
          </Link>
        </div>
      </Card>

      {/* Events Grid */}
      {events.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Aucun événement
            </h3>
            <p className="text-gray-600 mb-4">
              Créez votre premier événement pour commencer à générer des badges
            </p>
            <Link href={`/${locale}/badge-editor/events/new`}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Créer mon premier événement
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card
              key={event.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onSelectEvent(event.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  event.status === "active" ? "bg-green-100" :
                  event.status === "draft" ? "bg-gray-100" :
                  "bg-blue-100"
                }`}>
                  <Calendar className={`w-6 h-6 ${
                    event.status === "active" ? "text-green-600" :
                    event.status === "draft" ? "text-gray-600" :
                    "text-blue-600"
                  }`} />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <h3 className="font-semibold text-lg mb-3">
                {event.name}
              </h3>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {event.date.toLocaleDateString("fr-FR")}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {event.participants} participants
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  event.status === "active" ? "bg-green-100 text-green-700" :
                  event.status === "draft" ? "bg-gray-100 text-gray-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {event.status === "active" ? "En cours" :
                   event.status === "draft" ? "Brouillon" :
                   "Terminé"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

