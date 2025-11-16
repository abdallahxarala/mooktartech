const fs = require('fs').promises;
const path = require('path');

/**
 * PRODUITS IDENTIFIÉS DANS LES PDFs
 */
const productsData = [
  {
    id: 'entrust-sigma-dse',
    name: 'Entrust Sigma DSE',
    category: 'imprimantes',
    brand: 'Entrust',
    shortDescription: 'Imprimante de cartes direct-to-card pour besoins essentiels',
    description: `L'imprimante Entrust Sigma DSE est spécialement conçue pour les environnements cloud d'aujourd'hui et pour répondre à vos besoins essentiels tout en vous donnant la possibilité d'émettre facilement des identités sécurisées.`,
    
    features: [
      'Impression recto simple face',
      'Résolution 300 dpi (300x600, 300x1200)',
      'Jusqu\'à 185 cartes/heure en couleur',
      'Jusqu\'à 750 cartes/heure en monochrome',
      'Capacité: 100 cartes (entrée), 25 cartes (sortie)',
      'Tableau de bord intuitif mobile',
      'Protecteur de tête d\'impression breveté',
      'Démarrage sécurisé',
      'Connexion et données chiffrées',
      'Compatible Windows, Linux'
    ],
    
    specifications: {
      printTechnology: 'Sublimation thermique',
      printCapabilities: 'Recto',
      resolution: '300 dpi',
      printSpeed: '185 cartes/h (couleur), 750 cartes/h (mono)',
      cardCapacity: { input: 100, output: 25 },
      connectivity: 'USB (simplex), USB + Ethernet (duplex)',
      dimensions: '44.5 x 22.6 x 22.9 cm',
      weight: '5.49 kg',
      warranty: '24 mois'
    },
    
    options: [
      'Encodage bande magnétique ISO 7811',
      'Encodage carte à puce contact/sans contact',
      'WiFi',
      'Rubans couleur YMCKT, ymcKT, YMCKT-KT',
      'Rubans monochromes (noir, blanc, argent, or)'
    ],
    
    price: 1850000,
    priceUnit: 'FCFA',
    stock: 3,
    featured: true,
    new: true,
    
    tags: ['imprimante', 'cartes', 'badges', 'identification', 'entrust', 'sigma', 'direct-to-card'],
    
    applications: [
      'Cartes employés',
      'Badges visiteurs',
      'Cartes étudiants',
      'Cartes de contrôle d\'accès',
      'Cartes d\'identification'
    ],
    
    images: [
      '/products/entrust-sigma-dse-1.jpg',
      '/products/entrust-sigma-dse-2.jpg',
      '/products/entrust-sigma-dse-3.jpg'
    ],
    
    pdfSource: 'Sigma_DSE_Datasheet_Draft_EMEA.pdf'
  },

  {
    id: 'datacard-cd800',
    name: 'Datacard CD800',
    category: 'imprimantes',
    brand: 'Datacard',
    shortDescription: 'Imprimante professionnelle haute vitesse pour émission décentralisée',
    description: `L'imprimante Datacard CD800 est la référence professionnelle pour l'impression décentralisée. Elle produit efficacement des cartes d'identité en un temps record avec une qualité exceptionnelle.`,
    
    features: [
      'Impression recto ou recto-verso',
      'Résolution jusqu\'à 300x1200 dpi',
      'Jusqu\'à 220 cartes/heure (couleur)',
      'Jusqu\'à 1000 cartes/heure (monochrome)',
      'Technologie TrueMatch™ pour couleurs fidèles',
      'Système True Pick anti-bourrage',
      'Certification ENERGY STAR®',
      'Supports de ruban biodégradables EcoPure®',
      'Panneau de contrôle LCD',
      'Connexion Ethernet et USB standard'
    ],
    
    specifications: {
      printTechnology: 'Sublimation thermique',
      printCapabilities: 'Recto ou recto-verso',
      resolution: '300x300, 300x600, 300x1200 dpi',
      printSpeed: '220 cartes/h (couleur), 1000 cartes/h (mono)',
      cardCapacity: { input: 100, output: 50 },
      connectivity: 'USB 2.0, Ethernet',
      dimensions: '44.2 x 22.4 x 22.4 cm (simplex), 53.8 x 22.4 x 22.4 cm (duplex)',
      weight: '4.1 kg (simplex), 5.4 kg (duplex)',
      warranty: '30 mois avec tête d\'impression'
    },
    
    options: [
      'Encodage magnétique ISO 7811 3 pistes',
      'Encodage puce contact/sans contact iClass HID',
      'Module d\'impression recto-verso',
      'Bac de sortie 100 cartes',
      'Bac d\'entrée 200 cartes'
    ],
    
    price: 2450000,
    priceUnit: 'FCFA',
    stock: 2,
    featured: true,
    new: false,
    
    tags: ['imprimante', 'cartes', 'datacard', 'professionnel', 'haute-vitesse'],
    
    applications: [
      'Cartes employés et visiteurs',
      'Cartes étudiants',
      'Cartes de parcs de loisir',
      'Cartes de bibliothèque',
      'Cartes de transport',
      'Cartes d\'identité',
      'Forfaits ski',
      'Cartes de fidélité'
    ],
    
    images: [
      '/products/datacard-cd800-1.jpg',
      '/products/datacard-cd800-2.jpg',
      '/products/datacard-cd800-3.jpg'
    ],
    
    pdfSource: 'Datacard_CD800_fr__1_.pdf'
  },

  {
    id: 'entrust-sigma-ds1',
    name: 'Entrust Sigma DS1',
    category: 'imprimantes',
    brand: 'Entrust',
    shortDescription: 'Imprimante directe sur carte ultra-conviviale',
    description: `L'imprimante Entrust Sigma DS1 est la solution d'émission de cartes d'identification la plus conviviale au monde, conçue pour les environnements cloud avec sécurité maximale.`,
    
    features: [
      'Tableau de bord intuitif mobile',
      'Libre-service avec vidéos didactiques (QR code)',
      'Anneau lumineux LED personnalisable',
      'Cassettes de ruban préchargées',
      'Protecteur de tête d\'impression breveté',
      'Démarrage sécurisé et TPM',
      'Données chiffrées',
      'Impression brillante anti-contrefaçon',
      'Compatible flashpass mobiles',
      'Impression depuis mobile (iOS, Android, Windows)'
    ],
    
    specifications: {
      printTechnology: 'Sublimation',
      printCapabilities: 'Recto',
      resolution: '300 dpi (300x600, 300x1200)',
      printSpeed: '175 cartes/h (couleur)',
      cardCapacity: { input: 125, output: 125 },
      connectivity: 'USB',
      dimensions: '44.2 x 22.6 x 22.9 cm',
      weight: '5.12 kg',
      warranty: '36 mois'
    },
    
    options: [
      'Encodage bande magnétique ISO 7811',
      'WiFi 802.11g/n',
      'Encodage carte à puce (contact/sans contact)',
      'Rubans YMCKT, ymcKT, YMCKT-KT, KT, KTT',
      'Impression UV fluorescent, brillante'
    ],
    
    price: 1950000,
    priceUnit: 'FCFA',
    stock: 4,
    featured: true,
    new: true,
    
    tags: ['imprimante', 'sigma', 'entrust', 'convivial', 'mobile', 'cloud'],
    
    applications: [
      'Cartes employés',
      'Badges médicaux',
      'Cartes étudiants',
      'Cartes d\'accès',
      'Identifications sécurisées'
    ],
    
    images: [
      '/products/entrust-sigma-ds1-1.jpg',
      '/products/entrust-sigma-ds1-2.jpg',
      '/products/entrust-sigma-ds1-3.jpg'
    ],
    
    pdfSource: 'imprimante-de-cartes-badges-datacard-entrust-sigma-ds1.pdf'
  },

  {
    id: 'hiti-cs200e',
    name: 'HiTi CS-200e',
    category: 'imprimantes',
    brand: 'HiTi',
    shortDescription: 'Imprimante de badges compacte et silencieuse',
    description: `L'imprimante HiTi CS-200e offre une solution idéale pour l'émission de cartes d'identité avec une excellente productivité et polyvalence.`,
    
    features: [
      'Impression haute vitesse',
      'Fonctionnement silencieux',
      'Interface utilisateur intuitive',
      'Modules optionnels variés',
      'Support multi-épaisseurs de cartes',
      'Logiciel CardDesiree CS inclus',
      'Enrichissement photo couleur',
      'Rendu naturel de la peau'
    ],
    
    specifications: {
      printTechnology: 'Sublimation thermique',
      printCapabilities: 'Recto',
      resolution: '300 dpi continu',
      printSpeed: '21 sec (YMCKO), 4.5 sec (noir)',
      cardCapacity: { input: 100, output: 50 },
      connectivity: 'USB 2.0, Ethernet (module optionnel)',
      dimensions: '19.9 x 20.7 x 35.4 cm',
      weight: '4.9 kg',
      warranty: 'Standard'
    },
    
    options: [
      'Module Flipper (recto-verso)',
      'Trémie haute capacité (400 cartes)',
      'Module encodage carte à puce contact',
      'Module encodage RFID (ISO14443A/B, ISO15693)',
      'Encodage bande magnétique ISO7811',
      'Module Ethernet TCP/IP',
      'Rouleau de nettoyage'
    ],
    
    price: 1650000,
    priceUnit: 'FCFA',
    stock: 5,
    featured: false,
    new: false,
    
    tags: ['imprimante', 'hiti', 'compact', 'silencieux', 'polyvalent'],
    
    applications: [
      'Cartes employés',
      'Badges visiteurs',
      'Cartes étudiants',
      'Cartes de membre'
    ],
    
    images: [
      '/products/hiti-cs200e-1.jpg',
      '/products/hiti-cs200e-2.jpg'
    ],
    
    pdfSource: 'CS200e_EN_A4.pdf'
  },

  {
    id: 'entrust-sigma-ds2',
    name: 'Entrust Sigma DS2',
    category: 'imprimantes',
    brand: 'Entrust',
    shortDescription: 'Imprimante directe sur carte recto-verso performante',
    description: `L'imprimante Entrust Sigma DS2 offre une impression recto-verso haute performance avec une sécurité inégalée et une convivialité exceptionnelle.`,
    
    features: [
      'Impression recto ou recto-verso',
      'Jusqu\'à 225 cartes/heure (recto couleur)',
      'Jusqu\'à 140 cartes/heure (recto-verso couleur)',
      'Jusqu\'à 880 cartes/heure (monochrome)',
      'Tableau de bord intuitif',
      'QR code pour vidéos didactiques',
      'Anneau LED personnalisable',
      'Cassettes préchargées',
      'Sécurité maximale (Secure Boot, TPM, chiffrement)',
      'Compatible cloud et on-premise'
    ],
    
    specifications: {
      printTechnology: 'Sublimation',
      printCapabilities: 'Recto ou recto-verso',
      resolution: '300 dpi (300x600, 300x1200)',
      printSpeed: '225 cartes/h (recto), 140 cartes/h (duplex), 880 cartes/h (mono)',
      cardCapacity: { input: 125, output: 25 },
      connectivity: 'USB, Ethernet',
      dimensions: '44.2 x 22.6 x 22.9 cm',
      weight: '5.49 kg',
      warranty: '36 mois'
    },
    
    options: [
      'Encodage bande magnétique ISO 7811',
      'WiFi 802.11g/n',
      'Encodage carte à puce (contact/sans contact)',
      'Rubans couleur YMCKT, ymcKT, YMCKT-KT, etc.',
      'Impression brillante, UV fluorescent'
    ],
    
    price: 2650000,
    priceUnit: 'FCFA',
    stock: 2,
    featured: true,
    new: true,
    
    tags: ['imprimante', 'sigma', 'entrust', 'recto-verso', 'haute-performance'],
    
    applications: [
      'Cartes employés',
      'Badges médicaux',
      'Cartes étudiants',
      'Identifications gouvernementales',
      'Cartes d\'accès sécurisé'
    ],
    
    images: [
      '/products/entrust-sigma-ds2-1.jpg',
      '/products/entrust-sigma-ds2-2.jpg',
      '/products/entrust-sigma-ds2-3.jpg'
    ],
    
    pdfSource: 'Sigma-DS2-Direct-to-Card-Printer-ds.pdf'
  },

  {
    id: 'entrust-sigma-ds3',
    name: 'Entrust Sigma DS3',
    category: 'imprimantes',
    brand: 'Entrust',
    shortDescription: 'Imprimante directe sur carte recto-verso haut de gamme',
    description: `L'imprimante Entrust Sigma DS3 est la solution premium pour l'émission de cartes d'identification avec des capacités recto-verso ultra-rapides et des fonctionnalités de sécurité avancées.`,
    
    features: [
      'Impression recto-verso ultra-rapide',
      'Jusqu\'à 250 cartes/heure (recto)',
      'Jusqu\'à 180 cartes/heure (recto-verso)',
      'Tableau de bord mobile intuitif',
      'Libre-service avec QR codes',
      'LED personnalisable',
      'Verrouillages facultatifs',
      'Sécurité maximale (TPM, chiffrement)',
      'Compatible flashpass mobiles',
      'Déploiement cloud ou on-premise'
    ],
    
    specifications: {
      printTechnology: 'Sublimation',
      printCapabilities: 'Recto ou recto-verso',
      resolution: '300 dpi (300x600, 300x1200)',
      printSpeed: '250 cartes/h (recto), 180 cartes/h (duplex)',
      cardCapacity: { input: 125, output: 25 },
      connectivity: 'USB, Ethernet',
      dimensions: '44.2 x 22.6 x 22.9 cm',
      weight: '5.49 kg',
      warranty: '36 mois'
    },
    
    options: [
      'Encodage bande magnétique ISO 7811',
      'WiFi 802.11g/n',
      'Encodage carte à puce avancé',
      'Rubans couleur premium',
      'Impression brillante anti-contrefaçon',
      'Plusieurs trémies'
    ],
    
    price: 2950000,
    priceUnit: 'FCFA',
    stock: 1,
    featured: true,
    new: true,
    
    tags: ['imprimante', 'sigma', 'entrust', 'premium', 'ultra-rapide', 'sécurité'],
    
    applications: [
      'Cartes employés',
      'Badges médicaux',
      'Cartes étudiants',
      'Identifications gouvernementales',
      'Cartes bancaires',
      'Cartes d\'accès haute sécurité'
    ],
    
    images: [
      '/products/entrust-sigma-ds3-1.jpg',
      '/products/entrust-sigma-ds3-2.jpg',
      '/products/entrust-sigma-ds3-3.jpg'
    ],
    
    pdfSource: 'sigma-ds3-direct-to-card-printer-ds_fr.pdf'
  }
];

async function generateProductsJSON() {
  const outputPath = path.join(process.cwd(), 'data', 'extracted-products.json');
  
  await fs.writeFile(
    outputPath,
    JSON.stringify(productsData, null, 2),
    'utf-8'
  );
  
  console.log('✅ Produits extraits:', productsData.length);
  console.log('📁 Fichier créé:', outputPath);
  
  return productsData;
}

// Exécuter
generateProductsJSON().then(() => {
  console.log('✅ Extraction terminée !');
});
