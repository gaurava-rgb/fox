import { useEffect, useState } from 'react'
import { getMemory } from '../mock/api.js'
import { FACT_KINDS } from '../mock/jobs.js'
import { Eyebrow, Pane, Btn, Chip, Pill, Tabs } from '../ui/index.jsx'

/* ---------- Hand-tuned layout for the demo memory (880 × 420) ----------
   Facts sit in three bands so the five relationships stay short and readable;
   sources run along the bottom as small squares. */
const NODE_W = 170
const NODE_H = 64
const FACT_POS = {
  m2: [60, 28], m6: [255, 28], m7: [505, 28], m3: [700, 28],
  m5: [60, 140], m1: [355, 140], m4: [650, 140],
  m8: [650, 248],
}
const SRC_POS = { ms3: [140, 345], ms2: [290, 345], ms1: [430, 345], ms4: [570, 345], ms5: [760, 345] }

/* Edge endpoints (node borders) + label anchors, keyed "from>to". */
const EDGES = {
  'm5>m1': { x1: 230, y1: 172, x2: 355, y2: 172, lx: 292, ly: 163 },
  'm1>m4': { x1: 525, y1: 172, x2: 650, y2: 172, lx: 587, ly: 163 },
  'm6>m7': { x1: 425, y1: 58, x2: 505, y2: 58, lx: 465, ly: 49 },
  'ms1>m1': { x1: 436, y1: 345, x2: 440, y2: 204, lx: 470, ly: 282 },
  'ms3>m5': { x1: 146, y1: 345, x2: 145, y2: 204, lx: 185, ly: 282 },
}

/* Kind → border colour on the map (matches the shared palette). */
const KIND_COLOR = {
  offer: '#7a89e6', proof: '#7a89e6', audience: '#7a89e6', objection: '#7a89e6',
  competitor: '#e86a6a', voice: '#e9d951', persona: '#e9d951', decision: '#7bd88f',
}
const KIND_PILL = {
  offer: 'grey', proof: 'grey', audience: 'grey', objection: 'grey',
  competitor: 'red', voice: 'yellow', persona: 'yellow', decision: 'green',
}
const SRC_LABEL = {
  'site-read': 'Website read', owner: 'Notes from Dana', competitor: 'Competitor read',
  'company-thread': 'r/Austin thread', week: 'Weekly summary',
}
const LEGEND = [
  ['Products, customers, results', '#7a89e6'],
  ['Competitors', '#e86a6a'],
  ['Voice and persona', '#e9d951'],
  ['Decisions', '#7bd88f'],
]

const kindLabel = (k) => FACT_KINDS[k]?.label || k.charAt(0).toUpperCase() + k.slice(1)

/* Truncate a fact to two short lines for its node. */
function wrap2(text, max = 30) {
  const words = String(text).replace(/\s+/g, ' ').trim().split(' ')
  const lines = ['']
  for (const w of words) {
    const cur = lines[lines.length - 1]
    if (cur && cur.length + 1 + w.length > max) {
      if (lines.length === 2) break
      lines.push(w)
    } else {
      lines[lines.length - 1] = cur ? cur + ' ' + w : w
    }
  }
  return { l1: lines[0] || '', l2: lines[1] || '', more: lines.join(' ').length < words.join(' ').length }
}

const centerOf = (id) => {
  const f = FACT_POS[id]; if (f) return [f[0] + NODE_W / 2, f[1] + NODE_H / 2]
  const s = SRC_POS[id]; if (s) return [s[0] + 6, s[1] + 6]
  return [440, 210]
}

/* ---------- Map tab: pure inline SVG, no libraries ---------- */
function GraphMap({ mem }) {
  const [hover, setHover] = useState(null)

  return (
    <Pane>
      <div style={{ background: '#1e1e1e', borderRadius: 10, padding: 8 }}>
        <svg viewBox="0 0 880 420" width="100%" style={{ display: 'block', maxWidth: 880 }} role="img" aria-label="Map of what Foxglove knows">
          {/* edges first, so lines tuck behind nodes */}
          {mem.relationships.map((r) => {
            const key = `${r.from}>${r.to}`
            let g = EDGES[key]
            if (!g) {
              const [x1, y1] = centerOf(r.from)
              const [x2, y2] = centerOf(r.to)
              g = { x1, y1, x2, y2, lx: (x1 + x2) / 2, ly: (y1 + y2) / 2 - 7 }
            }
            const on = hover === r.from || hover === r.to
            return (
              <g key={key}>
                <line
                  x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}
                  stroke={on ? '#7a89e6' : 'rgba(237,237,240,0.28)'}
                  strokeWidth={on ? 1.6 : 1}
                />
                <text
                  x={g.lx} y={g.ly} textAnchor="middle" fontSize={8.5}
                  fill={on ? '#9aa6ee' : 'rgba(237,237,240,0.45)'}
                >{r.label}</text>
              </g>
            )
          })}

          {/* sources: small squares along the bottom */}
          {mem.sources.map((s) => {
            const pos = SRC_POS[s.id] || [440, 345]
            const on = hover === s.id
            return (
              <g key={s.id} onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)}>
                <rect
                  x={pos[0]} y={pos[1]} width={12} height={12} rx={3}
                  fill={on ? '#2e2e3a' : '#272727'}
                  stroke={on ? '#7a89e6' : 'rgba(255,255,255,0.35)'} strokeWidth={1.2}
                />
                <text x={pos[0] + 6} y={pos[1] + 26} textAnchor="middle" fontSize={8.5} fill="rgba(237,237,240,0.55)">
                  {SRC_LABEL[s.kind] || s.name}
                </text>
              </g>
            )
          })}

          {/* facts: rounded rects with kind-coloured borders */}
          {mem.facts.map((f) => {
            const pos = FACT_POS[f.id] || [440, 200]
            const col = KIND_COLOR[f.kind] || '#7a89e6'
            const w = wrap2(f.text)
            const on = hover === f.id
            return (
              <g key={f.id} onMouseEnter={() => setHover(f.id)} onMouseLeave={() => setHover(null)}>
                <rect
                  x={pos[0]} y={pos[1]} width={NODE_W} height={NODE_H} rx={12}
                  fill={on ? '#2e2e3a' : '#272727'} stroke={col} strokeWidth={1.4}
                />
                <text x={pos[0] + 12} y={pos[1] + 20} fontSize={10.5} fontWeight={600} fill="#ededf0">
                  {kindLabel(f.kind)}
                </text>
                <text x={pos[0] + 12} y={pos[1] + 36} fontSize={8.5} fill="rgba(237,237,240,0.5)">{w.l1}</text>
                <text x={pos[0] + 12} y={pos[1] + 48} fontSize={8.5} fill="rgba(237,237,240,0.5)">{w.l2}{w.more ? '…' : ''}</text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="row" style={{ gap: 18, marginTop: 12, flexWrap: 'wrap' }}>
        {LEGEND.map(([label, c]) => (
          <span key={label} className="row small" style={{ gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 3, background: c, display: 'inline-block' }} />
            <span className="faint">{label}</span>
          </span>
        ))}
        <span className="faint small" style={{ marginLeft: 'auto' }}>Hover a fact to light up its relationships.</span>
      </div>
    </Pane>
  )
}

/* ---------- List tab ---------- */
function GraphList({ mem }) {
  const factById = Object.fromEntries(mem.facts.map((f) => [f.id, f]))
  const srcById = Object.fromEntries(mem.sources.map((s) => [s.id, s]))
  const nameOf = (n) => (n ? (FACT_KINDS[n.kind] ? FACT_KINDS[n.kind].label : SRC_LABEL[n.kind] || n.name) : '—')

  return (
    <div className="stack" style={{ gap: 18 }}>
      <Pane title="Facts" sub={`${mem.facts.length} facts held about your business`}>
        {mem.facts.map((f) => (
          <div key={f.id} className="row" style={{ padding: '11px 0', borderBottom: '1px solid var(--line)', gap: 12, alignItems: 'flex-start' }}>
            <Pill tone={KIND_PILL[f.kind] || 'grey'}>{kindLabel(f.kind)}</Pill>
            <p className="small" style={{ flex: 1, lineHeight: 1.6 }}>{f.text}</p>
            <span className="faint small" style={{ minWidth: 170, textAlign: 'right' }}>sources: {f.sources.join(', ')}</span>
          </div>
        ))}
      </Pane>

      <div className="grid2">
        <Pane title="Sources" sub="Where each fact came from">
          {mem.sources.map((s) => (
            <div key={s.id} className="row row--between" style={{ padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
              <span className="row small" style={{ gap: 8 }}>
                <span style={{ width: 9, height: 9, borderRadius: 2, background: 'var(--accent)', display: 'inline-block' }} />
                {s.name}
              </span>
              <span className="faint small">{s.at}</span>
            </div>
          ))}
        </Pane>

        <Pane title="Relationships" sub="How the facts connect">
          {mem.relationships.map((r) => (
            <div key={`${r.from}>${r.to}`} className="row small" style={{ padding: '9px 0', borderBottom: '1px solid var(--line)', gap: 8 }}>
              <span>{nameOf(factById[r.from] || srcById[r.from])}</span>
              <span className="faint">→</span>
              <span style={{ color: 'var(--accent)' }}>{r.label}</span>
              <span className="faint">→</span>
              <span>{nameOf(factById[r.to] || srcById[r.to])}</span>
            </div>
          ))}
        </Pane>
      </div>
    </div>
  )
}

/* ---------- Page ---------- */
export default function Graph() {
  const [mem, setMem] = useState(null)
  const [tab, setTab] = useState('map')

  useEffect(() => { getMemory().then(setMem) }, [])

  const TABS = [
    { key: 'map', label: 'Map' },
    { key: 'list', label: 'List' },
  ]

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="row row--between" style={{ alignItems: 'flex-start' }}>
        <div>
          <Eyebrow>YOUR SHARED UNDERSTANDING</Eyebrow>
          <h1 className="h1">What Foxglove knows.</h1>
          <p className="lede">Explore the facts, sources, and relationships behind its work.</p>
        </div>
        {mem && <Chip>Revision {mem.revision}</Chip>}
      </div>

      <Tabs tabs={TABS} current={tab} onChange={setTab} />

      {mem === null ? (
        <p className="faint small">Reading what Foxglove knows…</p>
      ) : (
        <>
          {tab === 'map' ? <GraphMap mem={mem} /> : <GraphList mem={mem} />}

          <Pane title="Not written yet" sub="Kinds of fact Foxglove has not written for this business">
            <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
              {mem.missing.map((k) => <Chip key={k}>{kindLabel(k)}</Chip>)}
            </div>
            <p className="faint small" style={{ marginTop: 10 }}>
              Add context on Assets, or say it in a conversation, and the kinds it teaches Foxglove appear here.{' '}
              <Btn sm ghost to="/projects/demo/assets">Open Assets</Btn>
            </p>
          </Pane>
        </>
      )}
    </div>
  )
}
