export interface Participant {
  id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  category: ParticipantCategory;
  accessLevel: string; // AccessLevel ID
  registrationDate: Date;
  status: 'registered' | 'confirmed' | 'checked-in' | 'no-show' | 'cancelled';
  badgeId?: string;
  qrCode?: string;
  nfcId?: string;
  checkIns: CheckIn[];
  metadata: Record<string, any>;
}

export type ParticipantCategory = 
  | 'attendee' 
  | 'speaker' 
  | 'exhibitor' 
  | 'sponsor' 
  | 'vip' 
  | 'staff' 
  | 'press';

export interface CheckIn {
  id: string;
  participantId: string;
  zoneId: string;
  timestamp: Date;
  scannerUserId?: string;
  method: 'qr' | 'nfc' | 'rfid' | 'manual';
  metadata?: Record<string, any>;
}

export interface LeadCapture {
  id: string;
  scannerId: string; // Participant qui scanne
  scannedId: string; // Participant scanné
  eventId: string;
  timestamp: Date;
  location?: string;
  notes?: string;
  consentGiven: boolean;
}

