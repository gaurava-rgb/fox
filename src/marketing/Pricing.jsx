import { PLAN_TIERS, TOPUP_PACKS, PILOT_MONTH_CREDITS } from '../mock/jobs.js'
import { Btn, Eyebrow } from '../ui/index.jsx'

const INCLUDED = [
  'Conversations found on Reddit, LinkedIn, Facebook groups, and X',
  'Replies and posts drafted in your voice, ready for you to post',
  'Six business documents, rewritten whenever you ask',
  'Google rankings checked every night',
  'What AI assistants say about you, checked every week',
  'Competitor and site health reports',
  'A ranked plan in your inbox every Monday',
  'Chat with Foxglove about your business',
  'Hosting for pages you build with Foxglove',
  'Unlimited businesses on one account',
]

const CREDIT_POINTS = [
  {
    t: 'Plan credits refill monthly',
    d: 'Your plan’s credits arrive on the same date every month. Unused plan credits end at the refill — they don’t roll over to the next month.',
  },
  {
    t: 'Work pauses at zero',
    d: 'When you run out, work that uses credits pauses until the refill, a top-up, or a bigger plan. We email you when your balance runs low.',
  },
  {
    t: 'Top-ups never expire',
    d: 'Credits you buy as a top-up stay on your account for as long as it is open, whatever happens to your plan credits.',
  },
  {
    t: 'Move plans any time',
    d: 'Move to a bigger plan whenever you need more credits. You see the prorated amount before you confirm, and the extra credits arrive at once.',
  },
]

const BILLING_FAQS = [
  {
    q: 'What is a credit?',
    a: 'A credit costs about a cent, depending on your plan. Credits are spent as Foxglove works: reading conversations, drafting, checking rankings and AI answers, and writing documents. Your usage page shows every credit spent.',
  },
  {
    q: 'What happens to unused credits?',
    a: 'Plan credits refill every month and unused ones end at the refill. Credits you buy as a top-up never expire while your account is open.',
  },
  {
    q: 'What happens when I run out?',
    a: 'Work that uses credits pauses until your plan refills, or until you buy a top-up or move to a bigger plan. We email you when your balance runs low.',
  },
  {
    q: 'Can I change plans?',
    a: 'You can move to a bigger plan any time. You see the prorated amount before you confirm, the extra credits arrive at once, and your renewal date stays the same.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Fees already paid are not refunded, except where the law requires it. You can cancel any time and keep your plan until the end of the paid month.',
  },
  {
    q: 'Is there an annual plan?',
    a: 'Not yet. Every plan is billed monthly.',
  },
  {
    q: 'Is there a free trial?',
    a: 'There is no free plan or trial. Plans start at $69 a month and you can cancel any time. If you have a pilot invite code, it gives you 2 free months on Starter.',
  },
  {
    q: 'What happens to my pages if I cancel?',
    a: 'Pages Foxglove hosts for you go offline 72 hours after your plan ends. A hosted website is kept for 30 days in case you come back.',
  },
]

function TierCards() {
  return (
    <div className="grid3" style={{ marginTop: 32, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
      {Object.values(PLAN_TIERS).map((t) => (
        <div key={t.name} className="pane pane--pad stack" style={{ gap: 6 }}>
          <h3 className="h3">{t.publicName}</h3>
          <div className="row" style={{ gap: 7, alignItems: 'baseline', marginTop: 4 }}>
            <span className="mono" style={{ fontSize: '1.8rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
              ${t.monthlyUsd}
            </span>
            <span className="muted small">a month</span>
          </div>
          <p className="muted small">{t.credits.toLocaleString('en-US')} credits a month</p>
          <div style={{ marginTop: 12 }}>
            <Btn to="/signin" solid>Get started</Btn>
          </div>
        </div>
      ))}
    </div>
  )
}

function FaqList({ items }) {
  return (
    <div className="pane" style={{ marginTop: 28, padding: '2px 22px' }}>
      {items.map((f, i) => (
        <details key={f.q} style={{ borderBottom: i < items.length - 1 ? '1px solid var(--line)' : 'none' }}>
          <summary style={{ padding: '15px 0', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer' }}>
            {f.q}
          </summary>
          <p className="muted small" style={{ paddingBottom: 16, lineHeight: 1.6, maxWidth: '62ch' }}>
            {f.a}
          </p>
        </details>
      ))}
    </div>
  )
}

export default function Pricing() {
  return (
    <main>
      <section className="wrap" style={{ paddingTop: 88 }}>
        <Eyebrow>Pricing</Eyebrow>
        <h1
          className="h1"
          style={{ fontSize: 'clamp(2.2rem, 4.5vw, 2.9rem)', lineHeight: 1.12, letterSpacing: '-0.015em', margin: '14px 0 12px' }}
        >
          Every feature on every plan.
        </h1>
        <p className="lede" style={{ maxWidth: 640 }}>
          Plans differ only in how many credits arrive each month. Prices in US dollars, billed
          monthly. Cancel any time.
        </p>
        <TierCards />
        <p className="muted small" style={{ marginTop: 18 }}>
          Create your account, then choose your plan at checkout. Move to a bigger plan any time.
        </p>
        <div
          className="pane"
          style={{ marginTop: 14, padding: 16, background: 'rgba(122,137,230,0.07)', borderColor: 'rgba(122,137,230,0.35)' }}
        >
          <p className="small" style={{ lineHeight: 1.55 }}>
            Have a pilot invite code? Choose <strong>Starter</strong> and add the code at checkout.
            It gives you 2 free months with {PILOT_MONTH_CREDITS.toLocaleString('en-US')} credits each.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 84 }}>
        <Eyebrow>Features</Eyebrow>
        <h2 className="h2" style={{ fontSize: '1.55rem', marginTop: 10 }}>Included in every plan.</h2>
        <div className="grid2" style={{ marginTop: 26, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px 28px' }}>
          {INCLUDED.map((f) => (
            <div key={f} className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 700, flex: 'none' }}>✓</span>
              <span className="small" style={{ lineHeight: 1.55 }}>{f}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 84 }}>
        <Eyebrow>Credits</Eyebrow>
        <h2 className="h2" style={{ fontSize: '1.55rem', marginTop: 10 }}>How credits work</h2>
        <p className="lede" style={{ marginTop: 10, maxWidth: 640 }}>
          A credit costs about a cent, depending on your plan. Credits are spent as Foxglove reads and writes — finding
          conversations, drafting replies, checking rankings and AI answers, and writing
          documents. Your usage page shows every credit spent, for each business.
        </p>
        <div className="grid2" style={{ marginTop: 26, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {CREDIT_POINTS.map((c) => (
            <div key={c.t} className="pane" style={{ padding: 18 }}>
              <h3 className="h3">{c.t}</h3>
              <p className="muted small" style={{ marginTop: 6, lineHeight: 1.55 }}>{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 84 }}>
        <Eyebrow>Extra credits</Eyebrow>
        <h2 className="h2" style={{ fontSize: '1.55rem', marginTop: 10 }}>Top-ups</h2>
        <p className="lede" style={{ marginTop: 10, maxWidth: 640 }}>
          Add credits any time you have a plan. Top-ups never expire while your account is open.
        </p>
        <div className="pane" style={{ marginTop: 26, padding: '4px 20px' }}>
          <div className="row row--between" style={{ padding: '12px 0' }}>
            <span className="eyebrow">Credits</span>
            <span className="eyebrow">Price</span>
          </div>
          {TOPUP_PACKS.map((p) => (
            <div key={p.credits} className="row row--between" style={{ padding: '13px 0', borderTop: '1px solid var(--line)' }}>
              <span className="mono" style={{ fontWeight: 600 }}>{p.credits.toLocaleString('en-US')}</span>
              <span className="mono muted">${p.usd}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 84 }}>
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="h2" style={{ fontSize: '1.55rem', marginTop: 10 }}>Billing questions.</h2>
        <FaqList items={BILLING_FAQS} />
      </section>

      <section className="wrap" style={{ paddingTop: 92, textAlign: 'center' }}>
        <h2 className="h1" style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)', fontWeight: 300 }}>
          Start with the plan that fits today.
        </h2>
        <p className="lede" style={{ margin: '14px auto 26px' }}>
          Move to a bigger plan whenever you need more credits. You see the prorated amount
          before you confirm.
        </p>
        <Btn to="/signin" solid>Get started</Btn>
      </section>
    </main>
  )
}
