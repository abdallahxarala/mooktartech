"use client";

import { useState, useCallback } from "react";
import { CardTemplate } from "@/components/card-editor/templates";
import { safeStringify } from '../utils/safe-serializer';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface CardElement {
  type: string;
  content: string;
  position: Position;
  size?: Size;
  style?: Record<string, string>;
}

interface CardData {
  [key: string]: CardElement;
}

interface HistoryEntry {
  data: CardData;
  selectedElement: string | null;
}

export function useCardEditor(template: CardTemplate) {
  const [cardData, setCardData] = useState<CardData>({
    photo: {
      type: "photo",
      content: "",
      position: { x: template.layout.photo.x, y: template.layout.photo.y },
      size: { width: template.layout.photo.size, height: template.layout.photo.size },
    },
    name: {
      type: "text",
      content: "",
      position: { x: template.layout.name.x, y: template.layout.name.y },
    },
    title: {
      type: "text",
      content: "",
      position: { x: template.layout.title.x, y: template.layout.title.y },
    },
  });

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([{ data: cardData, selectedElement: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addToHistory = useCallback((newData: CardData, newSelectedElement: string | null) => {
    try {
      // Safely serialize the history entry before storing
      const serializedEntry = safeStringify({ data: newData, selectedElement: newSelectedElement });
      const newEntry = JSON.parse(serializedEntry);
      
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newEntry);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  }, [history, historyIndex]);

  const updateCardData = useCallback((elementId: string, newData: CardElement) => {
    const newCardData = { ...cardData, [elementId]: newData };
    setCardData(newCardData);
    addToHistory(newCardData, selectedElement);
  }, [cardData, selectedElement, addToHistory]);

  const moveElement = useCallback((elementId: string, newPosition: Position) => {
    if (cardData[elementId]) {
      const newData = {
        ...cardData[elementId],
        position: newPosition,
      };
      updateCardData(elementId, newData);
    }
  }, [cardData, updateCardData]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const { data, selectedElement: newSelectedElement } = history[newIndex];
      setCardData(data);
      setSelectedElement(newSelectedElement);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const { data, selectedElement: newSelectedElement } = history[newIndex];
      setCardData(data);
      setSelectedElement(newSelectedElement);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  return {
    cardData,
    updateCardData,
    selectedElement,
    setSelectedElement,
    moveElement,
    history,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
}