"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { CardData } from "../editor";
import * as THREE from "three";

interface CardModelProps {
  data: CardData;
}

export function CardModel({ data }: CardModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create card texture
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 646; // Aspect ratio 1.586:1
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      // Background color
      ctx.fillStyle = data.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Wave decoration
      ctx.fillStyle = "#FFFFFF";
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.5);
      ctx.quadraticCurveTo(
        canvas.width * 0.3, canvas.height * 0.6,
        canvas.width * 0.7, canvas.height * 0.4
      );
      ctx.quadraticCurveTo(
        canvas.width * 0.85, canvas.height * 0.3,
        canvas.width, canvas.height * 0.5
      );
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Reset opacity
      ctx.globalAlpha = 1;

      // Text content
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 48px Inter";
      ctx.fillText(data.name || "Votre nom", 100, 200);
      
      ctx.font = "32px Inter";
      ctx.fillText(data.title || "Votre titre", 100, 250);
      ctx.fillText(data.company || "Votre entreprise", 100, 300);

      // Contact info
      ctx.font = "24px Inter";
      let y = 400;
      if (data.phone) {
        ctx.fillText(data.phone, 100, y);
        y += 40;
      }
      if (data.email) {
        ctx.fillText(data.email, 100, y);
        y += 40;
      }
      if (data.website) {
        ctx.fillText(data.website, 100, y);
      }

      // QR Code
      if (data.qrCode.enabled && data.qrCode.data) {
        const img = new Image();
        img.src = data.qrCode.data;
        img.onload = () => {
          ctx.drawImage(
            img,
            canvas.width - 150,
            canvas.height - 150,
            100,
            100
          );
        };
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [data]);

  // Animate card
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[3.17, 2]} /> {/* 1.586:1 aspect ratio */}
      <meshStandardMaterial
        map={texture}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}
