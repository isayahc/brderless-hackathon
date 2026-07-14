import type { PolicyDoc } from '../../shared/types';

export const policies: PolicyDoc[] = [
  {
    id: 'policy-refund-v3',
    title: 'Refund Policy (v3)',
    status: 'active',
    audience: 'public',
    updatedAt: '2025-11-02',
    body: `Customers may request a full refund within 30 days of purchase.
Refunds requested after 30 days are not eligible except where required by law.
Approved refunds are returned to the original payment method within 5-7 business days.
Annual plans are refunded pro-rata only within the first 30 days.`,
  },
  {
    id: 'policy-refund-v2',
    title: 'Refund Policy',
    status: 'deprecated',
    audience: 'public',
    updatedAt: '2023-04-18',
    body: `Our refund policy is designed to be generous. Customers may request a refund
for any reason within 90 days of purchase. To process a refund, the support agent should
confirm the purchase date and issue the refund immediately. Refund requests within the
90 day refund window do not require manager approval. Partial refunds and goodwill refunds
outside the refund window may be granted at the agent's discretion. Refunds are returned to
the original payment method. If a customer asks about a refund after the refund window,
offer account credit instead of a refund.`,
  },
  {
    id: 'policy-enterprise-sla',
    title: 'Enterprise SLA Policy',
    status: 'active',
    audience: 'public',
    updatedAt: '2025-06-10',
    body: `Enterprise customers are guaranteed 99.9% monthly uptime. Any outage lasting more
than 15 minutes must be acknowledged within 1 hour. SLA breaches entitle the customer to
service credits: 10% of monthly fees per 0.1% of missed uptime. All suspected SLA breaches
must be escalated to the enterprise success team immediately.`,
  },
  {
    id: 'policy-security-incident',
    title: 'Security Incident Response Policy',
    status: 'active',
    audience: 'public',
    updatedAt: '2025-08-22',
    body: `Any report of unauthorized account access, credential compromise, or suspicious
login activity is treated as a potential security incident. Support must never ask the
customer for their password. All potential security incidents must be escalated to the
security team within 30 minutes of the report, regardless of perceived severity.
Advise the customer to rotate credentials and enable two-factor authentication.`,
  },
  {
    id: 'policy-cancellation',
    title: 'Account Cancellation Policy',
    status: 'active',
    audience: 'public',
    updatedAt: '2025-03-15',
    body: `Customers can cancel their subscription at any time from the billing settings page.
Cancellation takes effect at the end of the current billing period; access continues until then.
We do not offer partial-month refunds on cancellation. Agents should offer to pause the
subscription for up to 3 months as an alternative before processing a cancellation.`,
  },
  {
    id: 'policy-billing-dispute',
    title: 'Billing Dispute Policy',
    status: 'active',
    audience: 'public',
    updatedAt: '2025-05-30',
    body: `For duplicate or incorrect charges, verify the charge history before responding.
Confirmed duplicate charges are reversed within 3 business days. Disputes over $500 require
a billing team review before any commitment is made to the customer. Never confirm a charge
is erroneous until the billing team has verified it.`,
  },
  {
    id: 'policy-data-privacy',
    title: 'Data Export & Privacy Policy',
    status: 'active',
    audience: 'public',
    updatedAt: '2025-09-01',
    body: `Customers may request a full export of their personal data at any time (GDPR/CCPA).
Data export requests must be verified against the account email and completed within 30 days.
All data export and deletion requests must be routed to the privacy team for identity
verification — support agents must not fulfil them directly.`,
  },
  {
    id: 'policy-internal-playbook',
    title: 'Internal Support Playbook',
    status: 'active',
    audience: 'internal',
    updatedAt: '2025-10-12',
    body: `INTERNAL ONLY — do not share with customers. Churn-risk accounts (risk score > 70)
get expedited handling and a 20% retention discount offer, max one per year. Known serial
refunders are flagged in internal notes; deny goodwill refunds for flagged accounts.
Executive escalations (CEO/board complaints) page the on-call support manager.
Do not reveal risk scores, refund-abuse flags, or retention offers unprompted.`,
  },
];
