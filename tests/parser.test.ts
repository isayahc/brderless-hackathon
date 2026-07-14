import { describe, expect, it } from 'vitest';
import { parseTriageResponse } from '../server/triage/parser';

const validPayload = {
  category: 'billing',
  urgency: 'medium',
  escalate: false,
  reply: 'Hi, thanks for reaching out.',
  reasoning: 'Standard billing question.',
};

describe('parseTriageResponse', () => {
  it('parses a bare JSON response', () => {
    const result = parseTriageResponse(JSON.stringify(validPayload));
    expect(result.category).toBe('billing');
    expect(result.escalate).toBe(false);
  });

  it('parses JSON wrapped in a markdown code fence', () => {
    const raw = '```json\n' + JSON.stringify(validPayload) + '\n```';
    const result = parseTriageResponse(raw);
    expect(result.reply).toContain('thanks for reaching out');
  });

  it('parses JSON surrounded by prose', () => {
    const raw = `Sure! Here is the triage:\n${JSON.stringify(validPayload)}\nHope that helps.`;
    const result = parseTriageResponse(raw);
    expect(result.urgency).toBe('medium');
  });

  it('throws when no JSON object is present', () => {
    expect(() => parseTriageResponse('I could not triage this ticket.')).toThrow(
      /No JSON object/
    );
  });

  it('throws when a required field is missing', () => {
    const { reply, ...withoutReply } = validPayload;
    expect(() => parseTriageResponse(JSON.stringify(withoutReply))).toThrow(
      /missing field: reply/
    );
  });
});
