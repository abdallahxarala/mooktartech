import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Xarala Solutions</h3>
            <p className="text-gray-medium">
              Solutions d'identification innovantes pour les entreprises modernes
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Produits</h4>
            <ul className="space-y-2">
              <li>Cartes NFC</li>
              <li>Lecteurs</li>
              <li>Accessoires</li>
              <li>Solutions Pro</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>Centre d'aide</li>
              <li>Documentation</li>
              <li>Contact</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6" />
              <Twitter className="w-6 h-6" />
              <Instagram className="w-6 h-6" />
              <Linkedin className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-medium/20 mt-8 pt-8 text-center text-gray-medium">
          <p>&copy; {new Date().getFullYear()} Xarala Solutions. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
