"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Grip, X } from "lucide-react";
import { Reorder } from "framer-motion";

export interface Field {
  id: string;
  label: string;
  type: "text" | "email" | "phone" | "url";
  value: string;
  required: boolean;
  enabled: boolean;
}

interface FieldEditorProps {
  fields: Field[];
  onChange: (fields: Field[]) => void;
  className?: string;
}

export function FieldEditor({
  fields,
  onChange,
  className,
}: FieldEditorProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const updateField = (id: string, updates: Partial<Field>) => {
    onChange(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const removeField = (id: string) => {
    onChange(fields.filter((field) => field.id !== id));
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Reorder.Group
        axis="y"
        values={fields}
        onReorder={onChange}
        className="space-y-2 animate-fade-in-up"
      >
        {fields.map((field) => (
          <Reorder.Item
            key={field.id}
            value={field}
            className={cn(
              "relative bg-white rounded-lg border p-4 cursor-move",
              selectedField === field.id && "ring-2 ring-primary-orange"
            )}
            onClick={() => setSelectedField(field.id)}
          >
            <div className="flex items-center gap-4 animate-fade-in-up">
              <Grip className="h-5 w-5 text-gray-400 animate-fade-in-up" />
              
              <div className="flex-1 space-y-2 animate-fade-in-up">
                <div className="flex items-center justify-between animate-fade-in-up">
                  <Label>{field.label}</Label>
                  <div className="flex items-center gap-2 animate-fade-in-up">
                    <Switch
                      checked={field.enabled}
                      onCheckedChange={(enabled) =>
                        updateField(field.id, { enabled })
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(field.id)}
                    >
                      <X className="h-4 w-4 animate-fade-in-up" />
                    </Button>
                  </div>
                </div>

                <Input
                  value={field.value}
                  onChange={(e) =>
                    updateField(field.id, { value: e.target.value })
                  }
                  placeholder={`Entrez votre ${field.label.toLowerCase()}`}
                  disabled={!field.enabled}
                />

                {selectedField === field.id && (
                  <div
                    className="flex items-center gap-4 mt-2 animate-fade-in-up"
                  >
                    <Switch
                      id={`required-${field.id}`}
                      checked={field.required}
                      onCheckedChange={(required) =>
                        updateField(field.id, { required })
                      }
                    />
                    <Label htmlFor={`required-${field.id}`}>
                      Champ obligatoire
                    </Label>
                  </div>
                )}
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
