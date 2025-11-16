"use client";

import { useState, useCallback } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  className?: string;
}

const defaultPresets = [
  "#7B3FF2", // Primary
  "#FF7A00", // Orange
  "#9CA3AF", // Gray
  "#1F2937", // Dark
  "#FFFFFF", // White
];

export function ColorPicker({
  value,
  onChange,
  presetColors = defaultPresets,
  className,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetClick = useCallback((color: string) => {
    onChange(color);
    setIsOpen(false);
  }, [onChange]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label>Couleur</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-10 p-1",
              isOpen && "ring-2 ring-primary-orange"
            )}
          >
            <div className="flex items-center gap-2 w-full">
              <div
                className="w-6 h-6 rounded-md border"
                style={{ backgroundColor: value }}
              />
              <Input
                value={value}
                readOnly
                className="flex-1 border-0 focus-visible:ring-0"
              />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <div className="space-y-3">
            <HexColorPicker
              color={value}
              onChange={onChange}
              className="!w-[200px]"
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className={cn(
                    "w-6 h-6 rounded-md border",
                    color === value && "ring-2 ring-primary-orange"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => handlePresetClick(color)}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
