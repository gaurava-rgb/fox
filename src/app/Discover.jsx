import { useEffect, useState } from 'react'
import { Eyebrow, Pane, Btn, Chip, Pill, SourceBadge } from '../ui/index.jsx'
import { listSources, listSearches, listFindings } from '../mock/api.js'

const FILTERS = [
  { key: 'all', label: 'All sources' },
  { key: 'reddit', label: 'Reddit' },
  { key: 'x', label: 'X' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'forums', label: 'Forums' },
]

const CLASSIFICATIONS = {
  'potential-customer': { label: 'Potential customer', tone: 'yellow' },
  brand: { label: 'Your brand', tone: 'green' },
  competitor: { label: 'Competitor', tone: 'red' },
  trend: { label: 'Trend', tone: 'grey' },
}

const TRY = ['A community', 'A customer question', 'Your brand']

const PATTERNS = [
  'People are scared of the insurance process more than of the price.',
  'Small repair jobs are underserved — most roofers want replacements.',
]

/* ---------- local subcomponents ---------- */

function FindingCard({ finding, copied, onCopy }) {
  const cls = CLASSIFICATIONS[finding.classification] || { label: 'Finding', tone: 'grey' }
  return (
    <div className="pane fade-in">
      <div className="row row--between" style={{ gap: 12 }}>
        <div className="row" style={{ gap: 10, minWidth: 0 }}>
          <SourceBadge src={finding.source} />
          <strong className="small">{finding.place}</strong>
          <span className="faint small">{finding.foundAt}</span>
        </div>
        <Pill tone={cls.tone}>{cls.label}</Pill>
      </div>
      <h3 className="h3" style={{ margin: '12px 0 6px' }}>{finding.title}</h3>
      <p className="muted small" style={{ lineHeight: 1.6 }}>{finding.body}</p>
      {finding.draft && (
        <div className="pane" style={{ marginTop: 14, background: 'var(--rail)' }}>
          <div className="eyebrow">Foxglove drafted a reply</div>
          <p className="small" style={{ marginTop: 8, lineHeight: 1.6 }}>{finding.draft}</p>
          <div className="row" style={{ marginTop: 12, flexWrap: 'wrap' }}>
            <button className={`chip ${copied ? 'chip--on' : ''}`} onClick={() => onCopy(finding)}>
              {copied ? 'Copied' : 'Copy reply'}
            </button>
            <button className="chip">Open the post</button>
          </div>
          <p className="faint small" style={{ marginTop: 10 }}>
            Written in Pinegrove’s voice. Edit anything. Foxglove never posts for you.
          </p>
        </div>
      )}
    </div>
  )
}

/* ---------- page ---------- */

export default function Discover() {
  const [sources, setSources] = useState([])
  const [searches, setSearches] = useState([])
  const [findings, setFindings] = useState(null)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState({})

  useEffect(() => {
    let alive = true
    Promise.all([listSources(), listSearches(), listFindings()])
      .then(([src, q, f]) => {
        if (!alive) return
        setSources(src); setSearches(q); setFindings(f)
      })
    return () => { alive = false }
  }, [])

  if (!findings) return <p className="muted small">Listening for your market…</p>

  /* A new search lands at the top of "Sources and searches". */
  const submitSearch = (e) => {
    e.preventDefault()
    const text = query.trim()
    if (!text) return
    setSearches((s) => [{ id: `local-${Date.now()}`, text, where: 'All sources' }, ...s])
    setQuery('')
  }

  const copyDraft = (finding) => {
    const flash = () => {
      setCopied((c) => ({ ...c, [finding.id]: true }))
      setTimeout(() => setCopied((c) => ({ ...c, [finding.id]: false })), 1600)
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(finding.draft).then(flash, flash)
    } else {
      flash()
    }
  }

  const shown = findings.filter((f) => filter === 'all' || f.source === filter)

  return (
    <div className="stack fade-in">
      <header>
        <Eyebrow>LISTEN. UNDERSTAND. JOIN IN.</Eyebrow>
        <h1 className="h1">Find your next conversation.</h1>
        <p className="lede">Customer questions, brand mentions, and ideas worth exploring.</p>
      </header>

      <div className="row" style={{ flexWrap: 'wrap' }}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`chip ${filter === f.key ? 'chip--on' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Pane title="What should we explore?" sub="What conversations should Foxglove find">
        <form className="row" onSubmit={submitSearch}>
          <input
            className="field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="A community, discussion, business name, or customer question."
          />
          <Btn solid disabled={!query.trim()}>Continue</Btn>
        </form>
        <div className="row" style={{ marginTop: 12, flexWrap: 'wrap' }}>
          <span className="faint small">Try</span>
          {TRY.map((t) => (
            <button key={t} className="chip" onClick={() => setQuery(t)}>{t}</button>
          ))}
        </div>
      </Pane>

      <Pane
        title="Sources and searches"
        actions={
          <>
            <Chip>{sources.length + searches.length}</Chip>
            <Btn ghost sm onClick={() => {}}>Manage</Btn>
          </>
        }
      >
        {sources.map((s) => (
          <div key={s.id} className="row row--between" style={{ gap: 12, padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
            <div className="row" style={{ gap: 10, minWidth: 0 }}>
              <SourceBadge src={s.kind} />
              <strong className="small">{s.name}</strong>
            </div>
            <div className="row" style={{ gap: 8, flex: 'none' }}>
              <Chip>{s.cadence}</Chip>
              <span className="faint small">{s.status === 'shared' ? 'Posts you share' : 'Checked for you'}</span>
            </div>
          </div>
        ))}
        {searches.map((q) => (
          <div key={q.id} className="row row--between fade-in" style={{ gap: 12, padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
            <strong className="small" style={{ minWidth: 0 }}>{q.text}</strong>
            <div className="row" style={{ gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {q.where.split(', ').map((w) => <Chip key={w}>{w}</Chip>)}
            </div>
          </div>
        ))}
      </Pane>

      <section className="stack" style={{ gap: 14 }}>
        <div className="row row--between">
          <h2 className="h2">For your business</h2>
          <span className="faint small">{shown.length} this week</span>
        </div>
        {shown.map((f) => (
          <FindingCard key={f.id} finding={f} copied={!!copied[f.id]} onCopy={copyDraft} />
        ))}
      </section>

      <Pane
        title="Patterns this week"
        sub="Grouped from this week’s findings, so you read the pattern and not thirty cards."
      >
        {PATTERNS.map((p, i) => (
          <div
            key={i}
            className="row"
            style={{ gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: i < PATTERNS.length - 1 ? '1px solid var(--line)' : 0 }}
          >
            <span className="faint small mono">{i + 1}</span>
            <p className="small" style={{ lineHeight: 1.6 }}>{p}</p>
          </div>
        ))}
      </Pane>
    </div>
  )
}
