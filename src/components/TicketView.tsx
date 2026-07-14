import { useEffect, useState } from 'react';
import type { Ticket, TriageResult } from '../../shared/types';
import { fetchTicket, fetchTriage, generateTriage } from '../api';
import { TriagePanel } from './TriagePanel';

interface Props {
  ticketId: string;
  onTriageComplete: () => void;
}

export function TicketView({ ticketId, onTriageComplete }: Props) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const [triageLoading, setTriageLoading] = useState(false);
  const [triageError, setTriageError] = useState<string | null>(null);

  useEffect(() => {
    setTicket(null);
    fetchTicket(ticketId).then(setTicket).catch(() => setTicket(null));

    // Load the existing triage, or generate one on first view.
    setTriageLoading(true);
    setTriageError(null);
    fetchTriage(ticketId)
      .catch(() => generateTriage(ticketId).then((r) => (onTriageComplete(), r)))
      .then((result) => setTriage(result))
      .catch((e: Error) => setTriageError(e.message))
      .finally(() => setTriageLoading(false));
  }, [ticketId]);

  const regenerate = () => {
    setTriageLoading(true);
    setTriageError(null);
    generateTriage(ticketId)
      .then((result) => {
        setTriage(result);
        onTriageComplete();
      })
      .catch((e: Error) => setTriageError(e.message))
      .finally(() => setTriageLoading(false));
  };

  if (!ticket) return <div className="empty-state">Loading ticket…</div>;

  return (
    <div className="ticket-view">
      <section className="ticket-details card">
        <div className="ticket-details-header">
          <h2>{ticket.subject}</h2>
          <span className="ticket-id">{ticket.id}</span>
        </div>
        <dl className="customer-meta">
          <div>
            <dt>Customer</dt>
            <dd>
              {ticket.customer.name} ({ticket.customer.email})
            </dd>
          </div>
          <div>
            <dt>Plan</dt>
            <dd className={`plan plan-${ticket.customer.plan}`}>{ticket.customer.plan}</dd>
          </div>
          <div>
            <dt>Monthly spend</dt>
            <dd>${ticket.customer.monthlySpendUsd}</dd>
          </div>
          {ticket.purchaseDate && (
            <div>
              <dt>Purchase date</dt>
              <dd>{new Date(ticket.purchaseDate).toLocaleDateString()}</dd>
            </div>
          )}
        </dl>
        <h3>Customer message</h3>
        <blockquote className="customer-message">{ticket.message}</blockquote>
        {ticket.internalNotes.length > 0 && (
          <>
            <h3>
              Internal notes <span className="internal-tag">internal only</span>
            </h3>
            <ul className="internal-notes">
              {ticket.internalNotes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      <TriagePanel
        triage={triage}
        loading={triageLoading}
        error={triageError}
        onRegenerate={regenerate}
      />
    </div>
  );
}
