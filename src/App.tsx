import { useCallback, useEffect, useState } from 'react';
import type { TicketSummary } from '../shared/types';
import { fetchTickets } from './api';
import { TicketList } from './components/TicketList';
import { TicketView } from './components/TicketView';

export function App() {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshTickets = useCallback(() => {
    fetchTickets().then(setTickets).catch((e) => setError(e.message));
  }, []);

  useEffect(refreshTickets, [refreshTickets]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          HelpDesk <span className="accent">Copilot</span>
        </h1>
        <p className="tagline">AI-assisted support triage</p>
      </header>
      {error && <div className="error-banner">{error}</div>}
      <div className="layout">
        <TicketList
          tickets={tickets}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <main className="detail-pane">
          {selectedId ? (
            <TicketView ticketId={selectedId} onTriageComplete={refreshTickets} />
          ) : (
            <div className="empty-state">Select a ticket to view details and run AI triage.</div>
          )}
        </main>
      </div>
    </div>
  );
}
