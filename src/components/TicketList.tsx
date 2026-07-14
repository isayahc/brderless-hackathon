import { useState } from 'react';
import type { TicketSummary } from '../../shared/types';

const URGENCY_FILTERS = ['all', 'high', 'medium', 'low'] as const;
type UrgencyFilter = (typeof URGENCY_FILTERS)[number];

interface Props {
  tickets: TicketSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TicketList({ tickets, selectedId, onSelect }: Props) {
  const [filter, setFilter] = useState<UrgencyFilter>('all');

  const visible =
    filter === 'all'
      ? tickets
      : tickets.filter((t) => t.lastTriage?.urgency === filter);

  return (
    <aside className="ticket-list">
      <div className="list-toolbar">
        <span className="list-count">{visible.length} tickets</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as UrgencyFilter)}
          aria-label="Filter by urgency"
        >
          {URGENCY_FILTERS.map((f) => (
            <option key={f} value={f}>
              {f === 'all' ? 'All urgencies' : `Urgency: ${f}`}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {visible.map((t) => (
          <li
            key={t.id}
            className={`ticket-item ${t.id === selectedId ? 'selected' : ''}`}
            onClick={() => onSelect(t.id)}
          >
            <div className="ticket-item-top">
              <span className="ticket-id">{t.id}</span>
              {t.lastTriage && (
                <span className={`badge badge-${t.lastTriage.urgency}`}>
                  {t.lastTriage.urgency}
                </span>
              )}
              {t.lastTriage?.escalate && <span className="badge badge-escalate">escalate</span>}
            </div>
            <div className="ticket-subject">{t.subject}</div>
            <div className="ticket-meta">
              {t.customerName} · <span className={`plan plan-${t.plan}`}>{t.plan}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
