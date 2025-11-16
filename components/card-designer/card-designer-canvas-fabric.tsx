"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Canvas, Rect, Textbox, Circle } from "fabric";
import { useCardDesignerStore } from '@/lib/store/card-designer-store';

export interface CardDesignerCanvasFabricRef {
  getCanvas: () => Canvas | null;
  addText: () => void;
  addRectangle: () => void;
  addCircle: () => void;
}

export const CardDesignerCanvasFabric = forwardRef<CardDesignerCanvasFabricRef>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);

  // Récupérer données du store
  const { 
    currentProject, 
    canvasMode,
    addElement,
    updateElement,
    deleteElement 
  } = useCardDesignerStore();

  useEffect(() => {
    console.log("🎨 Canvas useEffect triggered");
    console.log("📊 currentProject:", currentProject);
    console.log("📊 canvasMode:", canvasMode);
    
    if (!canvasRef.current) {
      console.log("❌ canvasRef.current is null");
      return;
    }

    if (!currentProject) {
      console.log("⚠️ No currentProject - canvas vide");
    }

    const canvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 500,
      backgroundColor: "#ffffff",
    });

    fabricRef.current = canvas;
    console.log("✅ Canvas created");

    // Charger éléments du store
    if (currentProject) {
      const elements = canvasMode === "recto" 
        ? currentProject.recto.elements 
        : currentProject.verso.elements;

      console.log(`📦 Elements in store:`, elements);
      console.log(`📦 Elements count: ${elements.length}`);

      elements.forEach((element) => {
        let fabricObject: any = null;

        if (element.type === "text") {
          fabricObject = new Textbox(element.properties.text || "Text", {
            left: element.position.x,
            top: element.position.y,
            width: element.size.width,
            fontSize: element.properties.fontSize || 20,
            fill: element.properties.color || "#000000",
          });
        } else if (element.type === "shape" && element.properties.shape === "rectangle") {
          fabricObject = new Rect({
            left: element.position.x,
            top: element.position.y,
            width: element.size.width,
            height: element.size.height,
            fill: element.properties.fillColor || "#0000ff",
          });
        } else if (element.type === "shape" && element.properties.shape === "circle") {
          fabricObject = new Circle({
            left: element.position.x,
            top: element.position.y,
            radius: element.size.width / 2,
            fill: element.properties.fillColor || "#ff0000",
          });
        }

        if (fabricObject) {
          fabricObject.set("id", element.id);
          canvas.add(fabricObject);
        }
      });

      canvas.renderAll();
      console.log("✅ Elements loaded to canvas");
    }

    // Écouter modifications canvas → store
    canvas.on("object:modified", (e) => {
      const obj = e.target;
      if (!obj || !obj.id) return;

      console.log("📝 Object modified:", obj.id);

      updateElement(obj.id, {
        position: { x: obj.left || 0, y: obj.top || 0 },
        size: { 
          width: obj.width ? obj.width * (obj.scaleX || 1) : 100, 
          height: obj.height ? obj.height * (obj.scaleY || 1) : 100 
        },
      });
    });

    canvas.on("object:removed", (e) => {
      const obj = e.target;
      if (!obj || !obj.id) return;

      console.log("🗑️ Object removed:", obj.id);
      deleteElement(obj.id);
    });

    return () => {
      canvas.dispose();
    };
  }, [currentProject, canvasMode, updateElement, deleteElement]);

  const addText = () => {
    if (!fabricRef.current) return;
    
    // Générer ID dans le même format que le store
    const id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const text = new Textbox("New Text", {
      left: 50,
      top: 50,
      fontSize: 20,
    });
    
    text.set("id", id);
    fabricRef.current.add(text);
    
    // Sauvegarder dans store
    const elementData = {
      type: "text" as const,
      name: "Text",
      position: { x: 50, y: 50 },
      size: { width: 200, height: 40 },
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      layer: 0,
      properties: { text: "New Text", fontSize: 20, color: "#000000" },
    };
    
    console.log("💾 Saving to store:", {
      id,
      type: "text",
      position: elementData.position,
      size: elementData.size
    });
    
    addElement(elementData);
    
    console.log("✅ Saved! Current project:", currentProject);
  };

  const addRectangle = () => {
    if (!fabricRef.current) return;
    
    const id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const rect = new Rect({
      left: 200,
      top: 200,
      width: 100,
      height: 100,
      fill: "green",
    });
    
    rect.set("id", id);
    fabricRef.current.add(rect);
    
    const elementData = {
      type: "shape" as const,
      name: "Rectangle",
      position: { x: 200, y: 200 },
      size: { width: 100, height: 100 },
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      layer: 0,
      properties: { shape: "rectangle" as const, fillColor: "green" },
    };
    
    console.log("💾 Saving to store:", {
      id,
      type: "rectangle",
      position: elementData.position,
      size: elementData.size
    });
    
    addElement(elementData);
    
    console.log("✅ Saved! Current project:", currentProject);
  };

  const addCircle = () => {
    if (!fabricRef.current) return;
    
    const id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const circle = new Circle({
      left: 400,
      top: 300,
      radius: 50,
      fill: "orange",
    });
    
    circle.set("id", id);
    fabricRef.current.add(circle);
    
    const elementData = {
      type: "shape" as const,
      name: "Circle",
      position: { x: 400, y: 300 },
      size: { width: 100, height: 100 },
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      layer: 0,
      properties: { shape: "circle" as const, fillColor: "orange" },
    };
    
    console.log("💾 Saving to store:", {
      id,
      type: "circle",
      position: elementData.position,
      size: elementData.size
    });
    
    addElement(elementData);
    
    console.log("✅ Saved! Current project:", currentProject);
  };

  useImperativeHandle(ref, () => ({
    getCanvas: () => fabricRef.current,
    addText,
    addRectangle,
    addCircle,
  }));

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      background: "#f5f5f5", 
      padding: "2rem",
      position: "relative"
    }}>
      {/* BOUTONS TEST - EN HAUT */}
      <div style={{ 
        display: "flex", 
        gap: "1rem", 
        marginBottom: "1rem",
        position: "absolute",
        top: "1rem",
        left: "1rem",
        zIndex: 1000
      }}>
        <button
          onClick={addText}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}
        >
          ➕ ADD TEXT
        </button>

        <button
          onClick={addRectangle}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}
        >
          ➕ RECTANGLE
        </button>

        <button
          onClick={addCircle}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}
        >
          ➕ CIRCLE
        </button>
      </div>

      {/* CANVAS - EN DESSOUS */}
      <div style={{ 
        border: "4px solid black", 
        display: "inline-block",
        background: "white",
        marginTop: "4rem"
      }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
});

CardDesignerCanvasFabric.displayName = "CardDesignerCanvasFabric";
