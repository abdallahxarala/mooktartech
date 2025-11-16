"use client";

import { useEffect, useRef } from "react";
import { Canvas, Rect, Textbox, Circle } from "fabric";

export default function TestCanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);

  useEffect(() => {
    console.log("🧪 TEST CANVAS - Initializing...");
    
    if (!canvasRef.current) {
      console.log("❌ Canvas ref null");
      return;
    }

    try {
      const canvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: "#f5f5f5",
      });

      fabricRef.current = canvas;
      
      console.log("✅ CANVAS CREATED:", canvas);
      console.log("✅ Size:", canvas.width, "x", canvas.height);

      // Rectangle test
      const rect = new Rect({
        left: 100,
        top: 100,
        width: 150,
        height: 100,
        fill: "blue",
      });
      canvas.add(rect);
      console.log("✅ Rectangle added");

      // Text test
      const text = new Textbox("HELLO CANVAS", {
        left: 300,
        top: 100,
        width: 200,
        fontSize: 30,
        fill: "red",
        fontWeight: "bold",
      });
      canvas.add(text);
      console.log("✅ Text added");

    } catch (error) {
      console.error("❌ ERROR:", error);
    }

    return () => {
      fabricRef.current?.dispose();
    };
  }, []);

  const addText = () => {
    if (!fabricRef.current) return;
    
    const text = new Textbox("New Text", {
      left: 50,
      top: 50,
      fontSize: 20,
    });
    
    fabricRef.current.add(text);
    console.log("✅ Text added via button");
  };

  const addRect = () => {
    if (!fabricRef.current) return;
    
    const rect = new Rect({
      left: 200,
      top: 200,
      width: 100,
      height: 100,
      fill: "green",
    });
    
    fabricRef.current.add(rect);
    console.log("✅ Rectangle added via button");
  };

  const addCircle = () => {
    if (!fabricRef.current) return;
    
    const circle = new Circle({
      left: 400,
      top: 300,
      radius: 50,
      fill: "orange",
    });
    
    fabricRef.current.add(circle);
    console.log("✅ Circle added via button");
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#1a1a1a", 
      padding: "2rem" 
    }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto" 
      }}>
        <h1 style={{ 
          color: "white", 
          fontSize: "3rem", 
          marginBottom: "2rem" 
        }}>
          🧪 TEST CANVAS FABRIC.JS
        </h1>

        <div style={{ 
          background: "white", 
          padding: "2rem", 
          borderRadius: "1rem" 
        }}>
          {/* Boutons */}
          <div style={{ 
            display: "flex", 
            gap: "1rem", 
            marginBottom: "2rem" 
          }}>
            <button
              onClick={addText}
              style={{
                padding: "1rem 2rem",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1.2rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              ➕ ADD TEXT
            </button>

            <button
              onClick={addRect}
              style={{
                padding: "1rem 2rem",
                background: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1.2rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              ➕ RECTANGLE
            </button>

            <button
              onClick={addCircle}
              style={{
                padding: "1rem 2rem",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1.2rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              ➕ CIRCLE
            </button>
          </div>

          {/* Canvas */}
          <div style={{ 
            border: "4px solid black", 
            borderRadius: "0.5rem", 
            display: "inline-block" 
          }}>
            <canvas ref={canvasRef} />
          </div>

          {/* Instructions */}
          <div style={{ 
            marginTop: "2rem", 
            padding: "1rem", 
            background: "#eff6ff", 
            borderRadius: "0.5rem" 
          }}>
            <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
              📋 Instructions :
            </h3>
            <ol style={{ paddingLeft: "1.5rem" }}>
              <li>Ouvrez F12 → Console</li>
              <li>Cliquez les boutons bleu/violet/vert</li>
              <li>Drag & drop les éléments</li>
              <li>Resize avec les poignées</li>
            </ol>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <a 
            href="/fr/badge-editor/design"
            style={{ 
              color: "#60a5fa", 
              fontSize: "1.2rem", 
              textDecoration: "underline" 
            }}
          >
            ← Retour Badge Editor
          </a>
        </div>
      </div>
    </div>
  );
}

