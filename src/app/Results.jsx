import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Eyebrow, Pane, Btn, Chip, Metric } from '../ui/index.jsx'
import { getResults } from '../mock/api.js'

export default function Results() {
  const { projectId } = useParams()
  const base = `/projects/${projectId}`
  const [results, setResults] = useState(null)
  const [replyUrl, setReplyUrl] = useState('')
  const [watching, setWatching] = useState([])

  useEffect(() => {
    let alive = true
    getResults().then((r) => { if (alive) setResults(r) })
    return () => { alive = false }
  }, [])

  if (!results) return <p className="muted small">Counting up your week…</p>

  /* Pasting a reply address starts a local watch on that page. */
  const record = (e) => {
    e.preventDefault()
    const url = replyUrl.trim()
    if (!url) return
    setWatching((w) => [...w, url])
    setReplyUrl('')
  }

  const outOfVisits = ((results.formsCompleted / results.landingVisits) * 100).toFixed(1)

  return (
    <div className="stack fade-in">
      <header>
        <Eyebrow>FROM CONVERSATION TO PROGRESS</Eyebrow>
        <h1 className="h1">See what came of it.</h1>
        <p className="lede">Follow your participation and the outcomes you can measure.</p>
        <div className="row" style={{ flexWrap: 'wrap', marginTop: 14 }}>
          <Chip>{results.week}</Chip>
          <Link className="link-arrow" to={`${base}/discover`}>Back to Discover</Link>
        </div>
      </header>

      <div className="grid3">
        <Metric
          label="Discussions found"
          value={results.discussionsFound}
          sub={`was ${results.prev.discussionsFound} last week`}
        />
        <Metric
          label="Replies recorded"
          value={results.repliesRecorded}
          sub={`was ${results.prev.repliesRecorded}`}
        />
        <Metric
          label="Social referral visits"
          value={results.referralVisits}
          sub={`was ${results.prev.referralVisits}`}
        />
      </div>

      <Pane
        title="How often your business came up"
        sub="Other people naming your business in the discussions Foxglove read."
      >
        <div className="grid2">
          <div className="pane" style={{ background: 'var(--rail)', padding: 16 }}>
            <div className="eyebrow">Previous week</div>
            <div className="mono" style={{ fontSize: '1.7rem', fontWeight: 600, marginTop: 8 }}>
              {results.mentions.lastWeek}
            </div>
          </div>
          <div className="pane" style={{ background: 'var(--rail)', padding: 16 }}>
            <div className="eyebrow">This week</div>
            <div className="mono" style={{ fontSize: '1.7rem', fontWeight: 600, marginTop: 8, color: 'var(--green)' }}>
              {results.mentions.thisWeek}
            </div>
          </div>
        </div>
        <p className="faint small" style={{ marginTop: 12 }}>
          Mentions are not views, reach, or inquiries. Repeated search matches count once.
        </p>
      </Pane>

      <Pane title="Your participation">
        <p className="muted small">
          When you post a reply Foxglove drafted, paste the address back and it watches that page.
        </p>
        <form className="row" style={{ marginTop: 12 }} onSubmit={record}>
          <input
            className="field"
            value={replyUrl}
            onChange={(e) => setReplyUrl(e.target.value)}
            placeholder="Paste the address of a reply you posted"
          />
          <Btn solid disabled={!replyUrl.trim()}>Record</Btn>
        </form>
        {watching.map((w, i) => (
          <div key={i} className="row fade-in" style={{ gap: 8, marginTop: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--green)', flex: 'none' }} />
            <span className="small">Watching: <span className="mono">{w}</span></span>
          </div>
        ))}
        <p className="faint small" style={{ marginTop: 12 }}>Foxglove never posts anything itself.</p>
      </Pane>

      <section className="stack" style={{ gap: 14 }}>
        <div>
          <Eyebrow>BEYOND THE CONVERSATION</Eyebrow>
          <h2 className="h2">Is interest turning into action?</h2>
        </div>
        <div className="grid3">
          <Metric label="Landing page visits" value={results.landingVisits} />
          <Metric label="Inquiry forms completed" value={results.formsCompleted} sub={`was ${results.formsLastWeek}`} />
          <Metric label="Inquiries out of visits" value={`${outOfVisits}%`} />
        </div>
        <Pane title="Form submissions" sub="Every inquiry stays linked to the page that brought it in.">
          <div className="row" style={{ flexWrap: 'wrap' }}>
            <button className="chip" disabled style={{ opacity: 0.45, cursor: 'not-allowed' }}>Open Front Desk</button>
            <button className="chip" disabled style={{ opacity: 0.45, cursor: 'not-allowed' }}>Track Leads</button>
          </div>
          <p className="faint small" style={{ marginTop: 10 }}>Not switched on yet</p>
        </Pane>
      </section>
    </div>
  )
}
