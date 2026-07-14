import { describe, expect, it } from 'vitest';
import { buildTriagePrompt, SYSTEM_PROMPT } from '../server/triage/promptBuilder';
import { tickets } from '../server/data/tickets';
import { policies } from '../server/data/policies';

describe('buildTriagePrompt', () => {
  const ticket = tickets.find((t) => t.id === 'T-1001')!;

  it('includes the customer message', () => {
    const prompt = buildTriagePrompt(ticket, []);
    expect(prompt).toContain('Could I get a refund?');
  });

  it('includes retrieved policy text', () => {
    const sla = policies.find((p) => p.id === 'policy-enterprise-sla')!;
    const prompt = buildTriagePrompt(ticket, [sla]);
    expect(prompt).toContain('99.9% monthly uptime');
  });

  it('includes customer plan and spend for context', () => {
    const prompt = buildTriagePrompt(ticket, []);
    expect(prompt).toContain('pro plan');
    expect(prompt).toContain('$49/mo');
  });
});

describe('SYSTEM_PROMPT', () => {
  it('asks for the structured fields the app depends on', () => {
    for (const field of ['category', 'urgency', 'escalate', 'reply']) {
      expect(SYSTEM_PROMPT).toContain(`"${field}"`);
    }
  });
});
