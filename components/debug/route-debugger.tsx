"use client";

import { useState } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bug, X, ChevronDown, AlertTriangle } from "lucide-react";

interface RouteDebuggerProps {
  issues?: string[];
}

export function RouteDebugger({ issues = [] }: RouteDebuggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  // Ne s'affiche qu'en développement
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
      <Button
        variant="outline"
        size="icon"
        className="relative animate-fade-in-up"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bug className="h-5 w-5 animate-fade-in-up" />
        {issues.length > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 animate-fade-in-up"
          >
            {issues.length}
          </Badge>
        )}
      </Button>

      
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-96 animate-fade-in-up">
            <Card className="p-4 animate-fade-in-up">
              <div className="flex items-center justify-between mb-4 animate-fade-in-up">
                <h3 className="font-semibold animate-fade-in-up">Route Debugger</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4 animate-fade-in-up" />
                </Button>
              </div>

              <div className="space-y-4 animate-fade-in-up">
                <div>
                  <p className="text-sm font-medium mb-1 animate-fade-in-up">Current Route</p>
                  <code className="block bg-gray-100 p-2 rounded text-sm animate-fade-in-up">
                    {pathname}
                  </code>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1 animate-fade-in-up">Parameters</p>
                  <pre className="bg-gray-100 p-2 rounded text-sm animate-fade-in-up">
                    {JSON.stringify(params, null, 2)}
                  </pre>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1 animate-fade-in-up">Query Parameters</p>
                  <pre className="bg-gray-100 p-2 rounded text-sm animate-fade-in-up">
                    {JSON.stringify(
                      Object.fromEntries(searchParams.entries()),
                      null,
                      2
                    )}
                  </pre>
                </div>

                {issues.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-red-500 mb-1 animate-fade-in-up">Issues</p>
                    <div className="space-y-2 animate-fade-in-up">
                      {issues.map((issue, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-2 rounded animate-fade-in-up"
                        >
                          <AlertTriangle className="h-4 w-4 mt-0.5 animate-fade-in-up" />
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      
    </div>
  );
}
