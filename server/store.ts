import type { Ticket, TriageResult } from '../shared/types';
import { tickets as seedTickets } from './data/tickets';
import { policies as seedPolicies } from './data/policies';

// Simple in-memory store seeded at startup. Restarting the server resets state.
export const db = {
  tickets: [...seedTickets] as Ticket[],
  policies: [...seedPolicies],
  triageResults: new Map<string, TriageResult>(),
};

export function getTicket(id: string): Ticket | undefined {
  return db.tickets.find((t) => t.id === id);
}
