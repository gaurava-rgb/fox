# Foxglove

A local, single-command demonstration of **what a competitor could build from publicly observable information alone** — no credentials, no internals, no scraping of private data.

The reference product is a live AI "get found" agent. Everything in this clone was reconstructed from:

- its public marketing pages (copy, positioning, pricing, FAQ)
- its client-side JavaScript bundles (plan model, job catalog shape, taxonomies, copy strings)
- its client-side network traffic on an authenticated free account (API response shapes)
- its visual design language (screenshots: colors, layout, typography, empty states)

## Run it

```bash
npm install
npm run dev        # http://localhost:5175
```

No backend, no auth, no payments. Sign-in accepts any email. "Subscribe" performs a fake 1.4s checkout and grants credits — which is enough to demonstrate the entire paywall/gating flow end to end.

## What an adversary gets for free

| Recovered intelligence | Fidelity |
|---|---|
| Positioning & tagline | Verbatim-adjacent ("get found by the people already looking for you") |
| The 15-job automation catalog (names, descriptions, cadences, plan-gating) | Verbatim, from `GET /api/projects/{id}/jobs` |
| Plan/credit model ($69/$129/$299 · 5k/10k/22k credits · top-up packs · pilot 2,500) | Verbatim, from client bundle constants |
| 4 specialist flows + their declared outputs | Verbatim |
| 33-connector inventory (7 ready / 26 coming, with status notes) | Verbatim |
| Memory taxonomy (12 fact kinds, 11 source kinds) | Verbatim, from client bundle |
| Alert taxonomy (7 kinds, colored) | Verbatim |
| API surface (26 endpoints, response shapes) | Shapes verbatim; payloads invented |
| Chat behavior: tool-lookup phases ("Looking at your rankings…") before streaming text | Verbatim event sequence (`phase(looking|writing) → text → done`) |
| Gating semantics: 402 `subscription-required` / `insufficient-credits` with shortfall copy | Verbatim |
| Both design languages (light marketing shell, dark product shell, periwinkle accent) | Color-exact from screenshots |
| Guardrail copy ("never posts for you", "nothing goes out without you") | Verbatim |

## What an adversary does NOT get

These are the moats that survived full recon:

1. **The scrapers.** How threads are actually found, ranked, and deduplicated across Reddit/LinkedIn/Facebook/X — none of it is client-visible. Every result in this clone is seeded fiction.
2. **The drafting prompts.** The "in your voice" generation quality — the six business documents and reply drafting are server-side. An adversary must write these from scratch, and voice quality is the product's core promise.
3. **Per-action credit costs.** The job catalog reveals *what* runs, not *what it costs*. Costs in this clone are invented.
4. **The worker infrastructure.** Scheduling, retries, rate-limit handling across social networks' APIs and ToS.
5. **Integration secrets & OAuth flows.** Clerk, Stripe, Google, GitHub wiring — all server-side.
6. **Tenancy, metering, and enforcement internals.** Only their *behavior* (402s, 404s on foreign project IDs) was observable, and this clone reproduces the behavior, not the machinery.
7. **The actual competitive data** — competitor reads, rankings history, AI-answer corpus.

## Architecture notes (mirroring the reference)

- Two visual shells in one local app: light `.mk` marketing routes (`/`, `/pricing`, `/about`) and dark `.app` product routes (`/projects/demo/…`, `/billing`).
- A mock API layer (`src/mock/api.js`) that reproduces captured response shapes, latency, and gating codes — including the 402 `subscription-required` refusal for plan-gated jobs, so the demo shows both sides of the paywall.
- The chat dock reproduces the recovered SSE sequence: a tool-lookup phase ("Looking at your rankings…") before any text streams, because the reference product's chat "looks up your rankings, rivals, and findings before it answers."

## Demo path (5 minutes)

1. `/signin` — any email → the dashboard
2. **Overview** — week metrics, listening sources, business documents, competitor snapshot, the 15-job panel; try "Run now" on a gated job and read the 402 refusal
3. **Discover** — six seeded findings with drafted replies in the demo business's voice; copy a reply
4. **Drafts** — the approval queue; publish the comparison page to a foxglove.site address
5. **Billing** — subscribe (fake checkout) → credits granted
6. Back to **Overview** — the same gated job now runs: phase → finish. The paywall behavior flips exactly like the reference
7. **Connectors** — 33 connectors; connect the tracking line and reveal the cookieless snippet
8. **Graph** — the memory graph (facts, sources, relationships) behind the product's claims
9. **Flows** — run "Find customer demand" and watch the phase/output run lifecycle
10. **Ask Foxglove** (bottom-right) — ask "what are my rankings" and watch it look things up before answering

## Disclaimer

All business data in this clone (Pinegrove Roofing & Exteriors, Lone Star Roofing, findings, rankings, AI answers) is invented for demonstration. No user data from the reference product was copied; recon was limited to public pages, client-side code, and traffic observable from a single authenticated free account.
