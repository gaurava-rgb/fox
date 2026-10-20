import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router-dom'
import { chatStream, getBusiness, listUpdates, store } from '../mock/api.js'
import { ALERT_KINDS } from '../mock/jobs.js'
import { Pill } from '../ui/index.jsx'

/* ---------- Chat dock: "Your AI CMO" ----------
   Reproduces the SSE behavior recovered from the bundle:
   phase(looking, lookup) → phase(writing) → streamed text → done. */
function ChatDock({ open, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'What should we work on? Your business context comes with you. Bring a question, a document, or a fresh idea.' },
  ])
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState(null)
  const [busy, setBusy] = useState(false)
  const cancelRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight) }, [messages, phase])

  const send = (text) => {
    if (!text.trim() || busy) return
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setBusy(true)
    setPhase(null)
    let acc = ''
    cancelRef.current = chatStream(text, {
      onPhase: (p, label) => setPhase(p.writing ? 'Writing…' : label),
      onText: (t) => {
        acc = t.text
        setMessages((m) => {
          const next = [...m]
          if (next[next.length - 1]?.role === 'assistant' && next[next.length - 1]?.streaming) next[next.length - 1] = { role: 'assistant', text: acc, streaming: true }
          else next.push({ role: 'assistant', text: acc, streaming: true })
          return next
        })
      },
      onDone: () => {
        setMessages((m) => { const n = [...m]; n[n.length - 1] = { role: 'assistant', text: acc }; return n })
        setPhase(null); setBusy(false)
      },
    })
  }

  if (!open) return null
  return (
    <div className="pane dock" style={{
      position: 'fixed', right: 20, bottom: 20, width: 420, maxHeight: '72vh',
      display: 'flex', flexDirection: 'column', zIndex: 60, boxShadow: '0 24px 64px -24px rgba(0,0,0,.7)',
    }}>
      <div className="row row--between" style={{ marginBottom: 8 }}>
        <div>
          <div className="eyebrow">Foxglove</div>
          <h3 className="h3">Your AI CMO</h3>
        </div>
        <button className="chip" onClick={onClose}>Close</button>
      </div>
      <div ref={scrollRef} className="scroll-y" style={{ flex: 1, minHeight: 180, maxHeight: '44vh', paddingRight: 6 }}>
        {messages.map((m, i) => (
          <div key={i} className={`fade-in ${m.role === 'user' ? '' : 'pane'}`} style={{
            marginBottom: 10, padding: m.role === 'user' ? '8px 12px' : 12,
            background: m.role === 'user' ? 'var(--accent)' : 'var(--rail)',
            color: m.role === 'user' ? 'var(--accent-ink)' : 'inherit',
            borderRadius: 12, fontSize: '0.86rem', lineHeight: 1.5,
            marginLeft: m.role === 'user' ? 48 : 0,
          }}>{m.text}</div>
        ))}
        {phase && (
          <div className="fade-in muted small" style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 2px' }}>
            <span className="spinner" /> {phase}
          </div>
        )}
      </div>
      <div style={{ marginTop: 10 }}>
        {!busy && messages.length <= 1 && (
          <div className="row" style={{ flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {['Help me understand our competitors', 'Prepare a content funnel', 'What are my rankings?'].map((s) => (
              <button key={s} className="chip" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}
        <form className="row" onSubmit={(e) => { e.preventDefault(); send(input) }}>
          <input className="field" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Foxglove anything" />
          <button className="btn btn--solid btn--sm" disabled={busy || !input.trim()}>Send</button>
        </form>
        <p className="faint small" style={{ marginTop: 6 }}>Enter to send · Shift + Enter for a new line</p>
      </div>
    </div>
  )
}

/* ---------- Updates popover ---------- */
function UpdatesMenu({ open, onClose }) {
  const [updates, setUpdates] = useState([])
  useEffect(() => { if (open) listUpdates().then(setUpdates) }, [open])
  if (!open) return null
  return (
    <div className="pane" style={{ position: 'fixed', left: 236, bottom: 60, width: 380, zIndex: 70, maxHeight: '50vh', overflowY: 'auto', boxShadow: '0 24px 64px -24px rgba(0,0,0,.7)' }}>
      <div className="row row--between" style={{ marginBottom: 10 }}>
        <h3 className="h3">Updates</h3>
        <button className="link-arrow small" onClick={onClose}>Close</button>
      </div>
      {updates.map((u) => {
        const meta = ALERT_KINDS[u.kind] || { label: 'New', tone: 'grey' }
        return (
          <div key={u.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--line)', opacity: u.read ? 0.5 : 1 }}>
            <div className="row row--between"><Pill tone={meta.tone}>{meta.label}</Pill><span className="faint small">{u.at}</span></div>
            <p className="small" style={{ marginTop: 6, lineHeight: 1.5 }}>{u.text}</p>
          </div>
        )
      })}
    </div>
  )
}

const BellIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none' }}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
)
const Chevron = ({ up }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    style={{ transform: up ? 'rotate(180deg)' : 'none', flex: 'none' }}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const NAV = [
  { to: `/projects/demo/summary`, label: 'Dashboard', end: false },
  { to: `/projects/demo/assets`, label: 'Assets' },
  { to: `/projects/demo/connectors`, label: 'Connectors' },
]
const MORE = [
  { to: `/projects/demo/graph`, label: 'Graph' },
  { to: `/projects/demo/flows`, label: 'Flows' },
  { to: `/projects/demo/reports/search-visibility`, label: 'Reports' },
  { to: `/billing`, label: 'Billing' },
  { to: `/settings`, label: 'Settings' },
]

export default function AppLayout() {
  const { pathname } = useLocation()
  const params = useParams()
  const [chatOpen, setChatOpen] = useState(false)
  const [updatesOpen, setUpdatesOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const pid = params.projectId

  const tabs = [
    { key: 'summary', label: 'Overview' }, { key: 'discover', label: 'Discover' },
    { key: 'results', label: 'Results' }, { key: 'drafts', label: 'Drafts' },
  ]
  const onProject = pid && tabs.some((t) => pathname.includes(`/${t.key}`))

  return (
    <div className="app" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* rail */}
      <aside className="rail">
        <div className="row" style={{ gap: 8, marginBottom: 18 }}>
          <span style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--accent)', color: 'var(--accent-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>F</span>
          <strong className="rail-word">Foxglove</strong>
        </div>
        <div className="row" style={{ gap: 10, padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 12, marginBottom: 14 }}>
          <span style={{ width: 26, height: 26, borderRadius: 8, background: '#2f2920', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>P</span>
          <div style={{ minWidth: 0 }}>
            <div className="rail-word" style={{ fontSize: '0.84rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getBusiness().name}</div>
            <div className="rail-sub faint small">1 business</div>
          </div>
        </div>
        <button className="btn btn--ghost btn--sm" style={{ marginBottom: 12, width: '100%', justifyContent: 'center' }}>+ <span className="rail-word">New chat</span></button>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `tab ${isActive ? 'tab--on' : ''}`} style={{ borderRadius: 9, border: 0, background: 'none', textAlign: 'left', padding: '8px 10px' }}><span className="rail-word">{n.label}</span></NavLink>
          ))}
          <button className="tab" style={{ textAlign: 'left', padding: '8px 10px', border: 0, background: 'none', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setMoreOpen(!moreOpen)}>
            <span className="rail-word">More</span> <Chevron up={moreOpen} />
          </button>
          {moreOpen && MORE.map((m) => (
            <NavLink key={m.to} to={m.to} className={({ isActive }) => `tab ${isActive ? 'tab--on' : ''}`} style={{ borderRadius: 9, border: 0, background: 'none', textAlign: 'left', padding: '8px 10px 8px 22px', fontSize: '0.8rem' }}><span className="rail-word">{m.label}</span></NavLink>
          ))}
        </nav>
        <div style={{ flex: 1 }} />
        <div className="eyebrow" style={{ marginBottom: 6 }}>Conversations</div>
        <p className="rail-sub faint small" style={{ marginBottom: 14 }}>You have no conversations yet.</p>
        <button className="tab" style={{ textAlign: 'left', padding: '8px 10px', border: 0, background: 'none', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setUpdatesOpen(!updatesOpen)}><BellIcon /> <span className="rail-word">Updates</span></button>
        <div className="row" style={{ gap: 8, marginTop: 8, padding: '8px 10px' }}>
          <span style={{ width: 26, height: 26, borderRadius: 99, background: '#4b197f', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>DW</span>
          <span className="small rail-word">Dana · <Link to="/settings" className="faint">Settings</Link></span>
        </div>
      </aside>

      {/* main */}
      <main className="main">
        {onProject && (
          <div className="tabs ptabs" style={{ marginBottom: 16 }}>
            {tabs.map((t) => (
              <Link key={t.key} to={`/projects/${pid}/${t.key}`} className={`tab ${pathname.includes(`/${t.key}`) ? 'tab--on' : ''}`}>{t.label}</Link>
            ))}
          </div>
        )}
        <Outlet />
      </main>

      <button className="btn btn--solid" style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 50, borderRadius: 999, boxShadow: '0 12px 32px -12px rgba(122,137,230,.8)' }} onClick={() => setChatOpen(!chatOpen)}>
        Ask Foxglove
      </button>
      <ChatDock open={chatOpen} onClose={() => setChatOpen(false)} />
      <UpdatesMenu open={updatesOpen} onClose={() => setUpdatesOpen(false)} />
    </div>
  )
}
