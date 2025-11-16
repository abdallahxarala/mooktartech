"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CreditCard,
  Users,
  ShoppingBag,
  BarChart,
  Settings,
  HelpCircle,
  Menu,
} from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const menuItems = [
  { icon: CreditCard, label: "Cartes", href: "/dashboard", active: true },
  { icon: Users, label: "Contacts", href: "/dashboard/contacts" },
  { icon: ShoppingBag, label: "Boutique", href: "/dashboard/boutique" },
  { icon: BarChart, label: "Analytique", href: "/dashboard/analytics" },
  { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
  { icon: HelpCircle, label: "Support", href: "/dashboard/support" },
];

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300",
        !open && "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-8 w-8 text-primary-orange" />
            <span className="text-xl font-bold">Xarala</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(!open)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col items-center p-4 border-b border-gray-200">
          <Avatar className="h-16 w-16 mb-3">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold">John Doe</h3>
          <p className="text-sm text-gray-500">john@xarala.co</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                item.active
                  ? "bg-primary-orange/10 text-primary-orange"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
