/* Seeded demo state — shows every feature "working" for a fictional business.
   An adversary building a demo from recon would seed exactly this kind of content. */

export const PROJECT_ID = 'demo'

/* Mutable demo state, persisted to localStorage so it survives navigation —
   without this, every route change would reset the subscription demo. */
const LS_KEY = 'foxglove.state.v1'
function loadSaved() {
  try {
    const raw = (typeof localStorage !== 'undefined') && localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return null
}
const saved = loadSaved()

export function persist() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      signedIn: state.signedIn,
      subscription: state.subscription,
      credits: state.credits,
      jobsState: state.jobsState,
      updatesRead: state.updatesRead,
    }))
  } catch { /* ignore */ }
}

export const state = {
  signedIn: saved?.signedIn ?? false,
  user: { name: 'Dana Whitfield', initials: 'DW' },
  business: {
    id: PROJECT_ID,
    name: 'Pinegrove Roofing & Exteriors',
    tagline: 'Storm-ready roofs for Central Texas homes',
    site: 'https://pinegrove-roofing.example.com',
  },
  subscription: saved?.subscription ?? null, // { tier: 't1' | 't2' | 't3', since }
  credits: saved?.credits ?? { plan: 0, topup: 0 },
  jobsState: saved?.jobsState ?? {},         // key -> { lastRunAt, state, lastRun }
  updatesRead: saved?.updatesRead ?? {},
}

export const SOURCES = [
  { id: 's1', kind: 'reddit', name: 'r/smallbusiness', cadence: 'Every day', status: 'checked' },
  { id: 's2', kind: 'reddit', name: 'r/Austin', cadence: 'Every day', status: 'checked' },
  { id: 's3', kind: 'linkedin', name: 'LinkedIn · roofing contractors', cadence: 'Every day', status: 'checked' },
  { id: 's4', kind: 'facebook', name: 'Austin Homeowners (public group)', cadence: 'Every day', status: 'checked' },
  { id: 's5', kind: 'x', name: 'X — posts you share', cadence: 'Every day', status: 'shared' },
  { id: 's6', kind: 'forums', name: 'Houzz discussions', cadence: 'Every day', status: 'checked' },
]

export const SEARCHES = [
  { id: 'q1', text: 'roof repair Austin who do you use', where: 'Reddit, Facebook' },
  { id: 'q2', text: 'hail damage roof replacement cost', where: 'Reddit, forums' },
  { id: 'q3', text: 'insurance claim roofing contractor', where: 'All sources' },
]

export const FINDINGS = [
  {
    id: 'f1', source: 'reddit', place: 'r/Austin', foundAt: '4h ago',
    classification: 'potential-customer',
    title: 'Hail last week — who do you call first, roofer or insurance?',
    body: 'Two bald spots on the back slope. Never filed a claim before. Do I get a roofer out first or call my insurance?',
    draft: 'Get a roofer out first — most adjusters want a contractor’s report before they’ll open the claim. We photograph every slope and hand you the report the same day, so the claim files clean. Happy to take a look this week.',
  },
  {
    id: 'f2', source: 'facebook', place: 'Austin Homeowners', foundAt: '9h ago',
    classification: 'potential-customer',
    title: 'Need a contractor who actually returns calls. Kitchen remodel this spring.',
    body: 'Ours stopped showing up. Looking for someone licensed who answers the phone.',
    draft: 'We answer. Every call gets a same-day callback and a written estimate within 48 hours — it is in our contract.',
  },
  {
    id: 'f3', source: 'linkedin', place: 'LinkedIn', foundAt: '1d ago',
    classification: 'brand',
    title: 'Shout-out to Pinegrove for the Cedar Park re-roof',
    body: 'Third job they have done for our HOA. Clean crew, clean invoice.',
    draft: null,
  },
  {
    id: 'f4', source: 'reddit', place: 'r/HomeImprovement', foundAt: '1d ago',
    classification: 'competitor',
    title: 'Lone Star Roofing quoted us $18k, seems high?',
    body: 'Getting a second opinion before signing anything.',
    draft: 'Get two more bids, and ask each for the line-item breakdown. Anything over the insurance scope should be itemized.',
  },
  {
    id: 'f5', source: 'forums', place: 'Houzz', foundAt: '2d ago',
    classification: 'trend',
    title: 'Are metal roofs worth it in hail country?',
    body: 'Tired of replacing shingles every 3 years.',
    draft: 'Class 4 impact-rated shingles now carry discounts most insurers honor — often the cheaper route than metal in hail country.',
  },
  {
    id: 'f6', source: 'x', place: 'X', foundAt: '2d ago',
    classification: 'potential-customer',
    title: 'Any roofers taking small repair jobs? Most want full replacements.',
    body: 'Just need flashing fixed around a chimney.',
    draft: 'We take repair jobs — small work done right is how big work starts. Chimney flashing is usually a half-day.',
  },
]

export const DRAFTS = {
  pages: [
    {
      id: 'd1', title: 'Comparison page: “Impact-rated shingles vs. metal in hail country”',
      note: 'Drafted because AI assistants did not name you for “best roof for hail in Austin”. Publishes to your Foxglove address or as a PR.',
      status: 'ready',
    },
  ],
  content: [
    {
      id: 'd2', title: 'Rewrite: pricing page title & meta description',
      note: 'Shows up 14th for “roof replacement austin”. New title and description ready to copy.',
      status: 'ready',
    },
  ],
  replies: [
    {
      id: 'd3', title: 'Reply to r/Austin hail-claim question',
      note: 'Found 4h ago. Draft ready in your voice.',
      status: 'ready', findingId: 'f1',
    },
    {
      id: 'd4', title: 'Reply to Austin Homeowners kitchen-remodel post',
      note: 'Found 9h ago. Draft ready in your voice.',
      status: 'ready', findingId: 'f2',
    },
  ],
}

export const DOCUMENTS = [
  { id: 'doc1', kind: 'Business and product information', status: 'written', updated: '2d ago', shelf: 'Business documents' },
  { id: 'doc2', kind: 'Marketing strategy', status: 'written', updated: '2d ago', shelf: 'Business documents' },
  { id: 'doc3', kind: 'Design guide', status: 'written', updated: '2d ago', shelf: 'Business documents' },
  { id: 'doc4', kind: 'Competitor analysis', status: 'written', updated: '3d ago', shelf: 'Business documents' },
  { id: 'doc5', kind: 'Content strategy', status: 'written', updated: '3d ago', shelf: 'Business documents' },
  { id: 'doc6', kind: 'Site health report', status: 'written', updated: '4d ago', shelf: 'Business documents' },
]

export const CONNECTORS = [
  // category, name, status ('ready' | 'coming'), note
  ['Analytics', 'Google', 'ready', 'Search Console and Analytics, one connection.'],
  ['Analytics', 'Google Business Profile', 'coming', 'Google grants this one by application. Nothing to connect until Google answers.'],
  ['Your website', 'Your Foxglove address', 'ready', 'Pages Foxglove hosts for you at a foxglove.site address.'],
  ['Your website', 'The Foxglove line on your website', 'ready', 'A cookieless script that counts visits and inquiries on your pages.'],
  ['Publishing', 'Your code repository', 'ready', 'Foxglove opens pull requests. It only ever adds files.'],
  ['Social', 'Reddit', 'ready', 'Reads public threads where people ask for help.'],
  ['Social', 'Facebook', 'ready', 'Public groups and Marketplace searches.'],
  ['Social', 'LinkedIn', 'ready', 'Posts and company pages in your market.'],
  ['Social', 'X', 'coming', 'X is not switched on for Foxglove yet.'],
  ['Meetings', 'Google Meet', 'coming', ''],
  ['Meetings', 'Zoom', 'coming', ''],
  ['Meetings', 'Granola', 'coming', ''],
  ['Scheduling', 'Calendly', 'coming', ''],
  ['Scheduling', 'Google Calendar', 'coming', ''],
  ['Email', 'Gmail', 'coming', ''],
  ['Email', 'Outlook', 'coming', ''],
  ['Messaging', 'Slack', 'coming', ''],
  ['Messaging', 'Discord', 'coming', ''],
  ['Project management', 'Asana', 'coming', ''],
  ['Project management', 'Monday', 'coming', ''],
  ['Project management', 'Jira', 'coming', ''],
  ['Project management', 'Linear', 'coming', ''],
  ['Knowledge', 'Airtable', 'coming', ''],
  ['Knowledge', 'Notion', 'coming', ''],
  ['Knowledge', 'Google Drive', 'coming', ''],
  ['Enrichment', 'Clay', 'coming', ''],
  ['Enrichment', 'Apollo', 'coming', ''],
  ['Marketing', 'Mailchimp', 'coming', ''],
  ['CRM', 'HubSpot', 'coming', ''],
  ['CRM', 'Zoho', 'coming', ''],
  ['CRM', 'Attio', 'coming', ''],
  ['Design', 'Figma', 'coming', ''],
  ['Design', 'Canva', 'coming', ''],
].map(([category, name, status, note], i) => ({ id: `c${i}`, category, name, status, note }))

export const MEMORY = {
  revision: 7,
  facts: [
    { id: 'm1', kind: 'offer', text: 'Roof replacement and repair, Class 4 impact-rated shingles, insurance-claim support included.', sources: ['Website read'], status: 'source-supported' },
    { id: 'm2', kind: 'audience', text: 'Homeowners in Central Texas, 10–40 year old houses, hail-anxious, insurance-first.', sources: ['Website read', 'Owner notes'] },
    { id: 'm3', kind: 'proof', text: '214 roofs completed, 4.9★ across Google and Yelp, same-day callback promise in contract.', sources: ['Google Business Profile'] },
    { id: 'm4', kind: 'objection', text: '“Roofers disappear after the deposit.” Answered by written 48-hour estimate guarantee.', sources: ['Chat'] },
    { id: 'm5', kind: 'competitor', text: 'Lone Star Roofing — bids ~$18k on 1,800 sq ft, no itemized breakdown by default.', sources: ['Competitor read'] },
    { id: 'm6', kind: 'voice', text: 'Plain, direct, no exclamation marks. Never say “cheap”. Always name the same-day callback.', sources: ['Owner notes'] },
    { id: 'm7', kind: 'persona', text: 'On Reddit: “Dana from Pinegrove”, a roofer who answers claim questions for free.', sources: ['Owner notes'] },
    { id: 'm8', kind: 'decision', text: 'No work outside Travis and Williamson counties. Confirmed twice.', sources: ['Chat'] },
  ],
  sources: [
    { id: 'ms1', kind: 'site-read', name: 'pinegrove-roofing.example.com — 14 pages', at: '4d ago' },
    { id: 'ms2', kind: 'owner', name: 'Notes from Dana — voice, persona, service area', at: '3d ago' },
    { id: 'ms3', kind: 'competitor', name: 'Lone Star Roofing — landing page read', at: '3d ago' },
    { id: 'ms4', kind: 'company-thread', name: 'r/Austin hail thread (replied)', at: '1d ago' },
    { id: 'ms5', kind: 'week', name: 'Week of Oct 13 — findings summary', at: '1d ago' },
  ],
  relationships: [
    { from: 'm1', to: 'm4', label: 'answers' },
    { from: 'm5', to: 'm1', label: 'contrasts with' },
    { from: 'm6', to: 'm7', label: 'shapes' },
    { from: 'ms1', to: 'm1', label: 'supports' },
    { from: 'ms3', to: 'm5', label: 'supports' },
  ],
  missing: ['report', 'hypothesis', 'goal', 'constraint'],
}

export const RESULTS = {
  week: 'October 13 to 19',
  discussionsFound: 12, repliesRecorded: 5, referralVisits: 41,
  mentions: { thisWeek: 3, lastWeek: 1 },
  landingVisits: 128, formsCompleted: 7, formsLastWeek: 2,
  prev: { discussionsFound: 8, repliesRecorded: 2, referralVisits: 12 },
}

export const MONDAY_PLAN = {
  subject: 'Your week at Pinegrove Roofing: three things worth doing',
  items: [
    {
      title: 'Reply to two homeowners asking about hail claims',
      note: 'Both posted on r/Austin this week. Your drafts are ready.',
    },
    {
      title: 'Answer the question AI assistants get wrong',
      note: 'Asked for the best roof for hail in Austin — none of the four named you. A comparison page is drafted.',
    },
    {
      title: 'Give your pricing page a clearer search listing',
      note: 'It shows up 14th for “roof replacement austin”. A new title and description are ready to copy.',
    },
  ],
  footer: 'Last week you posted three replies. 41 visits came from their links.',
}

export const UPDATES = [
  { id: 'u1', kind: 'finding-worth-answering', text: 'A homeowner on r/Austin asked about hail claims 4h ago. A reply is drafted.', at: '4h ago' },
  { id: 'u2', kind: 'job-finished', text: 'Social check finished: 3 conversations worth answering this week.', at: '6h ago' },
  { id: 'u3', kind: 'weekly-summary-ready', text: 'Your Monday plan is in your inbox.', at: '8h ago' },
  { id: 'u4', kind: 'lead-arrived', text: 'An inquiry came through the roofing cost page you published.', at: '1d ago' },
  { id: 'u5', kind: 'connection-broken', text: 'Search Console needs to be granted again — it expires in 5 days.', at: '1d ago' },
]

export const AI_ANSWERS = [
  { assistant: 'Assistant A', named: false, answer: '“Look for local contractors with GAF certification…”' },
  { assistant: 'Assistant B', named: false, answer: '“Angi and Thumbtack are good starting points…”' },
  { assistant: 'Assistant C', named: true, answer: '“Pinegrove Roofing specializes in hail-rated systems in Central Texas.”' },
  { assistant: 'Assistant D', named: false, answer: '“Get three bids and check the BBB listing…”' },
]

export const RANKINGS = [
  { query: 'roof replacement austin', position: 14, last: 17 },
  { query: 'hail damage roof repair', position: 8, last: 9 },
  { query: 'impact rated shingles cost', position: 21, last: 24 },
  { query: 'roofing contractor cedar park', position: 5, last: 5 },
]

export const FLOWS = [
  { key: 'find-demand', category: 'Research', name: 'Find customer demand', what: 'Find the questions and unmet needs that keep coming up in the sources you choose.', output: 'A customer demand write-up' },
  { key: 'content-funnel', category: 'Content', name: 'Create a content funnel', what: 'Build one page and the posts that lead to it, around a single customer question.', output: 'A content funnel draft' },
  { key: 'search-ops', category: 'Visibility', name: 'Find search opportunities', what: 'Compare the terms people search for with the pages you have, and name the gaps.', output: 'A search opportunities write-up' },
  { key: 'weekly-posts', category: 'Content', name: 'Draft this week’s posts', what: 'Turn what happened this week into posts written the way you write.', output: 'A set of post drafts' },
]
