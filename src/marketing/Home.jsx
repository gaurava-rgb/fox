import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PLAN_TIERS } from '../mock/jobs.js'
import { Btn, Chip, Eyebrow, SourceBadge, Icons } from '../ui/index.jsx'

const BIZ = 'Pinegrove Roofing & Exteriors'

/* Example asks — the questions buyers post where Foxglove listens. */
const ASKS = [
  {
    src: 'reddit', via: 'r/Austin',
    q: 'Roof took a beating in last night’s hail. Anyone used a roofer they’d actually recommend?',
  },
  {
    src: 'facebook', via: 'Austin Homeowners',
    q: 'Need a contractor who actually returns calls. Roof replacement this spring.',
  },
  {
    src: 'linkedin', via: 'LinkedIn',
    q: 'Looking for a fractional CFO who knows multi-location dental practices.',
  },
  {
    src: 'x', via: 'X',
    q: 'Two roofers ghosted us after the May hail. Who in Central Texas actually shows up?',
  },
]

const STEPS = [
  { t: 'It finds the conversation', d: 'A post on Reddit, LinkedIn, Facebook, or X where someone asks for what you sell.' },
  { t: 'It drafts the reply', d: 'In your voice, from what it knows about your business.' },
  { t: 'You post it', d: 'Copy the reply, open the post, and answer. Nothing goes out without you.' },
]

const EXAMPLE_POST = {
  via: 'r/Austin',
  when: '2h ago',
  title: 'Roof took a beating in last night’s hail. Anyone used a roofer they’d actually recommend?',
  body: 'Adjuster comes Thursday, but everyone says they lowball hail claims. Looking for someone who knows the insurance side and will actually come out and look.',
}

const EXAMPLE_REPLY =
  'That lowball worry is exactly why we look at the roof before you file. We photograph every hit in the format the claim needs, at no charge — so if Thursday’s number comes back short, you have the photos to argue with. Happy to get out there before Thursday.'

const SOURCES = [
  { badge: 'reddit', name: 'Reddit', desc: 'Threads where people ask for help or a recommendation', cadence: 'Every day' },
  { badge: 'linkedin', name: 'LinkedIn', desc: 'Posts and company pages in your market', cadence: 'Every day' },
  { badge: 'facebook', name: 'Facebook', desc: 'Public groups and Marketplace searches', cadence: 'Every day' },
  { badge: 'x', name: 'X', desc: 'Recent posts, once you switch it on', cadence: 'Every day' },
  { badge: 'google', name: 'Google search', desc: 'Where you rank for the searches you track', cadence: 'Every night' },
  { mark: 'ai', name: 'AI answers', desc: 'Whether AI assistants name you when buyers ask', cadence: 'Every week' },
  { mark: 'vs', name: 'Competitors', desc: 'Who shows up above you, and what changed', cadence: 'Every week' },
]

const MONDAY_ITEMS = [
  {
    t: 'Reply to two homeowners asking about hail claims',
    why: 'Both posted in Austin groups this week. Your drafts are ready.',
  },
  {
    t: 'Answer the question AI assistants get wrong',
    why: 'Asked for the best roofer in Central Texas, none of the four named you. A comparison page is drafted.',
  },
  {
    t: 'Give your services page a clearer search listing',
    why: 'It shows up 11th for “roof repair austin,” but few people click. A new title and description are ready to copy.',
  },
]

const MONDAY_NOTES = [
  'Six documents about your business keep every draft in your voice.',
  'Ask Foxglove anything. It looks up your rankings, rivals, and findings before it answers.',
  'Nothing goes out until you post it.',
]

const FAQS = [
  {
    q: 'Does Foxglove post for me?',
    a: 'No. Foxglove finds conversations and drafts the replies and posts in your voice. You read them, change what you like, and post them yourself, wherever you choose. Nothing goes out without you.',
  },
  {
    q: 'Where does it look?',
    a: 'Reddit, LinkedIn, public Facebook groups and Marketplace, and X once you turn it on. It also checks where you rank on Google every night and what AI assistants say about you every week.',
  },
  {
    q: 'Do I need a website?',
    a: 'No. Foxglove starts from your business name and what you tell it. If you have a website, it reads it. If you don’t, it can draft pages and publish them at a Foxglove address.',
  },
  {
    q: 'Is there a free trial?',
    a: 'There is no free plan or trial. Plans start at $69 a month and you can cancel any time. If you have a pilot invite code, it gives you 2 free months on Starter.',
  },
  {
    q: 'Where is Foxglove available?',
    a: 'In the United States, for now.',
  },
  {
    q: 'Can I cancel?',
    a: 'Any time, from your billing page. Your plan stays active until the end of the month you paid for.',
  },
]

const TILE = {
  width: 26, height: 26, borderRadius: 8, flex: 'none',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: 700, fontSize: '0.8rem',
}
const TILE_HOLLOW = { ...TILE, color: 'var(--accent)', border: '1px solid var(--accent)' }
const TILE_SOLID = { ...TILE, background: 'var(--accent)', color: 'var(--accent-ink)' }

function Section({ eyebrow, title, intro, children, top = 84 }) {
  return (
    <section className="wrap" style={{ paddingTop: top }}>
      <div style={{ maxWidth: 760 }}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        {title ? (
          <h2 className="h2" style={{ fontSize: '1.55rem', marginTop: 10, marginBottom: intro ? 10 : 0 }}>
            {title}
          </h2>
        ) : null}
        {intro ? <p className="lede">{intro}</p> : null}
      </div>
      {children}
    </section>
  )
}

/* A row of example asks that rotates every 3 seconds. */
function AskRow() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="row" style={{ gap: 14, flexWrap: 'wrap', marginTop: 34 }}>
      {[0, 1, 2].map((k) => {
        const i = (tick + k) % ASKS.length
        const a = ASKS[i]
        return (
          <div key={i} className="pane fade-in" style={{ padding: 16, flex: '1 1 250px', minWidth: 0 }}>
            <div className="row" style={{ gap: 10, marginBottom: 10 }}>
              <SourceBadge src={a.src} />
              <span className="muted small">{a.via}</span>
            </div>
            <p className="small" style={{ lineHeight: 1.55 }}>{a.q}</p>
          </div>
        )
      })}
    </div>
  )
}

function Hero() {
  return (
    <section className="wrap" style={{ paddingTop: 92 }}>
      <Eyebrow>Foxglove</Eyebrow>
      <h1
        className="h1"
        style={{ fontSize: 'clamp(2.3rem, 5vw, 3.1rem)', lineHeight: 1.12, letterSpacing: '-0.015em', margin: '16px 0 0', maxWidth: 840 }}
      >
        Be found by the people already searching for you.
      </h1>
      <AskRow />
      <div style={{ maxWidth: 720, marginTop: 42 }}>
        <p className="lede" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
          Foxglove watches the conversations, searches, and AI answers where your customers look
          for help. It drafts the replies, posts, and pages to show up there, and every Monday
          tells you what to do next.
        </p>
        <div className="row" style={{ marginTop: 26, flexWrap: 'wrap' }}>
          <Btn to="/signin" solid>Get started</Btn>
          <Btn to="/pricing" ghost>See pricing</Btn>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <Section
      eyebrow="How it works"
      title="Found, drafted, and ready for you to post."
      intro="Every day Foxglove reads the places your buyers ask for help. When someone asks for what you sell, the reply is already written."
    >
      <div className="grid2" style={{ marginTop: 30, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
        <div className="stack" style={{ gap: 18 }}>
          {STEPS.map((s, i) => (
            <div key={s.t} className="row" style={{ gap: 14, alignItems: 'flex-start' }}>
              <span className="mono" style={TILE_HOLLOW}>{i + 1}</span>
              <div>
                <h3 className="h3">{s.t}</h3>
                <p className="muted small" style={{ marginTop: 4, lineHeight: 1.55 }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="stack" style={{ gap: 12 }}>
          <div className="pane" style={{ padding: 16 }}>
            <div className="row" style={{ gap: 10, marginBottom: 10 }}>
              <SourceBadge src="reddit" />
              <span className="small">
                <strong>{EXAMPLE_POST.via}</strong> <span className="faint">· {EXAMPLE_POST.when}</span>
              </span>
            </div>
            <p style={{ fontWeight: 600, lineHeight: 1.45 }}>{EXAMPLE_POST.title}</p>
            <p className="muted small" style={{ marginTop: 6, lineHeight: 1.55 }}>{EXAMPLE_POST.body}</p>
            <p className="small" style={{ marginTop: 12 }}>
              <span className="faint">Found for </span><strong>{BIZ}</strong>
              <span className="faint">, a roofer in Central Texas</span>
            </p>
          </div>
          <div className="pane" style={{ padding: 16 }}>
            <div className="row" style={{ gap: 10, marginBottom: 10 }}>
              <span className="src" style={{ color: 'var(--accent)' }}><Icons.flower size={14} /></span>
              <span className="eyebrow">Foxglove drafted a reply</span>
            </div>
            <p className="small" style={{ lineHeight: 1.6 }}>{EXAMPLE_REPLY}</p>
            <p className="faint small" style={{ marginTop: 12 }}>Written in Pinegrove’s voice. Edit anything.</p>
          </div>
          <div className="pane" style={{ padding: 16, borderColor: 'var(--accent)' }}>
            <h3 className="h3">Ready for you to post</h3>
            <div className="row" style={{ gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <Chip on>Copy reply</Chip>
              <Chip on>Open the post</Chip>
            </div>
            <p className="faint small" style={{ marginTop: 12 }}>Foxglove never posts for you.</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

function SourceList() {
  return (
    <Section
      eyebrow="Where it looks"
      title="Someone is asking for what you sell right now."
      intro="Foxglove reads the places your buyers ask for help, and checks how you show up when they search or ask an AI assistant."
    >
      <div className="stack" style={{ gap: 10, marginTop: 30 }}>
        {SOURCES.map((s) => (
          <div key={s.name} className="pane row row--between" style={{ padding: '13px 18px', gap: 14, flexWrap: 'wrap' }}>
            <div className="row" style={{ gap: 12, minWidth: 0 }}>
              {s.badge ? (
                <SourceBadge src={s.badge} />
              ) : (
                <span className="src" style={{ color: s.mark === 'ai' ? 'var(--accent)' : '#ffffff' }}>
                  {s.mark === 'ai' ? 'AI' : 'vs'}
                </span>
              )}
              <div style={{ minWidth: 0 }}>
                <h3 className="h3">{s.name}</h3>
                <p className="muted small" style={{ marginTop: 2 }}>{s.desc}</p>
              </div>
            </div>
            <Chip>{s.cadence}</Chip>
          </div>
        ))}
      </div>
    </Section>
  )
}

function EmailPane() {
  return (
    <div className="pane" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="row row--between" style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
        <span className="muted small">From: Foxglove · Monday, 8:00 AM</span>
        <Chip>Example</Chip>
      </div>
      <div style={{ padding: 18 }}>
        <h4 style={{ fontWeight: 600, lineHeight: 1.4 }}>Your week at Pinegrove Roofing: three things worth doing</h4>
        <div className="stack" style={{ gap: 14, marginTop: 14 }}>
          {MONDAY_ITEMS.map((it, i) => (
            <div key={it.t} className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
              <span className="mono" style={TILE_SOLID}>{i + 1}</span>
              <div style={{ minWidth: 0 }}>
                <strong style={{ fontSize: '0.9rem' }}>{it.t}</strong>
                <p className="muted small" style={{ marginTop: 3, lineHeight: 1.5 }}>{it.why}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '13px 18px', borderTop: '1px solid var(--line)', background: 'rgba(122,137,230,0.06)' }}>
        <p className="muted small">Last week you posted three replies. 41 visits came from their links.</p>
      </div>
    </div>
  )
}

function MondayPlan() {
  return (
    <Section
      eyebrow="Every Monday"
      title="Every Monday, the three things worth doing."
      intro="Foxglove ranks the week’s work by what is most likely to get you found, says why, and has the drafts waiting."
    >
      <div className="grid2" style={{ marginTop: 30, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
        <div className="stack" style={{ gap: 14 }}>
          {MONDAY_NOTES.map((n) => (
            <p key={n} className="muted small row" style={{ gap: 10, lineHeight: 1.55 }}>
              <span style={{ color: 'var(--accent)', flex: 'none', display: 'inline-flex' }}><Icons.flower size={13} /></span>
              {n}
            </p>
          ))}
        </div>
        <EmailPane />
      </div>
    </Section>
  )
}

function Paths() {
  return (
    <Section eyebrow="Who it’s for" title="Built for founders, and the agencies that help them.">
      <div className="grid2" style={{ marginTop: 30, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="pane pane--pad stack" style={{ gap: 10 }}>
          <Eyebrow>For founders</Eyebrow>
          <h3 className="h3" style={{ fontSize: '1.12rem' }}>Growth work, without a growth hire.</h3>
          <p className="muted small" style={{ lineHeight: 1.6 }}>
            You built something worth finding. Foxglove does the searching, reading, and first
            drafts so you can get back to building.
          </p>
          <div style={{ marginTop: 6 }}>
            <Btn to="/signin" ghost sm>Get started</Btn>
          </div>
        </div>
        <div className="pane pane--pad stack" style={{ gap: 10 }}>
          <Eyebrow>For agencies</Eyebrow>
          <h3 className="h3" style={{ fontSize: '1.12rem' }}>Every client, one account.</h3>
          <p className="muted small" style={{ lineHeight: 1.6 }}>
            Add each client as a business. Every plan includes unlimited businesses and shares
            credits across them.
          </p>
          <div style={{ marginTop: 6 }}>
            <a
              className="link-arrow"
              href="mailto:hello@foxglove.example?subject=Foxglove%20for%20my%20agency"
            >
              Talk to us about agencies
            </a>
          </div>
        </div>
      </div>
    </Section>
  )
}

function PricingTrio() {
  return (
    <Section
      eyebrow="Pricing"
      title="Every feature on every plan."
      intro="Plans differ only in how many credits arrive each month. Billed monthly, cancel any time."
    >
      <div className="grid3" style={{ marginTop: 30, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
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
      <p className="muted small" style={{ marginTop: 18 }}>
        Create your account, then choose your plan at checkout. Move to a bigger plan any time.
      </p>
      <Link className="link-arrow" to="/pricing" style={{ marginTop: 8 }}>How credits work</Link>
    </Section>
  )
}

function Faq() {
  return (
    <Section eyebrow="FAQ" title="Questions, answered.">
      <div className="pane" style={{ marginTop: 30, padding: '2px 22px' }}>
        {FAQS.map((f, i) => (
          <details key={f.q} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid var(--line)' : 'none' }}>
            <summary style={{ padding: '15px 0', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer' }}>
              {f.q}
            </summary>
            <p className="muted small" style={{ paddingBottom: 16, lineHeight: 1.6, maxWidth: '62ch' }}>
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </Section>
  )
}

function Closing() {
  return (
    <section className="wrap" style={{ paddingTop: 96, textAlign: 'center' }}>
      <h2 className="h1" style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)', fontWeight: 300 }}>
        See who is already asking.
      </h2>
      <p className="lede" style={{ margin: '14px auto 26px' }}>
        Tell Foxglove about your business and see what it finds this week.
      </p>
      <Btn to="/signin" solid>Get started</Btn>
    </section>
  )
}

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <SourceList />
      <MondayPlan />
      <Paths />
      <PricingTrio />
      <Faq />
      <Closing />
    </main>
  )
}
