import { useEffect, useState } from 'react'
import { Eyebrow, Pane, Btn, Pill } from '../ui/index.jsx'
import { listDrafts, listFindings } from '../mock/api.js'

/* ---------- local subcomponents ---------- */

function DraftRow({ item, body, status, actions }) {
  return (
    <div style={{ padding: '13px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="row row--between" style={{ gap: 14 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="small" style={{ fontWeight: 600, lineHeight: 1.45 }}>{item.title}</div>
          <div className="muted small" style={{ marginTop: 4, lineHeight: 1.5 }}>{item.note}</div>
        </div>
        <div className="row" style={{ flex: 'none' }}>
          {status}
          {actions}
        </div>
      </div>
      {body && (
        <p className="muted small" style={{ marginTop: 8, lineHeight: 1.6, borderLeft: '2px solid var(--line)', paddingLeft: 10 }}>
          {body}
        </p>
      )}
    </div>
  )
}

/* ---------- page ---------- */

export default function Drafts() {
  const [drafts, setDrafts] = useState(null)
  const [findings, setFindings] = useState([])
  const [published, setPublished] = useState({})
  const [copied, setCopied] = useState({})

  useEffect(() => {
    let alive = true
    Promise.all([listDrafts(), listFindings()])
      .then(([d, f]) => {
        if (!alive) return
        setDrafts(d); setFindings(f)
      })
    return () => { alive = false }
  }, [])

  if (!drafts) return <p className="muted small">Gathering what is waiting on you…</p>

  /* Clipboard with a soft fallback: the "Copied" flash happens either way. */
  const flash = (key) => {
    setCopied((c) => ({ ...c, [key]: true }))
    setTimeout(() => setCopied((c) => ({ ...c, [key]: false })), 1600)
  }
  const copy = (key, text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => flash(key), () => flash(key))
    } else {
      flash(key)
    }
  }

  const replyText = (item) =>
    findings.find((f) => f.id === item.findingId)?.draft || item.title

  return (
    <div className="stack fade-in">
      <header>
        <Eyebrow>READY FOR YOUR REVIEW</Eyebrow>
        <h1 className="h1">Drafts</h1>
        <p className="lede">Review pages, content, and replies before they go further.</p>
      </header>

      <Pane
        title="Pages to finish"
        sub="Pages written for your website, waiting for you to look before they go live."
        actions={<Btn ghost sm onClick={() => {}}>New page</Btn>}
      >
        {drafts.pages.map((d) => (
          published[d.id] ? (
            <DraftRow key={d.id} item={d} status={<Pill tone="grey">Published to foxglove.site</Pill>} />
          ) : (
            <DraftRow
              key={d.id}
              item={d}
              status={<Pill tone="green">Ready</Pill>}
              actions={<Btn sm solid onClick={() => setPublished((p) => ({ ...p, [d.id]: true }))}>Publish</Btn>}
            />
          )
        ))}
      </Pane>

      <Pane title="Content and research" sub="Small rewrites to pages and documents you already have.">
        {drafts.content.map((d) => (
          <DraftRow
            key={d.id}
            item={d}
            status={<Pill tone="green">Ready</Pill>}
            actions={<Btn sm ghost onClick={() => copy(d.id, d.title)}>{copied[d.id] ? 'Copied' : 'Copy'}</Btn>}
          />
        ))}
      </Pane>

      <Pane title="Replies and flow runs" sub="Answers written for questions people asked in public.">
        {drafts.replies.map((d) => (
          <DraftRow
            key={d.id}
            item={d}
            body={replyText(d)}
            status={<Pill tone="green">Ready</Pill>}
            actions={<Btn sm ghost onClick={() => copy(d.id, replyText(d))}>{copied[d.id] ? 'Copied' : 'Copy reply'}</Btn>}
          />
        ))}
      </Pane>

      <p className="muted small" style={{ textAlign: 'center' }}>Nothing here goes anywhere until you say yes to it.</p>
    </div>
  )
}
