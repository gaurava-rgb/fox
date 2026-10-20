import { useEffect, useState } from 'react'
import { listConnectors } from '../mock/api.js'
import { Eyebrow, Pane, Btn, Pill, EmptyState } from '../ui/index.jsx'

const LINE_NAME = 'The Foxglove line on your website'
const LINE_SNIPPET = '<script src="https://app.foxglove.example/api/pw.js" data-pw="demo-key" defer></script>'

/* ---------- The Foxglove line: special pane with the snippet ---------- */
function LinePane({ conn, connected, onConnect }) {
  return (
    <Pane>
      <div className="row row--between" style={{ alignItems: 'flex-start' }}>
        <div>
          <div className="eyebrow">YOUR WEBSITE</div>
          <h3 className="h3" style={{ marginTop: 8 }}>{conn.name}</h3>
          <p className="muted small" style={{ marginTop: 6, maxWidth: '52ch', lineHeight: 1.55 }}>{conn.note}</p>
        </div>
        {connected
          ? <Pill tone="green">Connected</Pill>
          : <Btn solid onClick={() => onConnect(conn.id)}>Connect</Btn>}
      </div>
      {connected && (
        <div className="fade-in" style={{ marginTop: 16 }}>
          <div style={{ background: 'var(--rail)', border: '1px solid var(--line)', borderRadius: 10, padding: '12px 14px' }}>
            <code className="mono small" style={{ display: 'block', whiteSpace: 'nowrap', overflowX: 'auto' }}>{LINE_SNIPPET}</code>
          </div>
          <p className="faint small" style={{ marginTop: 8 }}>Cookieless. No cookie is set or read, and no IP address is stored.</p>
        </div>
      )}
    </Pane>
  )
}

/* ---------- One connector row ---------- */
function ConnectorRow({ c, connected, onConnect }) {
  return (
    <div className="row" style={{ padding: '13px 2px', borderBottom: '1px solid var(--line)', gap: 12 }}>
      <span className="src">{c.name.charAt(0)}</span>
      <strong style={{ minWidth: 0, flex: '1 1 160px', fontSize: '0.92rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</strong>
      {c.note
        ? <p className="muted small" style={{ flex: 1, lineHeight: 1.45 }}>{c.note}</p>
        : <span style={{ flex: 1 }} />}
      {c.status === 'ready' ? (
        connected
          ? <Pill tone="green">Connected</Pill>
          : <>
              <Pill tone="green">Ready to connect</Pill>
              <Btn sm onClick={() => onConnect(c.id)}>Connect</Btn>
            </>
      ) : (
        <Pill tone="grey">Coming soon</Pill>
      )}
    </div>
  )
}

/* ---------- Page ---------- */
export default function Connectors() {
  const [conns, setConns] = useState(null)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')
  const [stateFilter, setStateFilter] = useState('all')
  const [connected, setConnected] = useState(() => new Set())

  useEffect(() => { listConnectors().then(setConns) }, [])

  const connect = (id) => setConnected((prev) => new Set([...prev, id]))

  const q = query.trim().toLowerCase()
  const passes = (c) =>
    (cat === 'all' || c.category === cat) &&
    (stateFilter === 'all' || c.status === stateFilter) &&
    (!q || c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))

  const filtered = (conns || []).filter(passes)
  const lineConn = (conns || []).find((c) => c.name === LINE_NAME) || null

  /* Group by category, preserving first-appearance order. */
  const groups = []
  for (const c of filtered) {
    let g = groups.find((x) => x.category === c.category)
    if (!g) { g = { category: c.category, items: [] }; groups.push(g) }
    g.items.push(c)
  }

  const categories = []
  for (const c of conns || []) {
    if (!categories.includes(c.category)) categories.push(c.category)
  }

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div>
        <Eyebrow>YOUR TOOLS, CONNECTED</Eyebrow>
        <h1 className="h1">Connectors</h1>
        <p className="lede">Connect the services Foxglove uses to understand and grow your business.</p>
      </div>

      <section className="pane" style={{ background: 'rgba(233,217,81,0.05)', borderColor: 'rgba(233,217,81,0.25)' }}>
        <p className="small" style={{ color: 'var(--yellow)', lineHeight: 1.55 }}>
          Only you and Foxglove can read what a connected account shares. You choose which property or repository to share during setup.
        </p>
      </section>

      {conns === null ? (
        <p className="faint small">Reading connectors…</p>
      ) : (
        <>
          <div className="row">
            <input
              className="field"
              placeholder="Search connectors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <select className="field sel" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="all">All categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="field sel" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option value="all">All states</option>
              <option value="ready">Ready to connect</option>
              <option value="coming">Coming soon</option>
            </select>
          </div>

          <p className="faint small">{filtered.length} connectors</p>

          {lineConn && passes(lineConn) && (
            <LinePane conn={lineConn} connected={connected.has(lineConn.id)} onConnect={connect} />
          )}

          {groups.length ? groups.map((g) => (
            <div key={g.category}>
              <div className="row" style={{ gap: 10, marginBottom: 2 }}>
                <h3 className="h3">{g.category}</h3>
                <span className="faint small">{g.items.length}</span>
              </div>
              {g.items.map((c) => (
                <ConnectorRow key={c.id} c={c} connected={connected.has(c.id)} onConnect={connect} />
              ))}
            </div>
          )) : (
            <EmptyState title="Nothing matches your filters." body="Try another word, or set the filters back to all." />
          )}

          <p className="muted small">
            Missing a tool you use?{' '}
            <a className="link-arrow" href="mailto:hello@foxglove.example?subject=Request%20a%20Connector">Request a Connector</a>
          </p>
        </>
      )}
    </div>
  )
}
