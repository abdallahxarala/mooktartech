"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { localOrganizations } from "@/lib/config/assets";
export function LocalTestimonial() {
  return (
    <div className="grid gap-6 md:grid-cols-2 animate-fade-in-up">
      {localOrganizations.map((org, index) => (
        <div
          key={org.name}
        >
          <Card className="p-6 animate-fade-in-up">
            <div className="flex items-start gap-4 animate-fade-in-up">
              <Avatar className="h-12 w-12 animate-fade-in-up">
                <AvatarImage src={org.logo} alt={org.name} />
                <AvatarFallback>{org.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold animate-fade-in-up">{org.name}</h3>
                <p className="text-sm text-gray-600 mt-1 animate-fade-in-up">{org.testimonial.text}</p>
                <p className="text-sm font-medium text-gray-500 mt-2 animate-fade-in-up">
                  {org.testimonial.author}
                </p>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
