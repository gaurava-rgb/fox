import { useEffect, useState } from 'react'
import { listDocuments } from '../mock/api.js'
import { Eyebrow, Pane, Btn, Pill, EmptyState, Tabs , Spinner } from '../ui/index.jsx'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'business', label: 'Business documents' },
  { key: 'uploads', label: 'Uploads' },
  { key: 'created', label: 'Created work' },
  { key: 'brand', label: 'Brand kit' },
]

const EMPTY_TABS = {
  uploads: 'Files you add from your computer are kept here.',
  created: 'Work Foxglove writes for you is kept here.',
  brand: 'Your colors, type and voice are kept here.',
}

/* One line per document, phrased like the real app's kind descriptions. */
const DOC_DESC = {
  'Business and product information': 'What this business is, what it sells, and who it sells to.',
  'Marketing strategy': 'Who to sell to, what to say, and where to show up.',
  'Design guide': 'The look and the voice to use for anything new.',
  'Competitor analysis': 'Who this business is weighed against, what they charge, and what to do about them.',
  'Content strategy': 'What to publish next, and why each piece earns its place.',
  'Site health report': 'What the last read of your website found, checked page by page.',
}

/* ---------- Share what you already have ---------- */
function SharePane() {
  const [site, setSite] = useState('idle') // idle | reading | read
  const [notes, setNotes] = useState('idle')

  const readSite = () => {
    if (site === 'reading') return
    setSite('reading')
    setTimeout(() => setSite('read'), 1500)
  }
  const readNotes = () => {
    if (notes === 'reading') return
    setNotes('reading')
    setTimeout(() => setNotes('read'), 1200)
  }

  return (
    <Pane title="Share what you already have" sub="Foxglove writes your documents from what you share.">
      <div className="eyebrow" style={{ marginBottom: 8 }}>Website address</div>
      <div className="row">
        <input className="field" defaultValue="https://pinegrove-roofing.example.com" placeholder="https://your-website.com" />
        {site === 'idle' && <Btn solid onClick={readSite}>Read website</Btn>}
        {site === 'reading' && <Btn solid disabled><Spinner /> Reading…</Btn>}
        {site === 'read' && <Pill tone="green">Read 14 pages</Pill>}
      </div>

      <hr className="sep" />

      <div className="eyebrow" style={{ marginBottom: 8 }}>Document (PDF, Word, Markdown, or text; up to 5 MB)</div>
      <input type="file" className="field" accept=".pdf,.doc,.docx,.md,.txt" style={{ padding: '9px 12px' }} />

      <hr className="sep" />

      <div className="eyebrow" style={{ marginBottom: 8 }}>Notes</div>
      <input className="field" placeholder="Notes title" style={{ marginBottom: 8 }} />
      <textarea className="field" placeholder="Source text" rows={3} style={{ marginBottom: 12, resize: 'vertical' }} />
      <div className="row">
        {notes === 'idle' && <Btn solid onClick={readNotes}>Read notes</Btn>}
        {notes === 'reading' && <Btn solid disabled><Spinner /> Reading…</Btn>}
        {notes === 'read' && <Pill tone="green">Saved to your business details</Pill>}
      </div>
    </Pane>
  )
}

/* ---------- Page ---------- */
export default function Assets() {
  const [docs, setDocs] = useState(null)
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')

  useEffect(() => { listDocuments().then(setDocs) }, [])

  const q = query.trim().toLowerCase()
  const filtered = (docs || []).filter((d) =>
    (tab === 'all' || (tab === 'business' && d.shelf === 'Business documents')) &&
    (!q || d.kind.toLowerCase().includes(q))
  )

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="row row--between" style={{ alignItems: 'flex-start' }}>
        <div>
          <Eyebrow>YOUR SHARED LIBRARY</Eyebrow>
          <h1 className="h1">Assets</h1>
          <p className="lede">Everything you bring. Everything Foxglove creates.</p>
        </div>
        <Btn solid onClick={() => {}}>Add context</Btn>
      </div>

      <Tabs tabs={TABS} current={tab} onChange={setTab} />

      {EMPTY_TABS[tab] ? (
        <EmptyState title="Nothing is saved here yet." body={EMPTY_TABS[tab]} />
      ) : docs === null ? (
        <p className="faint small">Reading your library…</p>
      ) : (
        <div className="stack" style={{ gap: 14 }}>
          <input
            className="field"
            placeholder="Search everything you have saved"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: 360 }}
          />
          {filtered.length ? (
            <div className="grid3">
              {filtered.map((d) => (
                <div className="pane fade-in" key={d.id}>
                  <div className="eyebrow">{d.shelf}</div>
                  <h3 className="h3" style={{ margin: '10px 0 6px' }}>{d.kind}</h3>
                  <p className="muted small" style={{ lineHeight: 1.55 }}>{DOC_DESC[d.kind]}</p>
                  <div className="row row--between" style={{ marginTop: 16 }}>
                    <Pill tone="green">Written</Pill>
                    <span className="faint small">Updated {d.updated}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Nothing matches your search." body="Try another word, or clear the search to see everything you have saved." />
          )}
        </div>
      )}

      <SharePane />
    </div>
  )
}
