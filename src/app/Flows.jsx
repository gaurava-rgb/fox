import { useEffect, useRef, useState } from 'react'
import { listFlows, entitled } from '../mock/api.js'
import { Eyebrow, Pane, Btn, Chip, Pill, EmptyState, Tabs, LockNote } from '../ui/index.jsx'

const TABS = [
  { key: 'create', label: 'Create a flow' },
  { key: 'explore', label: 'Explore' },
  { key: 'mine', label: 'My flows' },
  { key: 'runs', label: 'Runs' },
]

/* Phase-one line per flow, in the voice the real app uses. */
const LOOKING = {
  'find-demand': 'Looking at what people are saying…',
  'content-funnel': 'Looking at what people are asking…',
  'search-ops': 'Looking at what people search for…',
  'weekly-posts': 'Looking at what happened this week…',
}

/* Canned run outputs (~80 words each), written for the demo business. */
const OUTPUTS = {
  'find-demand':
    'Three questions keep coming up in the places you watch. Homeowners ask who to call first after hail — the roofer or the insurance. They ask whether Class 4 shingles really lower the premium. And they ask for a contractor who will take a small repair job. Each question is asked this month without a confident answer, and each one maps to something you already do. The demand is there, waiting for a straight reply.',
  'content-funnel':
    'One question carries the whole funnel: what roof survives hail in Central Texas. The anchor page compares impact-rated shingles and metal in plain terms, with your 214 roofs as the proof. Two posts lead to it — a Reddit answer about hail claims, and a LinkedIn note about Class 4 discounts. A short homeowner guide links from the comparison page. Every piece speaks plainly, avoids exclamation marks, and names the same-day callback.',
  'search-ops':
    'Four searches have no page answering them yet. “Who do you call first after hail” — nothing local and useful. “Class 4 shingles insurance discount Texas” — forums only. “Roof repair small job Austin” — directories. “How long does a roof claim take” — lawyers, not roofers. Your site could own all four with three new pages and one rewrite. Each page answers exactly one question, in the voice you already use.',
  'weekly-posts':
    'Monday — a Reddit answer on hail claims, drafted in Dana’s voice. Tuesday — a LinkedIn post on what 214 roofs taught you about Class 4 shingles. Wednesday — a short note on the written 48-hour estimate, aimed at homeowners tired of chasing contractors. Friday — a reminder post for Cedar Park: same-day callbacks all week. Four drafts, each ready to post, and none published until you say yes.',
}

/* ---------- The open-flow panel: input, run, phases, output ---------- */
function FlowPanel({ flow, onClose, onFinished }) {
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('idle') // idle | looking | writing | done
  const [locked, setLocked] = useState(false)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const busy = phase === 'looking' || phase === 'writing'

  const run = () => {
    if (busy) return
    if (!entitled()) { setLocked(true); return }
    setLocked(false)
    setPhase('looking')
    timers.current.push(setTimeout(() => setPhase('writing'), 1200))
    timers.current.push(setTimeout(() => {
      setPhase('done')
      onFinished({ key: flow.key, name: flow.name, output: flow.output, input: input.trim(), at: 'Just now' })
    }, 2200))
  }

  return (
    <Pane
      title={flow.name}
      sub="Give this tool one line to work from"
      actions={<Btn ghost sm onClick={onClose}>Close</Btn>}
    >
      <div className="row">
        <input
          className="field"
          placeholder="One line for this tool to work from"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Btn solid onClick={run} disabled={busy}>
          {busy ? <><span className="spin">◌</span> Running…</> : 'Run'}
        </Btn>
      </div>

      {locked && (
        <div className="fade-in" style={{ marginTop: 12 }}>
          <LockNote>An active Foxglove plan is required for this. Subscribe to continue.</LockNote>
          <div style={{ marginTop: 10 }}>
            <Btn sm ghost to="/billing">See the plans</Btn>
          </div>
        </div>
      )}

      {busy && (
        <p className="muted small fade-in" style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="spin">◌</span> {phase === 'looking' ? LOOKING[flow.key] || 'Looking at what people are saying…' : 'Writing…'}
        </p>
      )}

      {phase === 'done' && (
        <div className="fade-in" style={{ marginTop: 14 }}>
          <div className="row row--between" style={{ marginBottom: 8 }}>
            <div className="eyebrow">{flow.output}</div>
            <Pill tone="green">Finished</Pill>
          </div>
          <div style={{ background: 'var(--rail)', border: '1px solid var(--line)', borderRadius: 10, padding: '14px 16px' }}>
            <p className="small" style={{ lineHeight: 1.65 }}>{OUTPUTS[flow.key]}</p>
          </div>
          <p className="faint small" style={{ marginTop: 8 }}>Saved to Runs. Nothing publishes from here — you review first.</p>
        </div>
      )}
    </Pane>
  )
}

/* ---------- Page ---------- */
export default function Flows() {
  const [flows, setFlows] = useState(null)
  const [tab, setTab] = useState('explore')
  const [openKey, setOpenKey] = useState(null)
  const [runs, setRuns] = useState([])

  useEffect(() => { listFlows().then(setFlows) }, [])

  const flow = (flows || []).find((f) => f.key === openKey) || null

  const open = (key) => { setOpenKey(key); setTab('explore') }
  const close = () => setOpenKey(null)

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div>
        <Eyebrow>SPECIALIST TOOLS, READY TO RUN</Eyebrow>
        <h1 className="h1">Flows</h1>
        <p className="lede">Choose a job. Bring your context. Review the result.</p>
      </div>

      <Tabs tabs={TABS} current={tab} onChange={setTab} />

      {flows === null ? (
        <p className="faint small">Reading your flows…</p>
      ) : tab === 'create' ? (
        <EmptyState
          title="No flows of your own yet."
          body="Turn a conversation that worked into a reusable tool, and it will live here."
          action={<Btn sm ghost>Start a conversation</Btn>}
        />
      ) : tab === 'mine' ? (
        <EmptyState title="Nothing is saved here yet." body="Flows you save from Explore appear here." />
      ) : tab === 'runs' ? (
        runs.length ? (
          <Pane title="Runs" sub={`${runs.length} run${runs.length === 1 ? '' : 's'} recorded`}>
            {runs.map((r, i) => (
              <div key={i} className="row row--between" style={{ padding: '12px 0', borderBottom: '1px solid var(--line)', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.name}</div>
                  {r.input && <p className="muted small" style={{ marginTop: 4 }}>“{r.input}”</p>}
                  <p className="faint small" style={{ marginTop: 4 }}>{r.at}</p>
                </div>
                <Pill tone="green">Finished</Pill>
              </div>
            ))}
          </Pane>
        ) : (
          <EmptyState title="No tools have run for this business yet." body="Open a flow from Explore, give it one line, and the run is recorded here." />
        )
      ) : (
        <>
          <div className="grid2">
            {flows.map((f) => (
              <div className="pane" key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <div><Chip>{f.category}</Chip></div>
                <h3 className="h3">{f.name}</h3>
                <p className="muted small" style={{ lineHeight: 1.55 }}>{f.what}</p>
                <p className="small"><span className="faint">Output: </span>{f.output}</p>
                <div style={{ marginTop: 'auto', paddingTop: 6 }}>
                  <Btn onClick={() => open(f.key)}>Open flow</Btn>
                </div>
              </div>
            ))}
          </div>

          {flow && (
            <FlowPanel
              flow={flow}
              onClose={close}
              onFinished={(r) => setRuns((prev) => [r, ...prev])}
            />
          )}
        </>
      )}

      <p className="faint small">Flows are reusable tools. Running one creates a separate run, not a new conversation.</p>
    </div>
  )
}
