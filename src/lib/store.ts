// In-memory store for development/mocking purposes.
export type SlotKey = string; // Format: "venueId|date|slotTime"

interface LockedSlot {
  expiresAt: number;
}

export interface BookingData {
  type: 'public' | 'admin';
  name?: string;
  orgNum?: string;
  email?: string;
  bookedAt: number;
}

export const store = {
  // Stores temporarily locked slots
  lockedSlots: new Map<SlotKey, LockedSlot>(),
  // Stores permanently confirmed bookings and admin blocks
  confirmedBookings: new Map<SlotKey, BookingData>(),
};
