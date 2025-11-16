export interface AccessControlRule {
  id: string;
  eventId: string;
  zoneId: string;
  accessLevelIds: string[];
  timeRestrictions?: TimeRestriction[];
  capacityLimit?: number;
  requiresConfirmation: boolean;
}

export interface TimeRestriction {
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  daysOfWeek?: number[]; // 0-6 (dimanche-samedi)
}

export interface AccessAttempt {
  id: string;
  participantId: string;
  zoneId: string;
  timestamp: Date;
  granted: boolean;
  reason?: string;
  method: 'qr' | 'nfc' | 'rfid' | 'manual';
}

