export interface Product {
  id: string
  name: string
  slug: string
  category: 'imprimantes' | 'cartes-pvc' | 'cartes-magnetiques' | 'cartes-puce' | 'cartes-rfid' | 'cartes-nfc' | 'accessoires'
  brand: string
  description: string
  shortDescription: string
  price: number
  priceUnit: 'XOF' | 'unit'
  images: string[]
  mainImage: string
  stock: number
  featured: boolean
  new: boolean
  specifications: Record<string, string>
  features: string[]
  technicalSheet?: string
}

export const PRODUCTS: Product[] = [
  // ═══════════════════════════════════
  // IMPRIMANTES ENTRUST DATACARD
  // ═══════════════════════════════════
  
  {
    id: 'entrust-sd260',
    name: 'Entrust Datacard SD260',
    slug: 'entrust-datacard-sd260',
    category: 'imprimantes',
    brand: 'Entrust Datacard',
    shortDescription: 'Imprimante de cartes simple face, idéale pour petites séries',
    description: `L'imprimante Entrust Datacard SD260 est la solution parfaite pour les petites et moyennes entreprises qui recherchent une qualité professionnelle. Impression simple face avec qualité photographique exceptionnelle.`,
    price: 850000,
    priceUnit: 'XOF',
    images: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80',
      'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80',
    stock: 5,
    featured: true,
    new: false,
    specifications: {
      'Type d\'impression': 'Sublimation thermique',
      'Faces': 'Simple face',
      'Résolution': '300 dpi',
      'Vitesse': '100 cartes/heure (couleur)',
      'Capacité chargeur': '100 cartes',
      'Connectivité': 'USB, Ethernet',
      'Encodage': 'Magnétique optionnel',
      'Garantie': '2 ans constructeur',
    },
    features: [
      'Qualité d\'impression photographique 300 DPI',
      'Interface intuitive et facile à utiliser',
      'Compact et silencieux',
      'Compatible Windows et Mac',
      'Encodage magnétique en option',
      'Idéal pour badges employés, cartes étudiantes',
    ],
  },
  
  {
    id: 'entrust-sd360',
    name: 'Entrust Datacard SD360',
    slug: 'entrust-datacard-sd360',
    category: 'imprimantes',
    brand: 'Entrust Datacard',
    shortDescription: 'Imprimante recto-verso automatique haute performance',
    description: `L'Entrust Datacard SD360 offre l'impression recto-verso automatique pour une productivité maximale. Solution professionnelle pour volumes moyens à élevés.`,
    price: 1450000,
    priceUnit: 'XOF',
    images: [
      'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800&q=80',
    stock: 3,
    featured: true,
    new: true,
    specifications: {
      'Type d\'impression': 'Sublimation thermique',
      'Faces': 'Recto-verso automatique',
      'Résolution': '300 dpi',
      'Vitesse': '140 cartes/heure (recto), 85 cartes/heure (recto-verso)',
      'Capacité chargeur': '100 cartes',
      'Connectivité': 'USB, Ethernet',
      'Encodage': 'Magnétique, puce contact, sans contact',
      'Garantie': '3 ans constructeur',
    },
    features: [
      'Impression recto-verso automatique',
      'Haute vitesse de production',
      'Encodage multi-technologies',
      'Qualité photographique exceptionnelle',
      'Compatible avec cartes à puce',
      'Idéal pour badges sécurisés et cartes d\'accès',
    ],
  },

  {
    id: 'entrust-sd460',
    name: 'Entrust Datacard SD460',
    slug: 'entrust-datacard-sd460',
    category: 'imprimantes',
    brand: 'Entrust Datacard',
    shortDescription: 'Imprimante industrielle pour grands volumes',
    description: `L'Entrust Datacard SD460 est la solution haut de gamme pour les productions industrielles. Performance, fiabilité et sécurité maximales.`,
    price: 2850000,
    priceUnit: 'XOF',
    images: [
      'https://images.unsplash.com/photo-1603380353725-f8a4d39cc41e?w=800&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1603380353725-f8a4d39cc41e?w=800&q=80',
    stock: 2,
    featured: true,
    new: true,
    specifications: {
      'Type d\'impression': 'Sublimation thermique',
      'Faces': 'Recto-verso automatique',
      'Résolution': '300 dpi',
      'Vitesse': '200+ cartes/heure',
      'Capacité chargeur': '200 cartes',
      'Connectivité': 'USB, Ethernet, Wi-Fi',
      'Encodage': 'Magnétique, puce contact/sans contact, RFID',
      'Garantie': '3 ans constructeur',
    },
    features: [
      'Performance industrielle haute cadence',
      'Double chargeur pour production continue',
      'Encodage multi-technologies simultané',
      'Module de lamination intégré',
      'Sécurité renforcée avec hologrammes',
      'Idéal pour cartes bancaires, passeports, CNI',
    ],
  },

  // ═══════════════════════════════════
  // CARTES PVC STANDARDS
  // ═══════════════════════════════════
  
  {
    id: 'carte-pvc-blanche',
    name: 'Cartes PVC Blanches Vierges',
    slug: 'cartes-pvc-blanches-vierges',
    category: 'cartes-pvc',
    brand: 'Generic',
    shortDescription: 'Cartes PVC blanches CR80 standard pour impression',
    description: `Cartes PVC blanches vierges de haute qualité, format CR80 standard (85.6 x 53.98 mm). Compatibles avec toutes imprimantes de cartes. Parfaites pour badges employés, cartes membres, etc.`,
    price: 500,
    priceUnit: 'unit',
    images: [
      'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=800&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=800&q=80',
    stock: 10000,
    featured: true,
    new: false,
    specifications: {
      'Format': 'CR80 (85.6 x 53.98 mm)',
      'Épaisseur': '0.76 mm (30 mil)',
      'Matériau': 'PVC blanc opaque',
      'Finition': 'Mat',
      'Température impression': '-30°C à +50°C',
      'Conditionnement': 'Paquets de 100 cartes',
    },
    features: [
      'Compatible toutes imprimantes',
      'Qualité professionnelle',
      'Résistant aux UV et à l\'eau',
      'Surface optimisée pour impression',
      'Prix dégressif par quantité',
      'Stock permanent disponible',
    ],
  },

  {
    id: 'carte-pvc-preimprimee',
    name: 'Cartes PVC Pré-imprimées Couleur',
    slug: 'cartes-pvc-preimprimees-couleur',
    category: 'cartes-pvc',
    brand: 'Generic',
    shortDescription: 'Cartes avec fond couleur ou motif déjà imprimé',
    description: `Cartes PVC avec design de fond pré-imprimé pour économiser du temps et des consommables. Plusieurs couleurs et motifs disponibles.`,
    price: 800,
    priceUnit: 'unit',
    images: [
      'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800&q=80',
    stock: 5000,
    featured: false,
    new: false,
    specifications: {
      'Format': 'CR80 (85.6 x 53.98 mm)',
      'Épaisseur': '0.76 mm',
      'Couleurs': 'Bleu, Rouge, Vert, Or, Argent',
      'Finition': 'Brillant',
      'Zone imprimable': 'Centre réservé pour impression',
    },
    features: [
      'Gain de temps d\'impression',
      'Économie de ruban couleur',
      'Design professionnel prêt à l\'emploi',
      'Plusieurs modèles disponibles',
      'Idéal pour cartes membres VIP',
    ],
  },

  // ═══════════════════════════════════
  // CARTES MAGNÉTIQUES
  // ═══════════════════════════════════
  
  {
    id: 'carte-magnetique-hico',
    name: 'Cartes Magnétiques HiCo',
    slug: 'cartes-magnetiques-hico',
    category: 'cartes-magnetiques',
    brand: 'Generic',
    shortDescription: 'Cartes avec bande magnétique haute coercivité',
    description: `Cartes PVC avec bande magnétique haute coercivité (HiCo 2750 Oe). Sécurité renforcée, idéales pour contrôle d'accès et badges sécurisés.`,
    price: 1200,
    priceUnit: 'unit',
    images: [
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    stock: 3000,
    featured: true,
    new: false,
    specifications: {
      'Format': 'CR80',
      'Bande magnétique': 'HiCo 2750 Oe',
      'Pistes': '3 pistes (Track 1, 2, 3)',
      'Norme': 'ISO 7811',
      'Durabilité': '1000+ passages',
      'Encodage': 'Requiert encodeur magnétique',
    },
    features: [
      'Haute coercivité pour sécurité maximale',
      'Résistant à la démagnétisation',
      'Compatible lecteurs standards',
      'Durée de vie élevée',
      'Idéal pour badges d\'accès sécurisés',
      'Norme internationale ISO',
    ],
  },

  {
    id: 'carte-magnetique-loco',
    name: 'Cartes Magnétiques LoCo',
    slug: 'cartes-magnetiques-loco',
    category: 'cartes-magnetiques',
    brand: 'Generic',
    shortDescription: 'Cartes avec bande magnétique basse coercivité',
    description: `Cartes PVC avec bande magnétique basse coercivité (LoCo 300 Oe). Solution économique pour applications courantes.`,
    price: 900,
    priceUnit: 'unit',
    images: [
      'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=800&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=800&q=80',
    stock: 5000,
    featured: false,
    new: false,
    specifications: {
      'Format': 'CR80',
      'Bande magnétique': 'LoCo 300 Oe',
      'Pistes': '3 pistes',
      'Norme': 'ISO 7811',
      'Durabilité': '500+ passages',
    },
    features: [
      'Solution économique',
      'Facile à encoder',
      'Compatible tous lecteurs',
      'Idéal pour cartes fidélité, parking',
      'Stock important disponible',
    ],
  },

  // ═══════════════════════════════════
  // CARTES À PUCE CONTACT
  // ═══════════════════════════════════
  
  {
    id: 'carte-puce-contact-sle4428',
    name: 'Cartes à Puce Contact SLE4428',
    slug: 'cartes-puce-contact-sle4428',
    category: 'cartes-puce',
    brand: 'Infineon',
    shortDescription: 'Cartes à puce contact avec mémoire 1KB',
    description: `Cartes PVC avec puce contact SLE4428 (1KB). Sécurité élevée avec code PIN. Idéales pour applications bancaires et sécurisées.`,
    price: 2500,
    priceUnit: 'unit',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
    stock: 2000,
    featured: true,
    new: false,
    specifications: {
      'Puce': 'SLE4428 / SLE5528',
      'Mémoire': '1 KB (1024 bytes)',
      'Interface': 'Contact ISO 7816',
      'Protocole': 'I2C',
      'Sécurité': 'Code PIN 3 tentatives',
      'Cycles d\'écriture': '100 000 cycles',
      'Norme': 'ISO 7816-1/2/3',
    },
    features: [
      'Sécurité renforcée avec PIN',
      'Haute fiabilité',
      'Compatible lecteurs ISO 7816',
      'Durée de vie 10 ans',
      'Idéal cartes bancaires, CNI, passeports',
      'Certifiée ISO',
    ],
  },

  {
    id: 'carte-puce-javacard',
    name: 'Cartes à Puce JavaCard',
    slug: 'cartes-puce-javacard',
    category: 'cartes-puce',
    brand: 'NXP',
    shortDescription: 'Cartes à puce programmables Java',
    description: `Cartes à puce contact programmables en Java. Solution flexible pour applications personnalisées et systèmes complexes.`,
    price: 4500,
    priceUnit: 'unit',
    images: [
      'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?w=800&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?w=800&q=80',
    stock: 1000,
    featured: false,
    new: true,
    specifications: {
      'Puce': 'JCOP 3.0 / 4.0',
      'Mémoire': 'Jusqu\'à 150 KB',
      'OS': 'JavaCard 3.0.x',
      'Crypto': 'AES, RSA, ECC',
      'Interface': 'Contact ISO 7816',
    },
    features: [
      'Programmable en Java',
      'Multi-applications',
      'Cryptographie avancée',
      'Haute sécurité bancaire',
      'Personnalisation complète possible',
    ],
  },

  // ═══════════════════════════════════
  // CARTES RFID / SANS CONTACT
  // ═══════════════════════════════════
  
  {
    id: 'carte-rfid-mifare-classic',
    name: 'Cartes RFID Mifare Classic 1K',
    slug: 'cartes-rfid-mifare-classic-1k',
    category: 'cartes-rfid',
    brand: 'NXP',
    shortDescription: 'Cartes RFID 13.56MHz Mifare Classic',
    description: `Cartes RFID Mifare Classic 1K, la solution la plus répandue pour le contrôle d'accès. Compatible avec la majorité des systèmes installés.`,
    price: 1500,
    priceUnit: 'unit',
    images: [
      'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80',
    stock: 8000,
    featured: true,
    new: false,
    specifications: {
      'Puce': 'Mifare Classic 1K (S50)',
      'Fréquence': '13.56 MHz',
      'Norme': 'ISO 14443A',
      'Mémoire': '1 KB (1024 bytes)',
      'Distance lecture': 'Jusqu\'à 10 cm',
      'Durée de vie': '100 000 cycles',
    },
    features: [
      'Standard le plus utilisé',
      'Compatible majorité des lecteurs',
      'Sans contact pratique',
      'Très bonne portée de lecture',
      'Idéal pour badges d\'accès',
      'Prix très compétitif',
    ],
  },

  {
    id: 'carte-rfid-mifare-desfire',
    name: 'Cartes RFID Mifare DESFire EV2',
    slug: 'cartes-rfid-mifare-desfire-ev2',
    category: 'cartes-rfid',
    brand: 'NXP',
    shortDescription: 'Cartes RFID haute sécurité DESFire',
    description: `Cartes Mifare DESFire EV2, le summum de la sécurité RFID. Cryptographie AES 128 bits, multi-applications, idéales pour systèmes complexes.`,
    price: 3500,
    priceUnit: 'unit',
    images: [
      'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=800&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=800&q=80',
    stock: 3000,
    featured: true,
    new: true,
    specifications: {
      'Puce': 'Mifare DESFire EV2',
      'Fréquence': '13.56 MHz',
      'Norme': 'ISO 14443A',
      'Mémoire': 'Jusqu\'à 8 KB',
      'Cryptographie': 'AES 128, DES, 3DES',
      'Multi-app': 'Jusqu\'à 28 applications',
    },
    features: [
      'Sécurité maximale certifiée EAL5+',
      'Multi-applications sur une seule carte',
      'Cryptographie AES 128 bits',
      'Compatible transports publics',
      'Idéal badges haute sécurité',
      'Norme bancaire',
    ],
  },

  {
    id: 'carte-rfid-em4200',
    name: 'Cartes RFID EM4200 125KHz',
    slug: 'cartes-rfid-em4200-125khz',
    category: 'cartes-rfid',
    brand: 'EM Microelectronic',
    shortDescription: 'Cartes RFID basse fréquence lecture seule',
    description: `Cartes RFID EM4200 à 125 KHz, lecture seule. Solution économique pour contrôle d'accès basique et gestion de présence.`,
    price: 800,
    priceUnit: 'unit',
    images: [
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
    stock: 10000,
    featured: false,
    new: false,
    specifications: {
      'Puce': 'EM4200 / TK4100',
      'Fréquence': '125 KHz',
      'Type': 'Lecture seule',
      'Distance': 'Jusqu\'à 8 cm',
      'Format ID': '64 bits',
    },
    features: [
      'Solution très économique',
      'Lecture seule sécurisée',
      'Système simple et fiable',
      'Compatible lecteurs 125KHz',
      'Idéal contrôle accès basique',
      'Stock permanent',
    ],
  },

  // ═══════════════════════════════════
  // CARTES NFC
  // ═══════════════════════════════════
  
  {
    id: 'carte-nfc-ntag213',
    name: 'Cartes NFC NTAG213',
    slug: 'cartes-nfc-ntag213',
    category: 'cartes-nfc',
    brand: 'NXP',
    shortDescription: 'Cartes NFC pour smartphones',
    description: `Cartes NFC NTAG213 compatibles avec tous les smartphones. Parfaites pour cartes de visite digitales, marketing interactif, paiement mobile.`,
    price: 1800,
    priceUnit: 'unit',
    images: [
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80',
    stock: 5000,
    featured: true,
    new: true,
    specifications: {
      'Puce': 'NTAG213',
      'Fréquence': '13.56 MHz',
      'Norme': 'ISO 14443A, NFC Type 2',
      'Mémoire': '144 bytes utilisateur',
      'Compatible': 'Tous smartphones NFC',
      'Lecture/Écriture': 'Oui (réinscriptible)',
    },
    features: [
      'Compatible Android et iPhone',
      'Lecture instantanée par smartphone',
      'Réinscriptible facilement',
      'Idéal cartes de visite digitales',
      'Marketing interactif',
      'Pas d\'app requise',
    ],
  },

  {
    id: 'carte-nfc-ntag216',
    name: 'Cartes NFC NTAG216',
    slug: 'cartes-nfc-ntag216',
    category: 'cartes-nfc',
    brand: 'NXP',
    shortDescription: 'Cartes NFC haute capacité',
    description: `Cartes NFC NTAG216 avec mémoire étendue. Idéales pour applications nécessitant plus de données (vCard détaillée, URLs multiples).`,
    price: 2200,
    priceUnit: 'unit',
    images: [
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    stock: 3000,
    featured: false,
    new: true,
    specifications: {
      'Puce': 'NTAG216',
      'Fréquence': '13.56 MHz',
      'Norme': 'ISO 14443A, NFC Type 2',
      'Mémoire': '888 bytes utilisateur',
      'Compatible': 'Tous smartphones NFC',
    },
    features: [
      'Mémoire 6x supérieure au NTAG213',
      'Stockage de données étendues',
      'Parfait pour vCard complète',
      'URLs multiples possibles',
      'Compatible tous smartphones',
    ],
  },
]

// Fonctions utilitaires
export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter(p => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter(p => p.featured)
}

export function getNewProducts(): Product[] {
  return PRODUCTS.filter(p => p.new)
}

export const CATEGORIES = [
  { id: 'all', name: 'Tous les produits', slug: 'all' },
  { id: 'imprimantes', name: 'Imprimantes', slug: 'imprimantes' },
  { id: 'cartes-pvc', name: 'Cartes PVC', slug: 'cartes-pvc' },
  { id: 'cartes-magnetiques', name: 'Cartes Magnétiques', slug: 'cartes-magnetiques' },
  { id: 'cartes-puce', name: 'Cartes à Puce', slug: 'cartes-puce' },
  { id: 'cartes-rfid', name: 'Cartes RFID', slug: 'cartes-rfid' },
  { id: 'cartes-nfc', name: 'Cartes NFC', slug: 'cartes-nfc' },
  { id: 'accessoires', name: 'Accessoires', slug: 'accessoires' },
]