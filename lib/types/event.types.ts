export interface Event {
  id: string;
  name: string;
  description: string;
  type: 'conference' | 'exhibition' | 'seminar' | 'networking' | 'hybrid';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  venue: EventVenue;
  capacity: number;
  badgeTemplate: string; // BadgeTemplate ID
  accessLevels: AccessLevel[];
  checkInEnabled: boolean;
  requiresApproval: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventVenue {
  name: string;
  address: string;
  city: string;
  country: string;
  zones: EventZone[];
}

export interface EventZone {
  id: string;
  name: string;
  description: string;
  capacity: number;
  accessLevels: string[]; // AccessLevel IDs
}

export interface AccessLevel {
  id: string;
  name: string;
  color: string;
  allowedZones: string[]; // Zone IDs
  permissions: string[];
  priority: number;
}

