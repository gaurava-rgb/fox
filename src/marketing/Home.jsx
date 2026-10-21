import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PLAN_TIERS } from '../mock/jobs.js'
import { Btn, Chip, Eyebrow, SourceBadge, Icons, Mark, Rule } from '../ui/index.jsx'

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
  width: 26, height: 26, borderRadius: 6, flex: 'none',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: 600, fontSize: '0.78rem',
}
const TILE_SOLID = { ...TILE, background: 'var(--accent)', color: 'var(--accent-ink)' }

/* ---------------------------------------------------------------------------
   Composition primitives
   ------------------------------------------------------------------------- */

/* Heading column on the left holds position while the artefact column scrolls
   past it. The main rhythm device: a page that alternates, not a stack. */
function Split({ index, eyebrow, title, intro, aside, children, top = 108, flip }) {
  return (
    <section className="wrap" style={{ paddingTop: top }}>
      <div className={`split${flip ? ' split--flip' : ''}`}>
        <div className="split__head">
          <Eyebrow index={index}>{eyebrow}</Eyebrow>
          {title && <h2 className="h2" style={{ margin: '14px 0 0' }}>{title}</h2>}
          {intro && <p className="lede" style={{ marginTop: 14 }}>{intro}</p>}
          {aside}
        </div>
        <div className="split__body">{children}</div>
      </div>
    </section>
  )
}

/* Section heading with no sticky column — used inside full-bleed bands. */
function BandHead({ index, eyebrow, title, intro, statement }) {
  return (
    <div className="band__head">
      <Eyebrow index={index}>{eyebrow}</Eyebrow>
      {statement ? (
        <h2 className="statement">{title}</h2>
      ) : (
        <h2 className="h2" style={{ margin: '14px 0 0' }}>{title}</h2>
      )}
      {intro && <p className="lede" style={{ marginTop: 14 }}>{intro}</p>}
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Hero — statement left, live artefact right
   ------------------------------------------------------------------------- */

function AskStack() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="stack" style={{ gap: 10 }}>
      {[0, 1, 2].map((k) => {
        const i = (tick + k) % ASKS.length
        const a = ASKS[i]
        return (
          <div key={i} className="pane fade-in" style={{ padding: 15 }}>
            <div className="row" style={{ gap: 9, marginBottom: 9 }}>
              <SourceBadge src={a.src} />
              <span className="muted small">{a.via}</span>
            </div>
            <p className="small" style={{ lineHeight: 1.5 }}>{a.q}</p>
          </div>
        )
      })}
    </div>
  )
}

function Hero() {
  return (
    <>
      <section className="wrap hero">
        <div className="hero__text">
          <Eyebrow index="00">Foxglove</Eyebrow>
          <h1 className="display-xl" style={{ margin: '22px 0 0' }}>
            Be found by the people already searching for you.
          </h1>
          <p className="lede" style={{ marginTop: 28 }}>
            Foxglove watches the conversations, searches, and AI answers where your customers look
            for help. It drafts the replies, posts, and pages to show up there, and every Monday
            tells you what to do next.
          </p>
          <div className="row" style={{ marginTop: 30, flexWrap: 'wrap' }}>
            <Btn to="/signin" solid>Get started</Btn>
            <Btn to="/pricing" ghost>See pricing</Btn>
          </div>
        </div>

        <aside className="hero__aside">
          <div className="row row--between" style={{ marginBottom: 13 }}>
            <span className="eyebrow">Being asked now</span>
            <span className="eyebrow" style={{ color: 'var(--accent)' }}>Live</span>
          </div>
          <AskStack />
        </aside>
      </section>

      <div className="wrap" style={{ paddingTop: 64 }}>
        <Rule />
        <div className="row row--between hero__strip">
          <span className="eyebrow">Listening on</span>
          <span className="mono small" style={{ color: 'var(--muted)' }}>
            Reddit · LinkedIn · Facebook · X · Google · AI answers
          </span>
        </div>
      </div>
    </>
  )
}

/* ---------------------------------------------------------------------------
   01 — How it works: numbered steps, then the two-document trail
   ------------------------------------------------------------------------- */

function HowItWorks() {
  return (
    <section className="wrap" style={{ paddingTop: 112 }}>
      <div style={{ maxWidth: 800 }}>
        <Eyebrow index="01">How it works</Eyebrow>
        <h2 className="h2" style={{ margin: '14px 0 0' }}>Found, drafted, and ready for you to post.</h2>
        <p className="lede" style={{ marginTop: 14 }}>
          Every day Foxglove reads the places your buyers ask for help. When someone asks for what
          you sell, the reply is already written.
        </p>
      </div>

      <div className="steps">
        {STEPS.map((s, i) => (
          <div key={s.t} className="step">
            <span className="mono step__n">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="h3">{s.t}</h3>
            <p className="muted small" style={{ marginTop: 5 }}>{s.d}</p>
          </div>
        ))}
      </div>

      <div className="thread">
        <div className="pane" style={{ padding: 18 }}>
          <div className="row" style={{ gap: 10, marginBottom: 11 }}>
            <SourceBadge src="reddit" />
            <span className="small">
              <strong>{EXAMPLE_POST.via}</strong> <span className="faint">· {EXAMPLE_POST.when}</span>
            </span>
          </div>
          <p style={{ fontWeight: 600, lineHeight: 1.45 }}>{EXAMPLE_POST.title}</p>
          <p className="muted small" style={{ marginTop: 7, lineHeight: 1.55 }}>{EXAMPLE_POST.body}</p>
          <p className="small" style={{ marginTop: 13 }}>
            <span className="faint">Found for </span><strong>{BIZ}</strong>
            <span className="faint">, a roofer in Central Texas</span>
          </p>
        </div>

        <div className="pane" style={{ padding: 18 }}>
          <div className="row" style={{ gap: 9, marginBottom: 11 }}>
            <span className="src" style={{ color: 'var(--accent)' }}><Icons.flower size={13} /></span>
            <span className="eyebrow">Foxglove drafted a reply</span>
          </div>
          <p className="small" style={{ lineHeight: 1.62 }}>{EXAMPLE_REPLY}</p>
          <p className="faint small" style={{ marginTop: 13 }}>Written in Pinegrove’s voice. Edit anything.</p>
        </div>
      </div>

      <div className="pane" style={{ marginTop: 14, padding: '16px 20px' }}>
        <div className="row row--between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 className="h3">Ready for you to post</h3>
            <p className="faint small" style={{ marginTop: 3 }}>Foxglove never posts for you.</p>
          </div>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <Chip on><Icons.copy size={12} /> Copy reply</Chip>
            <Chip on><Icons.arrow size={12} /> Open the post</Chip>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   02 — Where it looks: full-bleed band, statement + hairline specimen table
   ------------------------------------------------------------------------- */

function SourceBand() {
  return (
    <section className="band">
      <div className="wrap">
        <BandHead
          index="02"
          eyebrow="Where it looks"
          title="Someone is asking for what you sell right now."
          intro="Foxglove reads the places your buyers ask for help, and checks how you show up when they search or ask an AI assistant."
          statement
        />

        <div className="tile-grid">
          {SOURCES.map((s) => (
            <div key={s.name} className="tile">
              {s.badge ? (
                <SourceBadge src={s.badge} />
              ) : (
                <span className="src" style={{ color: s.mark === 'ai' ? 'var(--accent)' : 'var(--ink)' }}>
                  {s.mark === 'ai' ? 'AI' : 'vs'}
                </span>
              )}
              <div className="tile__body">
                <h3 className="h3">{s.name}</h3>
                <p className="muted small" style={{ marginTop: 3 }}>{s.desc}</p>
              </div>
              <span className="tile__cad">{s.cadence}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   03 — Every Monday: text left, the artefact right
   ------------------------------------------------------------------------- */

function EmailPane() {
  return (
    <div className="pane" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="row row--between" style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
        <span className="muted small">From: Foxglove · Monday, 8:00 AM</span>
        <Chip>Example</Chip>
      </div>
      <div style={{ padding: 20 }}>
        <h4 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.12rem', fontWeight: 500, lineHeight: 1.35 }}>
          Your week at Pinegrove Roofing: three things worth doing
        </h4>
        <div className="stack" style={{ gap: 15, marginTop: 16 }}>
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
      <div style={{ padding: '13px 18px', borderTop: '1px solid var(--line)', background: 'var(--accent-wash)' }}>
        <p className="muted small">Last week you posted three replies. 41 visits came from their links.</p>
      </div>
    </div>
  )
}

function MondayPlan() {
  const notes = (
    <div className="stack" style={{ gap: 15, marginTop: 26 }}>
      {MONDAY_NOTES.map((n) => (
        <p key={n} className="muted small row" style={{ gap: 10, lineHeight: 1.55, alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--accent)', flex: 'none', display: 'inline-flex', paddingTop: 2 }}>
            <Icons.flower size={13} />
          </span>
          {n}
        </p>
      ))}
    </div>
  )

  return (
    <Split
      index="03"
      eyebrow="Every Monday"
      title="Every Monday, the three things worth doing."
      intro="Foxglove ranks the week’s work by what is most likely to get you found, says why, and has the drafts waiting."
      aside={notes}
    >
      <EmailPane />
    </Split>
  )
}

/* ---------------------------------------------------------------------------
   04 — Who it's for
   ------------------------------------------------------------------------- */

function Paths() {
  return (
    <section className="wrap" style={{ paddingTop: 108 }}>
      <div style={{ maxWidth: 800 }}>
        <Eyebrow index="04">Who it’s for</Eyebrow>
        <h2 className="h2" style={{ margin: '14px 0 0' }}>Built for founders, and the agencies that help them.</h2>
      </div>

      <div className="grid2" style={{ marginTop: 38 }}>
        <div className="pane pane--pad pane--feature stack" style={{ gap: 12 }}>
          <Eyebrow>For founders</Eyebrow>
          <h3 className="h2" style={{ fontSize: '1.45rem' }}>Growth work, without a growth hire.</h3>
          <p className="muted small" style={{ lineHeight: 1.62 }}>
            You built something worth finding. Foxglove does the searching, reading, and first
            drafts so you can get back to building.
          </p>
          <div style={{ marginTop: 'auto', paddingTop: 10 }}>
            <Btn to="/signin" ghost sm>Get started</Btn>
          </div>
        </div>

        <div className="pane pane--pad stack" style={{ gap: 12 }}>
          <Eyebrow>For agencies</Eyebrow>
          <h3 className="h2" style={{ fontSize: '1.45rem' }}>Every client, one account.</h3>
          <p className="muted small" style={{ lineHeight: 1.62 }}>
            Add each client as a business. Every plan includes unlimited businesses and shares
            credits across them.
          </p>
          <div style={{ marginTop: 'auto', paddingTop: 10 }}>
            <a className="link-arrow" href="mailto:hello@foxglove.example?subject=Foxglove%20for%20my%20agency">
              Talk to us about agencies
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   05 — Pricing, on a band
   ------------------------------------------------------------------------- */

function PricingBand() {
  return (
    <section className="band">
      <div className="wrap">
        <BandHead
          index="05"
          eyebrow="Pricing"
          title="Every feature on every plan."
          intro="Plans differ only in how many credits arrive each month. Billed monthly, cancel any time."
        />

        <div className="grid3" style={{ marginTop: 38 }}>
          {Object.values(PLAN_TIERS).map((t) => (
            <div key={t.name} className="pane pane--pad stack" style={{ gap: 5 }}>
              <h3 className="h3">{t.publicName}</h3>
              <div className="row" style={{ gap: 7, alignItems: 'baseline', marginTop: 8 }}>
                <span className="display" style={{ fontSize: '2.15rem', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  ${t.monthlyUsd}
                </span>
                <span className="muted small">a month</span>
              </div>
              <p className="muted small" style={{ marginTop: 4 }}>
                {t.credits.toLocaleString('en-US')} credits a month
              </p>
              <div style={{ marginTop: 16 }}>
                <Btn to="/signin" solid sm>Get started</Btn>
              </div>
            </div>
          ))}
        </div>

        <div className="row row--between" style={{ marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
          <p className="muted small">
            Create your account, then choose your plan at checkout. Move to a bigger plan any time.
          </p>
          <Link className="link-arrow" to="/pricing">How credits work</Link>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   06 — FAQ as ruled rows
   ------------------------------------------------------------------------- */

function Faq() {
  return (
    <Split index="06" eyebrow="FAQ" title="Questions, answered.">
      <div className="faq">
        {FAQS.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p className="muted small">{f.a}</p>
          </details>
        ))}
      </div>
    </Split>
  )
}

/* ---------------------------------------------------------------------------
   Closing — inverted band
   ------------------------------------------------------------------------- */

function Closing() {
  return (
    <section className="band band--ink">
      <div className="wrap" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 26 }}>
          <Mark size={26} />
        </div>
        <h2 className="display-xl" style={{ maxWidth: '17ch', margin: '0 auto' }}>
          See who is already asking.
        </h2>
        <p className="lede" style={{ margin: '18px auto 30px', maxWidth: '42ch' }}>
          Tell Foxglove about your business and see what it finds this week.
        </p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Btn to="/signin" solid>Get started</Btn>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <SourceBand />
      <MondayPlan />
      <Paths />
      <PricingBand />
      <Faq />
      <Closing />
    </main>
  )
}
