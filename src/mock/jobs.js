/* The 15-job automation catalog, recovered verbatim from
   GET /api/projects/{id}/jobs on the real product (recon-leak/net/api_full.json).
   Credit costs are INVENTED — real per-action costs were not recoverable. */

export const JOBS = [
  {
    key: 'thread-finder', name: 'Find conversations where your business can help',
    what: 'On a plan, Foxglove reads the threads you paste and the ones it set aside, brings back the ones worth answering, and checks how earlier replies did.',
    when: 'With a plan', needsPlan: true, cost: 25,
    startedBy: null,
  },
  {
    key: 'rankings', name: 'Check where you come up in search',
    what: 'On a plan, Foxglove asks the questions you watch and records where your business appears.',
    when: 'With a plan', needsPlan: true, cost: 15,
    startedBy: null,
  },
  {
    key: 'search-sync', name: 'Bring in your Google search numbers',
    what: 'Foxglove fetches clicks and impressions from Search Console each night, sixteen months back the first time.',
    when: 'Every night', needsPlan: false, cost: 5,
    startedBy: { path: 'jobs/run-now', body: { kind: 'search-sync' } },
  },
  {
    key: 'ai-answers', name: 'Check what the AI assistants say about work like yours',
    what: 'On a plan, Foxglove asks the assistants and records whether your business is named.',
    when: 'With a plan', needsPlan: true, cost: 20,
    startedBy: null,
  },
  {
    key: 'weekly-summary', name: 'Write up your week',
    what: 'On a plan, Foxglove counts up what happened and sends it to you on Monday morning.',
    when: 'With a plan', needsPlan: true, cost: 10,
    startedBy: null,
  },
  {
    key: 'site-read', name: 'Read your website and fill in your details',
    what: 'Foxglove reads every page it can reach and fills your brand kit from what it finds.',
    when: 'When you ask', needsPlan: false, cost: 50,
    startedBy: { path: 'site-read', body: {} },
  },
  {
    key: 'pagespeed', name: 'Check how fast your pages load',
    what: 'Foxglove scores your five most important pages on phone and desktop.',
    when: 'Every week', needsPlan: false, cost: 5,
    startedBy: { path: 'jobs/run-now', body: { kind: 'pagespeed' } },
  },
  {
    key: 'offer-test', name: 'Count the clicks on the offers you are comparing',
    what: 'Foxglove counts the clicks on each version of an offer you are testing, so you can see which one people pick.',
    when: 'Every night', needsPlan: false, cost: 5,
    startedBy: { path: 'jobs/run-now', body: { kind: 'offer-test' } },
  },
  {
    key: 'update-sweep', name: 'Tell you when a connection is about to stop working',
    what: 'Foxglove checks each night whether a connection you granted is about to run out, and says so in your updates while there is still time to put it back.',
    when: 'Every night', needsPlan: false, cost: 0,
    startedBy: { path: 'jobs/run-now', body: { kind: 'update-sweep' } },
  },
  {
    key: 'thread-consolidation', name: 'Read your conversations into your business details',
    what: 'On a plan, Foxglove reads back what you said in chat and adds it to what it knows about your business, with a note saying which chat taught it.',
    when: 'With a plan', needsPlan: true, cost: 10,
    startedBy: null,
  },
  {
    key: 'theme-week', name: 'Group this week’s findings',
    what: 'On a plan, Foxglove looks at everything it found this week and names the few patterns underneath, so you read the pattern and not thirty cards.',
    when: 'With a plan', needsPlan: true, cost: 15,
    startedBy: null,
  },
  {
    key: 'competitor-read', name: 'Read what your competitors are offering',
    what: 'On a plan, Foxglove reads the page each competitor sends searchers to and records what they offer, in their own words, with the date.',
    when: 'With a plan', needsPlan: true, cost: 30,
    startedBy: null,
  },
  {
    key: 'social-check', name: 'Check the places you watch on social',
    what: 'On a plan, Foxglove checks your communities, searches and brand name on Reddit, X, Facebook and LinkedIn, and brings back what is worth answering.',
    when: 'With a plan', needsPlan: true, cost: 40,
    startedBy: null,
  },
  {
    key: 'improvement-plan', name: 'Work out what to fix first on your site',
    what: 'On a plan, Foxglove reads this week’s speed checks and writes the order to fix things in, with the measurement behind each step.',
    when: 'With a plan', needsPlan: true, cost: 20,
    startedBy: null,
  },
  {
    key: 'profile-read', name: 'Read your Google Business Profile',
    what: 'On a plan, Foxglove reads the public side of your profile each night: your rating, your reviews, your hours and the questions people ask.',
    when: 'With a plan', needsPlan: true, cost: 10,
    startedBy: null,
  },
]

/* Plan model — recovered verbatim from client bundle module 462732
   (PLAN_TIERS / TOPUP_PACKS / PILOT_MONTH_CREDITS). */
export const PLAN_TIERS = {
  t1: { name: 'T1', publicName: 'Starter', monthlyUsd: 69, credits: 5000 },
  t2: { name: 'T2', publicName: 'Growth', monthlyUsd: 129, credits: 10000 },
  t3: { name: 'T3', publicName: 'Scale', monthlyUsd: 299, credits: 22000 },
}
export const TOPUP_PACKS = [
  { credits: 1000, usd: 15 },
  { credits: 2000, usd: 30 },
  { credits: 4000, usd: 60 },
]
export const PILOT_MONTH_CREDITS = 2500

/* Memory fact taxonomy — recovered verbatim from the client bundle. */
export const FACT_KINDS = {
  offer: { label: 'Products and services', desc: 'What customers can buy from you, including products, services and subscriptions.' },
  audience: { label: 'Customers', desc: 'The people or businesses you want to reach and the problems they need help with.' },
  proof: { label: 'Results and testimonials', desc: 'Results, testimonials and examples that support what you promise customers.' },
  objection: { label: 'Customer concerns', desc: 'Questions or concerns that might stop someone from buying.' },
  competitor: { label: 'Competitors', desc: 'Other businesses or alternatives your customers may consider.' },
  goal: { label: 'Goals', desc: 'The outcomes you are working toward.' },
  constraint: { label: 'Limits and preferences', desc: 'Anything Foxglove must work around, including business decisions.' },
  decision: { label: 'Decisions', desc: 'Choices you have made and the reasons behind them.' },
  voice: { label: 'How you write', desc: 'How you want your writing to sound, including the words to use and the words to avoid.' },
  persona: { label: 'Who you write as', desc: 'Who you write as on one network, and how that person comes across.' },
}

/* Alert taxonomy — recovered verbatim. */
export const ALERT_KINDS = {
  'job-finished': { label: 'Finished', tone: 'green' },
  'run-needs-review': { label: 'Needs you', tone: 'yellow' },
  'connection-broken': { label: 'Needs you', tone: 'red' },
  'worker-down': { label: 'Waiting', tone: 'red' },
  'weekly-summary-ready': { label: 'Ready', tone: 'green' },
  'finding-worth-answering': { label: 'Needs you', tone: 'yellow' },
  'lead-arrived': { label: 'Needs you', tone: 'yellow' },
}

/* Chat tool lookups — the "checks your numbers before it answers" behavior,
   recovered verbatim from the bundle (CHAT_TOOL_LOOKUP_LABELS + SSE_EVENTS). */
export const CHAT_TOOL_LOOKUP_LABELS = {
  rankings: 'Looking at your rankings',
  rivals: 'Looking at your rivals',
  social_findings: 'Looking at what people are saying',
  ai_answers: 'Looking at AI answers',
  search_console: 'Looking at your Search Console',
  site_health: 'Looking at your site health',
  drafts: 'Looking at your drafts',
}
