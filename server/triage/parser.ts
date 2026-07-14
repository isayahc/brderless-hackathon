export interface ParsedTriage {
  category: string;
  urgency: string;
  escalate: boolean;
  reply: string;
  reasoning: string;
}

/**
 * Extract the triage JSON from a model response. Models sometimes wrap JSON
 * in code fences or prose, so we locate the outermost object first.
 */
export function parseTriageResponse(raw: string): ParsedTriage {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON object found in model response');
  }
  const parsed = JSON.parse(raw.slice(start, end + 1));

  for (const field of ['category', 'urgency', 'escalate', 'reply']) {
    if (!(field in parsed)) {
      throw new Error(`Model response missing field: ${field}`);
    }
  }

  return {
    category: String(parsed.category),
    urgency: String(parsed.urgency),
    escalate: Boolean(parsed.escalate),
    reply: String(parsed.reply),
    reasoning: String(parsed.reasoning ?? ''),
  };
}
