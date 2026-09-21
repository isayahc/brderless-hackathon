import type { Ticket, TriageResult } from '../../shared/types';
import { db } from '../store';
import { searchPolicies } from '../retrieval/policySearch';
import { buildTriagePrompt, SYSTEM_PROMPT } from './promptBuilder';
import { parseTriageResponse } from './parser';
import { getLLMClient } from '../llm/client';

const REFUND_WINDOW_DAYS = 30;
const DAY_MS = 1000 * 60 * 60 * 24;

function ticketText(ticket: Ticket): string {
  return `${ticket.subject}\n${ticket.message}`.toLowerCase();
}

function daysSincePurchase(ticket: Ticket): number | null {
  if (!ticket.purchaseDate) return null;
  return Math.floor(
    (new Date(ticket.createdAt).getTime() - new Date(ticket.purchaseDate).getTime()) / DAY_MS
  );
}

function requiresEscalation(ticket: Ticket): boolean {
  const text = ticketText(ticket);
  const securityIncident =
    /unauthorized|signed in|sign-in|suspicious login|credential compromise|wasn't me/.test(text);
  const privacyRequest =
    /\bgdpr\b|\bccpa\b|personal data|data export|data deletion|delete my data/.test(text);
  const enterpriseSlaIncident =
    ticket.customer.plan === 'enterprise' && /\boutage\b|\bsla\b|\buptime\b|locked out|service down/.test(text);

  return securityIncident || privacyRequest || enterpriseSlaIncident;
}

function applyBusinessRules(
  ticket: Ticket,
  parsed: ReturnType<typeof parseTriageResponse>
): ReturnType<typeof parseTriageResponse> {
  const text = ticketText(ticket);
  const purchaseAgeDays = daysSincePurchase(ticket);
  const refundRequested = /\brefund\b|money back/.test(text);

  let reply = parsed.reply;
  let reasoning = parsed.reasoning;

  if (refundRequested && purchaseAgeDays !== null && purchaseAgeDays > REFUND_WINDOW_DAYS) {
    reply = [
      'Hi, thanks for reaching out.',
      `Unfortunately your purchase falls outside our ${REFUND_WINDOW_DAYS}-day refund window, so we are unable to process a standard refund.`,
      'If you believe a legal exception applies, please let us know and our support team can review it.',
      'Best regards,\nSupport Team',
    ].join('\n\n');
    reasoning = `${reasoning} Server-side refund eligibility check: purchase is ${purchaseAgeDays} days old, outside the ${REFUND_WINDOW_DAYS}-day window.`.trim();
  }

  return {
    ...parsed,
    escalate: parsed.escalate || requiresEscalation(ticket),
    reply,
    reasoning,
  };
}

export async function runTriage(ticket: Ticket): Promise<TriageResult> {
  const query = `${ticket.subject} ${ticket.message}`;
  const retrieved = searchPolicies(query, db.policies, 3);

  const prompt = buildTriagePrompt(
    ticket,
    retrieved.map((r) => r.doc)
  );

  const llm = getLLMClient();
  const raw = await llm.complete({ system: SYSTEM_PROMPT, user: prompt });
  const parsed = applyBusinessRules(ticket, parseTriageResponse(raw));

  const result: TriageResult = {
    ticketId: ticket.id,
    category: parsed.category,
    urgency: parsed.urgency,
    escalate: parsed.escalate,
    reply: parsed.reply,
    reasoning: parsed.reasoning,
    citations: retrieved.map((r) => ({
      docId: r.doc.id,
      title: r.doc.title,
      snippet: r.doc.body.slice(0, 140) + '…',
    })),
    generatedAt: new Date().toISOString(),
  };

  db.triageResults.set(ticket.id, result);
  console.log(`[triage] ${ticket.id} -> ${result.category}/${result.urgency}`);
  return result;
}
