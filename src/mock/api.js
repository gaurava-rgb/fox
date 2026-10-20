/* Mock API — mirrors the response shapes captured from the real product's
   client-side network traffic (recon-leak/net/api_full.json, api_bodies.json).
   No backend: an in-module store with artificial latency. */

import { JOBS, PLAN_TIERS, TOPUP_PACKS, CHAT_TOOL_LOOKUP_LABELS } from './jobs.js'
import * as db from './db.js'
import { persist } from './db.js'

const latency = (ms = 350) => new Promise((r) => setTimeout(r, ms + Math.random() * 250))

export const store = {
  get signedIn() { return db.state.signedIn },
  signIn() { db.state.signedIn = true; persist() },
  signOut() { db.state.signedIn = false; persist() },
}

export function getBusiness() { return db.state.business }

export async function listJobs() {
  await latency(300)
  return {
    workerRunning: true,
    jobs: JOBS.map((j) => {
      const s = db.state.jobsState[j.key]
      return {
        key: j.key, name: j.name, what: j.what, when: j.when,
        runnable: true,
        needsPlan: j.needsPlan,
        cost: j.cost,
        startedBy: j.startedBy,
        startedByUser: !!j.startedBy,
        lastRunAt: s?.lastRunAt ?? null,
        state: s?.state ?? null,
        nextRunAt: j.when !== 'When you ask' && j.when !== 'With a plan' ? 'tonight' : null,
        lastRun:
          s?.lastRun ??
          (j.needsPlan && !db.state.subscription
            ? 'Not running for your business. This comes with a Foxglove plan.'
            : 'Not run yet'),
      }
    }),
  }
}

export function entitled() {
  return !!db.state.subscription && (db.state.credits.plan + db.state.credits.topup) > 0
}

/* Mirrors POST /api/projects/{id}/jobs/run-now — the real server returns
   402 {code:"subscription-required"} for plan-gated jobs; we reproduce that. */
export async function runJob(kind) {
  await latency(500)
  const job = JOBS.find((j) => j.key === kind)
  if (!job) return { ok: false, status: 404, error: 'Unknown job' }
  if (job.needsPlan && !db.state.subscription) {
    return { ok: false, status: 402, code: 'subscription-required', error: 'An active Foxglove plan is required for this. Subscribe to continue.' }
  }
  const bal = db.state.credits.plan + db.state.credits.topup
  if (bal < job.cost) {
    return { ok: false, status: 402, code: 'insufficient-credits', error: `You need ${job.cost - bal} more credits to run this. You have ${bal} left.`, shortfall: job.cost - bal, balance: bal }
  }
  // deduct from plan credits first, then top-ups
  let plan = db.state.credits.plan
  let topup = db.state.credits.topup
  if (plan >= job.cost) plan -= job.cost
  else { topup = Math.max(0, topup - (job.cost - plan)); plan = 0 }
  db.state.credits = { plan, topup }
  db.state.jobsState[kind] = { state: 'running', lastRunAt: new Date().toISOString(), lastRun: 'Running now…' }
  persist()
  setTimeout(() => {
    db.state.jobsState[kind] = { state: 'done', lastRunAt: new Date().toISOString(), lastRun: 'Finished just now' }
    persist()
  }, 2600)
  return { ok: true, status: 200 }
}

/* Mirrors GET /api/billing/summary — captured verbatim shape. */
export async function getBillingSummary() {
  await latency(250)
  const sub = db.state.subscription
  const total = db.state.credits.plan + db.state.credits.topup
  return {
    metered: true,
    entitled: !!sub && total > 0,
    balance: { plan: db.state.credits.plan, topup: db.state.credits.topup, total },
    low: !!sub && total < 500,
    blocked: null,
    payUrl: null,
    pausedScheduledWork: !sub,
    topupsAllowed: !!sub,
    lowBalanceWarnedAt: null,
    subscription: sub ? { tier: sub.tier, ...PLAN_TIERS[sub.tier] } : null,
  }
}

export async function subscribe(tier) {
  await latency(1400) // fake checkout
  db.state.subscription = { tier, since: new Date().toISOString() }
  persist()
  db.state.credits.plan = PLAN_TIERS[tier].credits
  return { ok: true }
}

export async function topUp(packIdx) {
  await latency(900)
  const pack = TOPUP_PACKS[packIdx]
  db.state.credits.topup += pack.credits
  persist()
  return { ok: true, pack }
}

export async function cancelPlan() {
  await latency(600)
  db.state.subscription = null
  persist()
  db.state.credits.plan = 0
  return { ok: true }
}

export const listSources = async () => (await latency(200), db.SOURCES)
export const listSearches = async () => (await latency(200), db.SEARCHES)
export const listFindings = async () => (await latency(400), db.FINDINGS)
export const listDrafts = async () => (await latency(300), db.DRAFTS)
export const listDocuments = async () => (await latency(300), db.DOCUMENTS)
export const listConnectors = async () => (await latency(350), db.CONNECTORS)
export const getMemory = async () => (await latency(400), db.MEMORY)
export const getResults = async () => (await latency(400), db.RESULTS)
export const getMondayPlan = async () => (await latency(300), db.MONDAY_PLAN)
export const getAiAnswers = async () => (await latency(300), db.AI_ANSWERS)
export const getRankings = async () => (await latency(300), db.RANKINGS)
export const listFlows = async () => (await latency(250), db.FLOWS)

export async function listUpdates() {
  await latency(200)
  return db.UPDATES.map((u) => ({ ...u, read: !!db.state.updatesRead[u.id] }))
}
export async function markUpdateRead(id) {
  await latency(120)
  if (id === 'all') db.UPDATES.forEach((u) => (db.state.updatesRead[u.id] = 1))
  else db.state.updatesRead[id] = 1
  persist()
  return { ok: true }
}

/* Chat — mirrors the real product's SSE behavior recovered from the bundle:
   events "phase(looking|writing, lookup)" → "text" → "done".
   The tool-lookup phases are the "checks your numbers before it answers" gimmick. */
export function chatStream(message, { onPhase, onText, onDone }) {
  const m = message.toLowerCase()
  const route =
    /rank|search|google/.test(m) ? 'rankings' :
    /compet|rival|lone star/.test(m) ? 'rivals' :
    /people|saying|reddit|post|social/.test(m) ? 'social_findings' :
    /ai|assistant|chatgpt|perplexity/.test(m) ? 'ai_answers' :
    /search console|impress|click/.test(m) ? 'search_console' :
    /site|speed|health|broken/.test(m) ? 'site_health' :
    /draft|reply|write/.test(m) ? 'drafts' : null

  const phases = []
  if (route) phases.push({ event: 'phase', looking: true, lookup: route })
  phases.push({ event: 'phase', writing: true, lookup: route })

  const answers = {
    rankings: 'Your rankings this week: “roofing contractor cedar park” holds at #5, “roof replacement austin” moved 17→14, and “impact rated shingles cost” moved 24→21. The two movers both improved after last week’s replies. The biggest gap is still “hail damage roof repair” at #8 — a page targeted at the claim process would likely take it.',
    rivals: 'Lone Star Roofing is still the name that shows up above you for replacement queries. Their page promises “24-hour inspection” but does not itemize bids — your written 48-hour estimate with line items is the cleaner promise. They were named in two of the twelve discussions found this week; you were named in three.',
    social_findings: 'This week I found 12 conversations worth reading. Three are homeowners asking about hail claims on r/Austin and Austin Homeowners — replies are drafted and waiting. One is a competitor mention, one a direct shout-out to your Cedar Park work. The pattern underneath: people are scared of the insurance process more than of the price.',
    ai_answers: 'Of the four assistants I ask weekly, only one (Assistant C) names you for “best roof for hail in Austin”. The others recommend directories. The drafted comparison page — impact-rated shingles vs. metal — is the piece most likely to change this.',
    search_console: 'Search Console shows 1,840 impressions and 96 clicks over the last 7 days, up from 1,210 and 61 the week before. The lift lines up with the replies you posted: 41 referral visits came from their links.',
    site_health: 'Your site loads in 2.1s on mobile (was 2.9s). One issue stands out: the contact form on /contact lacks a phone field, and half your inquiries mention calling. Adding one is drafted as a pull request.',
    drafts: 'Four drafts are waiting: two replies (r/Austin hail question, Austin Homeowners kitchen post), one page (shingles vs. metal comparison), and one rewrite (pricing page title and description). Nothing goes out until you say yes.',
    default: 'I know Pinegrove through 8 facts and 5 sources — your offers, audience, proof, voice, and the competitors you are weighed against. Ask me about your rankings, rivals, what people are saying, AI answers, Search Console, site health, or the drafts waiting for you.',
  }

  let i = 0
  const text = answers[route] || answers.default
  let charI = 0
  const timers = []
  phases.forEach((p, idx) => {
    timers.push(setTimeout(() => onPhase(p, CHAT_TOOL_LOOKUP_LABELS[route]), 350 + idx * 900))
  })
  const textStart = 350 + phases.length * 900
  timers.push(setTimeout(() => {
    const iv = setInterval(() => {
      charI += 3
      onText({ event: 'text', text: text.slice(0, charI) })
      if (charI >= text.length) {
        clearInterval(iv)
        onDone({ event: 'done' })
      }
    }, 16)
    timers.push(iv)
  }, textStart))
  return () => timers.forEach(clearTimeout)
}
