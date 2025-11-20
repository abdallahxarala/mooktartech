"use client";

import { useRef, useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { CardModel } from "./card-model";
import { CardData } from "../editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Smartphone,
  Sun,
  Moon,
  Scan,
} from "lucide-react";

interface CardPreviewProps {
  data: CardData;
  isDragging?: boolean;
  onImageUpload?: (type: "photo" | "logo", file: File) => void;
}

export function CardPreview({ data, isDragging, onImageUpload }: CardPreviewProps) {
  const [view, setView] = useState<"2d" | "3d" | "device">("2d");
  const [showNFCScan, setShowNFCScan] = useState(false);
  const { theme, setTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate NFC scan animation
  const simulateNFCScan = () => {
    setShowNFCScan(true);
    setTimeout(() => setShowNFCScan(false), 2000);
  };

  // Handle file drop for images
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/") && onImageUpload) {
      const type = e.currentTarget.getAttribute("data-upload-type") as "photo" | "logo";
      onImageUpload(type, file);
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("ring-2", "ring-primary-orange");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("ring-2", "ring-primary-orange");
  };

  return (
    <div className="space-y-4 animate-fade-in-up" ref={containerRef}>
      {/* View controls */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div className="flex gap-2 animate-fade-in-up">
          <Button
            variant={view === "2d" ? "default" : "outline"}
            onClick={() => setView("2d")}
          >
            2D
          </Button>
          <Button
            variant={view === "3d" ? "default" : "outline"}
            onClick={() => setView("3d")}
          >
            3D
          </Button>
          <Button
            variant={view === "device" ? "default" : "outline"}
            onClick={() => setView("device")}
          >
            <Smartphone className="h-4 w-4 animate-fade-in-up" />
          </Button>
        </div>

        <div className="flex gap-2 animate-fade-in-up">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 animate-fade-in-up" />
            ) : (
              <Sun className="h-4 w-4 animate-fade-in-up" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={simulateNFCScan}
          >
            <Scan className="h-4 w-4 animate-fade-in-up" />
          </Button>
        </div>
      </div>

      {/* Card preview */}
      <div className="relative aspect-[1.586/1] bg-white rounded-xl overflow-hidden shadow-lg animate-fade-in-up">
        
          {view === "2d" && (
            <div
              key="2d"
              className="h-full animate-fade-in-up"
            >
              <TransformWrapper>
                {({ zoomIn, zoomOut, resetTransform }) => (
                  <>
                    <TransformComponent>
                      <div className="relative w-full h-full animate-fade-in-up" style={{ backgroundColor: data.color }}>
                        {/* Wave decoration */}
                        <div className="absolute inset-0 opacity-30 animate-fade-in-up">
                          <svg className="w-full h-full animate-fade-in-up" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path
                              d="M0,50 C30,60 70,40 100,50 L100,100 L0,100 Z"
                              fill="#FFFFFF"
                            />
                          </svg>
                        </div>

                        {/* Card content */}
                        <div className="relative p-6 text-white animate-fade-in-up">
                          {/* Photo upload zone */}
                          <div
                            className="w-20 h-20 rounded-full overflow-hidden bg-white/20 cursor-pointer transition-all animate-fade-in-up"
                            data-upload-type="photo"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                          >
                            {data.photo ? (
                              <img
                                src={data.photo}
                                alt="Profile"
                                className="w-full h-full object-cover animate-fade-in-up"
                              />
                            ) : (
                              <div className="h-full flex items-center justify-center text-white/50 animate-fade-in-up">
                                Photo
                              </div>
                            )}
                          </div>

                          <div className="mt-4 space-y-2 animate-fade-in-up">
                            <h2 className="text-2xl font-bold animate-fade-in-up">{data.name || "Votre nom"}</h2>
                            <p className="opacity-90 animate-fade-in-up">{data.title || "Votre titre"}</p>
                            <p className="opacity-80 animate-fade-in-up">{data.company || "Votre entreprise"}</p>
                          </div>

                          {/* Contact information */}
                          <div className="mt-6 space-y-2 text-sm animate-fade-in-up">
                            {data.phone && <p>{data.phone}</p>}
                            {data.email && <p>{data.email}</p>}
                            {data.website && <p>{data.website}</p>}
                            {data.address && <p>{data.address}</p>}
                          </div>

                          {/* QR Code */}
                          {data.qrCode.enabled && data.qrCode.data && (
                            <div
                              className="absolute bottom-6 right-6 w-24 h-24 bg-white rounded-lg p-2 animate-fade-in-up"
                              style={{
                                transform: `translate(${data.qrCode.position.x}px, ${data.qrCode.position.y}px)`,
                              }}
                            >
                              <img
                                src={data.qrCode.data}
                                alt="QR Code"
                                className="w-full h-full animate-fade-in-up"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </TransformComponent>

                    <div className="absolute bottom-4 right-4 flex gap-2 animate-fade-in-up">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => zoomIn()}
                        className="bg-white/80 backdrop-blur-sm animate-fade-in-up"
                      >
                        <ZoomIn className="h-4 w-4 animate-fade-in-up" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => zoomOut()}
                        className="bg-white/80 backdrop-blur-sm animate-fade-in-up"
                      >
                        <ZoomOut className="h-4 w-4 animate-fade-in-up" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => resetTransform()}
                        className="bg-white/80 backdrop-blur-sm animate-fade-in-up"
                      >
                        <RotateCw className="h-4 w-4 animate-fade-in-up" />
                      </Button>
                    </div>
                  </>
                )}
              </TransformWrapper>
            </div>
          )}

          {view === "3d" && (
            <div
              key="3d"
              className="h-full animate-fade-in-up"
            >
              <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <CardModel data={data} />
                <OrbitControls enablePan={false} />
              </Canvas>
            </div>
          )}

          {view === "device" && (
            <div
              key="device"
              className="h-full flex items-center justify-center bg-gray-900 animate-fade-in-up"
            >
              <div className="relative w-[280px] h-[560px] bg-black rounded-[3rem] p-4 shadow-2xl animate-fade-in-up">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-b-2xl animate-fade-in-up">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-gray-800 rounded-full animate-fade-in-up" />
                </div>
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden animate-fade-in-up">
                  <div className="w-full h-full animate-fade-in-up" style={{ backgroundColor: data.color }}>
                    {/* Card content (same as 2D view but scaled) */}
                    <div className="relative p-4 text-white scale-75 origin-top-left animate-fade-in-up">
                      {/* Content same as 2D view */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        

        {/* NFC scan animation */}
        
          {showNFCScan && (
            <div
              className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm animate-fade-in-up"
            >
              <div
                className="bg-white p-4 rounded-full animate-fade-in-up"
              >
                <Scan className="h-8 w-8 text-primary-orange animate-pulse" />
              </div>
            </div>
          )}
        

        {/* Status badges */}
        <div className="absolute top-4 right-4 flex gap-2 animate-fade-in-up">
          {isDragging && (
            <Badge variant="secondary" className="bg-primary-orange text-white animate-fade-in-up">
              Déplacement en cours
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
