"use client";

import { QRCodeGenerator } from "@/components/qr-generator/generator";

export function QrGeneratorClient() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 animate-fade-in-up">
      <div className="container mx-auto px-4 animate-fade-in-up">
        <h1 className="text-3xl font-black text-center mb-8 text-gray-900 animate-fade-in-up">
          Générateur de QR Code
        </h1>
        <QRCodeGenerator />
      </div>
    </div>
  );
}