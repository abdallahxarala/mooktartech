"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { RotateCw, ZoomIn, ZoomOut, Check } from "lucide-react";

interface ImageCropperProps {
  src: string;
  aspectRatio?: number;
  onCrop: (croppedImage: string) => void;
  className?: string;
}

export function ImageCropper({
  src,
  aspectRatio = 1,
  onCrop,
  className,
}: ImageCropperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCrop = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = containerRef.current.getBoundingClientRect();
    const image = imageRef.current.getBoundingClientRect();

    canvas.width = container.width;
    canvas.height = container.height;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.drawImage(
      imageRef.current,
      -image.width / 2,
      -image.height / 2,
      image.width,
      image.height
    );

    const croppedImage = canvas.toDataURL("image/png");
    onCrop(croppedImage);
    setIsOpen(false);
  }, [scale, rotation, onCrop]);

  return (
    <>
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-lg border cursor-pointer",
          className
        )}
        onClick={() => setIsOpen(true)}
      >
        <img
          src={src}
          alt="Image à recadrer"
          className="w-full h-full object-cover animate-fade-in-up"
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl animate-fade-in-up">
          <DialogHeader>
            <DialogTitle>Recadrer l'image</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 animate-fade-in-up">
            <div
              ref={containerRef}
              className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 animate-fade-in-up"
            >
              <img
                ref={imageRef}
                src={src}
                alt="Image à recadrer"
                className="absolute left-1/2 top-1/2 origin-center animate-fade-in-up"
                style={{
                  x: "-50%",
                  y: "-50%",
                  scale,
                  rotate: rotation,
                }}
                drag
                dragConstraints={containerRef}
              />
            </div>

            <div className="space-y-4 animate-fade-in-up">
              <div className="space-y-2 animate-fade-in-up">
                <Label>Zoom</Label>
                <div className="flex items-center gap-2 animate-fade-in-up">
                  <ZoomOut className="h-4 w-4 animate-fade-in-up" />
                  <Slider
                    value={[scale]}
                    min={0.5}
                    max={3}
                    step={0.1}
                    onValueChange={([value]) => setScale(value)}
                  />
                  <ZoomIn className="h-4 w-4 animate-fade-in-up" />
                </div>
              </div>

              <div className="space-y-2 animate-fade-in-up">
                <Label>Rotation</Label>
                <div className="flex items-center gap-2 animate-fade-in-up">
                  <RotateCw className="h-4 w-4 animate-fade-in-up" />
                  <Slider
                    value={[rotation]}
                    min={0}
                    max={360}
                    step={90}
                    onValueChange={([value]) => setRotation(value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 animate-fade-in-up">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCrop}>
                <Check className="h-4 w-4 mr-2 animate-fade-in-up" />
                Appliquer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
