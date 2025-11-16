/**
 * Types pour le système d'authentification à double niveau (Buyer + Creator)
 * 
 * Ce fichier définit les types pour les rôles utilisateur, les profils
 * et les inscriptions progressives basées sur la valeur maximale.
 */

import { Product } from './product';

// ============================================================================
// RÔLES UTILISATEUR
// ============================================================================

/**
 * Rôles principaux du système
 */
export type UserRole = 'admin' | 'customer' | null;

/**
 * Rôles métier (peuvent être combinés)
 */
export type BusinessRole = 'buyer' | 'creator';

/**
 * État d'activation des rôles métier
 */
export interface RoleActivationStatus {
  isBuyer: boolean;
  isCreator: boolean;
  buyerActivatedAt?: string;
  creatorActivatedAt?: string;
}

// ============================================================================
// UTILISATEUR ÉTENDU
// ============================================================================

/**
 * Utilisateur avec rôles multiples
 */
export interface ExtendedUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  company: string | null;
  role: UserRole;
  
  // Rôles métier
  buyer_role_activated: boolean;
  creator_role_activated: boolean;
  buyer_activated_at?: string;
  creator_activated_at?: string;
  
  // Dates
  created_at: string;
  updated_at: string;

  // Profils étendus (optionnel, chargé à la demande)
  buyerProfile?: BuyerProfile;
  creatorProfile?: CreatorProfile;
}

// ============================================================================
// PROFIL ACHETEUR (BUYER)
// ============================================================================

export interface BuyerProfile {
  id: string;
  total_orders: number;
  total_spent: number; // en centimes/CFA
  favorite_categories: string[];
  default_shipping_address_id?: string;
  reward_points: number;
  created_at: string;
  updated_at: string;
}

export interface BuyerAddress {
  id: string;
  user_id: string;
  is_default: boolean;
  label?: string; // 'Maison', 'Bureau', etc.
  street_address: string;
  city: string;
  postal_code?: string;
  country: string;
  phone?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BuyerFavorite {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  added_at: string;
}

// ============================================================================
// PROFIL CRÉATEUR (CREATOR)
// ============================================================================

export interface CreatorProfile {
  id: string;
  total_designs: number;
  total_exports: number;
  total_templates: number;
  public_profile_url?: string;
  bio?: string;
  specialties: string[];
  created_at: string;
  updated_at: string;
}

export interface CreatorDesign {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  design_data: Record<string, any>; // Données du design
  thumbnail_url?: string;
  is_public: boolean;
  is_favorite: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CreatorTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  thumbnail_url?: string;
  template_data: Record<string, any>;
  is_public: boolean;
  is_premium: boolean;
  downloads_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// INSCRIPTION PROGRESSIVE
// ============================================================================

/**
 * Types d'activités déclenchant une inscription progressive
 */
export type ActivityType =
  | 'first_order'
  | 'order_above_threshold'
  | 'third_design'
  | 'first_export'
  | 'template_shared'
  | 'profile_completed';

/**
 * Métadonnées associées à une activité
 */
export interface ActivityMetadata {
  orderTotal?: number;
  orderId?: string;
  designId?: string;
  exportType?: string;
  templateId?: string;
  threshold?: number;
  [key: string]: any;
}

/**
 * Enregistrement d'activité utilisateur
 */
export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  metadata: ActivityMetadata;
  created_at: string;
}

// ============================================================================
// SRAI PROGRESSIVE & TRIGGERS
// ============================================================================

/**
 * Seuils pour déclencher l'activation des rôles
 */
export interface ProgressiveActivationThresholds {
  buyer: {
    minOrderAmount: number; // Montant minimum pour déclencher inscription
    requiredOrders: number; // Nombre de commandes ou montant total
  };
  creator: {
    minDesigns: number; // Nombre de designs minimum
    minExports: number; // Nombre d'exports minimum
    alternativeTrigger?: 'template_shared' | 'profile_completed';
  };
}

/**
 * Configuration par défaut des seuils
 */
export const DEFAULT_THRESHOLDS: ProgressiveActivationThresholds = {
  buyer: {
    minOrderAmount: 50000, // 50,000 FCFA
    requiredOrders: 1, // Une seule commande suffit
  },
  creator: {
    minDesigns: 3,
    minExports: 1,
    alternativeTrigger: 'template_shared',
  },
};

/**
 * État de progression vers l'activation d'un rôle
 */
export interface RoleProgressionStatus {
  role: BusinessRole;
  isActivated: boolean;
  progress: number; // 0-100
  remainingActions: number;
  threshold: number;
  currentValue: number;
}

// ============================================================================
// HOOKS & STORE TYPES
// ============================================================================

/**
 * État d'authentification avec rôles multiples
 */
export interface AuthStateWithRoles {
  user: ExtendedUser | null;
  isAuthenticated: boolean;
  isBuyer: boolean;
  isCreator: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Actions d'authentification étendues
 */
export interface AuthActions {
  // Authentification de base
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  
  // Activation progressive des rôles
  activateBuyerRole: () => Promise<void>;
  activateCreatorRole: () => Promise<void>;
  
  // Vérification de progression
  checkBuyerProgression: () => Promise<RoleProgressionStatus>;
  checkCreatorProgression: () => Promise<RoleProgressionStatus>;
  
  // Chargement des profils
  loadBuyerProfile: () => Promise<BuyerProfile | null>;
  loadCreatorProfile: () => Promise<CreatorProfile | null>;
}

// ============================================================================
// UI TYPES
// ============================================================================

/**
 * Props pour les composants d'inscription progressive
 */
export interface ProgressiveOnboardingProps {
  role: BusinessRole;
  onComplete: () => void;
  onSkip: () => void;
}

/**
 * Props pour les comptes hybrides
 */
export interface HybridAccountDashboardProps {
  activeRole: BusinessRole | 'both';
  onRoleSwitch: (role: BusinessRole) => void;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ActivateRoleResponse {
  success: boolean;
  role: BusinessRole;
  activatedAt: string;
  profile?: BuyerProfile | CreatorProfile;
  error?: string;
}

export interface ProgressionCheckResponse {
  role: BusinessRole;
  progress: number;
  remaining: number;
  threshold: number;
  currentValue: number;
  canActivate: boolean;
}

