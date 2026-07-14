export interface Customer {
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  accountId: string;
  monthlySpendUsd: number;
}

export interface Ticket {
  id: string;
  subject: string;
  message: string;
  customer: Customer;
  createdAt: string;
  purchaseDate?: string;
  status: 'open' | 'pending' | 'closed';
  internalNotes: string[];
}

export interface PolicyDoc {
  id: string;
  title: string;
  body: string;
  status: 'active' | 'deprecated';
  audience: 'public' | 'internal';
  updatedAt: string;
}

export interface Citation {
  docId: string;
  title: string;
  snippet: string;
}

export interface TriageResult {
  ticketId: string;
  category: string;
  urgency: string;
  escalate: boolean;
  reply: string;
  reasoning: string;
  citations: Citation[];
  generatedAt: string;
}

export interface TicketSummary {
  id: string;
  subject: string;
  customerName: string;
  plan: Customer['plan'];
  status: Ticket['status'];
  createdAt: string;
  lastTriage?: {
    category: string;
    urgency: string;
    escalate: boolean;
  };
}
