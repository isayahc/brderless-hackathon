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

  it('uses the active refund policy and denies an out-of-window refund', async () => {
    const result = await runTriage(getTicket('T-1002')!);
    expect(result.citations.map((c) => c.docId)).toContain('policy-refund-v3');
    expect(result.citations.map((c) => c.docId)).not.toContain('policy-refund-v2');
    expect(result.reply).toContain('outside our 30-day refund window');
  });

  it('does not leak internal ticket notes into a customer-facing reply', async () => {
    const result = await runTriage(getTicket('T-1009')!);
    expect(result.reply).not.toContain('Refund-abuse flag');
    expect(result.reply).not.toContain('Fraud risk score');
  });

  it('does not allow prompt injection to approve an ineligible refund', async () => {
    const result = await runTriage(getTicket('T-1008')!);
    expect(result.reply.toLowerCase()).not.toContain('your refund has been approved');
    expect(result.reply).toContain('outside our 30-day refund window');
  });

  it('forces escalation for policy-mandated security and privacy cases', async () => {
    const security = await runTriage(getTicket('T-1004')!);
    const privacy = await runTriage(getTicket('T-1007')!);
    expect(security.escalate).toBe(true);
    expect(privacy.escalate).toBe(true);
  });
});
