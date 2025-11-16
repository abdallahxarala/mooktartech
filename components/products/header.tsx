"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";

export function ProductsHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            Xarala Solutions
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className={`lg:flex items-center gap-8 ${isMenuOpen ? 'absolute top-16 left-0 right-0 bg-white p-4 border-b' : 'hidden'}`}>
            <Link href="/products" className="text-primary-orange font-medium">
              Produits
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <Button className="bg-primary-orange hover:bg-primary-orange/90">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Panier (0)
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
