import { beforeEach, describe, expect, it } from 'vitest';
import { runTriage } from '../server/triage/triageService';
import { db, getTicket } from '../server/store';
import { setLLMClient } from '../server/llm/client';
import { MockLLM } from '../server/llm/mock';

describe('runTriage (with mock LLM)', () => {
  beforeEach(() => {
    setLLMClient(new MockLLM());
    db.triageResults.clear();
  });

  it('produces a complete triage result for a simple ticket', async () => {
    const ticket = getTicket('T-1012')!; // praise ticket, no edge cases
    const result = await runTriage(ticket);
    expect(result.ticketId).toBe('T-1012');
    expect(result.category).toBeTruthy();
    expect(result.urgency).toBeTruthy();
    expect(typeof result.escalate).toBe('boolean');
    expect(result.reply.length).toBeGreaterThan(20);
  });

  it('stores the result so the list view can show badges', async () => {
    const ticket = getTicket('T-1011')!;
    await runTriage(ticket);
    expect(db.triageResults.get('T-1011')).toBeDefined();
  });

  it('attaches citations for retrieved policies', async () => {
    const ticket = getTicket('T-1003')!; // enterprise outage
    const result = await runTriage(ticket);
    expect(result.citations.length).toBeGreaterThan(0);
    expect(result.citations.map((c) => c.docId)).toContain('policy-enterprise-sla');
  });
});
