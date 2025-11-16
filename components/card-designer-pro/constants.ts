export const CARD_CONSTANTS = {
  PHYSICAL: {
    WIDTH_MM: 85.6,
    HEIGHT_MM: 53.98,
    CORNER_RADIUS_MM: 3.18,
  },
  CANVAS: {
    // Dimensions simplifiées pour affichage optimal
    WIDTH: 900,
    HEIGHT: 568,   // ~ratio 1.585 (85.6 / 53.98)
    SCALE_FACTOR: 10.5,
    
    // Ratio réel à respecter
    ASPECT_RATIO: 900 / 568,  // ~1.585
  },
  // Viewport (zone visible à l'écran)
  VIEWPORT: {
    PADDING: 100,  // Espace autour de la carte
    MIN_ZOOM: 0.25,
    MAX_ZOOM: 4,
    FIT_ZOOM: 0.85, // Zoom pour "fit to screen"
  },
  SAFE_ZONES: {
    BLEED: 20,          // Zone de débord pour impression
    MARGIN: 50,         // Marge de sécurité intérieure
    SHOW_BY_DEFAULT: false,  // Afficher les zones par défaut
  },
  ZOOM: {
    MIN: 0.25,
    MAX: 4,
    DEFAULT: 1,
    STEP: 0.1,
  },
  GRID: {
    SIZE: 10,
    COLOR: 'rgba(0, 0, 0, 0.1)',
  },
  SNAP: {
    THRESHOLD: 5,
  },
}

export const THEME = {
  COLORS: {
    PRIMARY: '#FF6B35',
    SECONDARY: '#F72585',
    BACKGROUND: {
      CANVAS: '#F8F9FA',
      PANEL: '#FFFFFF',
      TOOLBAR: '#F1F3F5',
    },
  },
  SHADOWS: {
    CARD: '0 8px 30px rgba(0, 0, 0, 0.12)',
  },
}

export const FABRIC_CONFIG = {
  CANVAS: {
    backgroundColor: '#FFFFFF',
    selection: true,
    enableRetinaScaling: true,
  },
  DEFAULTS: {
    cornerColor: THEME.COLORS.PRIMARY,
    cornerStyle: 'circle',
    cornerSize: 10,
  },
  TEXT: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 24,
    fill: '#000000',
  },
}

export const TOOLS = {
  SELECT: 'select',
  TEXT: 'text',
  IMAGE: 'image',
  SHAPE: 'shape',
  QRCODE: 'qrcode',
}

