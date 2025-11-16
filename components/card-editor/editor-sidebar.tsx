"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Layout,
  Image,
  Type,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface EditorSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const tools = [
  { icon: Layout, label: "Afficher" },
  { icon: Type, label: "Information" },
  { icon: Image, label: "Champs" },
  { icon: Settings, label: "Carte" },
];

export function EditorSidebar({ collapsed, onCollapse }: EditorSidebarProps) {
  return (
    <div className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
      collapsed ? "w-20" : "w-[80px]"
    }`}>
      <div className="h-full flex flex-col items-center py-6">
        <div className="space-y-6">
          {tools.map((tool, index) => (
            <Tooltip key={tool.label} delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={index === 0 ? "text-primary-orange" : ""}
                >
                  <tool.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {tool.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="mt-auto"
          onClick={() => onCollapse(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
