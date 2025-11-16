export interface Module {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  dependencies?: string[];
  features: string[];
}

export interface ModuleConfig {
  modules: Record<string, Module>;
  dependencies: Record<string, string[]>;
}

export const moduleConfig: ModuleConfig = {
  modules: {
    virtualCards: {
      id: 'virtual-cards',
      name: 'Cartes Virtuelles NFC',
      description: 'Gestion des cartes virtuelles avec support NFC',
      enabled: true,
      features: [
        'Création de cartes',
        'Personnalisation du design',
        'Partage NFC',
        'Analytics',
      ],
    },
    printers: {
      id: 'printers',
      name: 'Imprimantes',
      description: 'Gestion des imprimantes de cartes',
      enabled: true,
      dependencies: ['pvcCards'],
      features: [
        'Catalogue imprimantes',
        'Configuration',
        'Maintenance',
        'Support technique',
      ],
    },
    pvcCards: {
      id: 'pvc-cards',
      name: 'Cartes PVC',
      description: 'Gestion des cartes PVC physiques',
      enabled: true,
      features: [
        'Commande de cartes',
        'Personnalisation',
        'Suivi de production',
        'Qualité',
      ],
    },
    readers: {
      id: 'readers',
      name: 'Lecteurs',
      description: 'Gestion des lecteurs de cartes',
      enabled: true,
      features: [
        'Catalogue lecteurs',
        'Configuration',
        'Compatibilité',
        'Support',
      ],
    },
  },
  dependencies: {
    printers: ['pvcCards'],
    virtualCards: [],
    pvcCards: [],
    readers: [],
  },
};