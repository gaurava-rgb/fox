import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Eyebrow, Pane, Btn, Chip, Pill, SourceBadge, Metric, LockNote , Spinner } from '../ui/index.jsx'
import { ALERT_KINDS } from '../mock/jobs.js'
import {
  getBusiness, entitled, listJobs, runJob, listSources, listSearches,
  listDocuments, listUpdates, getResults, getMondayPlan, getAiAnswers,
} from '../mock/api.js'

/* ---------- local subcomponents ---------- */

function MiniStat({ label, value, tone }) {
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: 6, color: tone || 'inherit' }}>
        {value}
      </div>
    </div>
  )
}

function SourceCard({ source }) {
  return (
    <div className="pane" style={{ padding: 14 }}>
      <div className="row" style={{ gap: 10 }}>
        <SourceBadge src={source.kind} />
        <strong className="small" style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {source.name}
        </strong>
      </div>
      <div className="row row--between" style={{ marginTop: 12 }}>
        <Chip>{source.cadence}</Chip>
        <span className="faint small">{source.status === 'shared' ? 'Posts you share' : 'Checked for you'}</span>
      </div>
    </div>
  )
}

function JobRow({ job, run, onRun }) {
  const busy = run && (run.state === 'busy' || run.state === 'running')
  const lastRun =
    run?.state === 'running' ? 'Running now…' :
    run?.state === 'done' ? 'Finished just now' :
    job.lastRun
  return (
    <div style={{ padding: '11px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="row row--between" style={{ gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="small" style={{ fontWeight: 600 }}>{job.name}</div>
          <div className="faint small" style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            {run?.state === 'running' && <Spinner />}{lastRun}
          </div>
        </div>
        <div className="row" style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Chip>{job.when}</Chip>
          <Chip>{job.cost > 0 ? `${job.cost} credits` : 'Free'}</Chip>
          {job.startedBy && (
            <Btn sm solid disabled={busy} onClick={() => onRun(job)}>Run now</Btn>
          )}
        </div>
      </div>
      {run?.state === 'locked' && (
        <div style={{ marginTop: 10 }}>
          <LockNote>{run.error}</LockNote>
        </div>
      )}
    </div>
  )
}

/* ---------- page ---------- */

export default function Overview() {
  const { projectId } = useParams()
  const base = `/projects/${projectId}`
  const business = getBusiness()
  const hasPlan = entitled()

  const [results, setResults] = useState(null)
  const [sources, setSources] = useState([])
  const [searches, setSearches] = useState([])
  const [documents, setDocuments] = useState([])
  const [jobs, setJobs] = useState([])
  const [updates, setUpdates] = useState([])
  const [plan, setPlan] = useState(null)
  const [answers, setAnswers] = useState([])
  const [runs, setRuns] = useState({})

  useEffect(() => {
    let alive = true
    Promise.all([
      getResults(), listSources(), listSearches(), listDocuments(),
      listJobs(), listUpdates(), getMondayPlan(), getAiAnswers(),
    ]).then(([r, src, q, docs, j, ups, mp, ai]) => {
      if (!alive) return
      setResults(r); setSources(src); setSearches(q); setDocuments(docs)
      setJobs(j.jobs); setUpdates(ups); setPlan(mp); setAnswers(ai)
    })
    return () => { alive = false }
  }, [])

  if (!results || !plan) return <p className="muted small">Bringing your business into view…</p>

  const firstName = business.name.split(' & ')[0]
  const alert = updates.find((u) => u.kind === 'finding-worth-answering')
  const alertMeta = alert ? ALERT_KINDS[alert.kind] : null
  const namedBy = answers.filter((a) => a.named).length

  /* Mirrors the real server's run-now endpoint: 402 comes back as a
     LockNote with the exact error text; success runs, then finishes. */
  const runNow = async (job) => {
    setRuns((r) => ({ ...r, [job.key]: { state: 'busy' } }))
    const res = await runJob(job.key)
    if (res.ok) {
      setRuns((r) => ({ ...r, [job.key]: { state: 'running' } }))
      setTimeout(() => setRuns((r) => ({ ...r, [job.key]: { state: 'done' } })), 2600)
    } else {
      setRuns((r) => ({ ...r, [job.key]: { state: 'locked', error: res.error } }))
    }
  }

  const week = [
    { label: 'Discussions found', value: results.discussionsFound, prev: results.prev.discussionsFound },
    { label: 'Replies recorded', value: results.repliesRecorded, prev: results.prev.repliesRecorded },
    { label: 'Referral visits', value: results.referralVisits, prev: results.prev.referralVisits },
  ]

  return (
    <div className="stack fade-in">
      <header>
        <Eyebrow>YOUR BUSINESS, IN VIEW</Eyebrow>
        <h1 className="h1">Welcome, {firstName}.</h1>
        <p className="lede">Here is what matters this week.</p>
        <div className="row" style={{ flexWrap: 'wrap', marginTop: 14 }}>
          {hasPlan ? <Pill tone="green">Plan active</Pill> : <Pill tone="yellow">No plan yet</Pill>}
          <Chip>1 site connected</Chip>
        </div>
      </header>

      <Pane title="Your week" sub={results.week}>
        <div className="grid3">
          {week.map((m) => (
            <Metric key={m.label} label={m.label} value={m.value} sub={`↑ ${m.value - m.prev} vs last week`} />
          ))}
        </div>
        <p className="faint small" style={{ marginTop: 12 }}>
          Clicks and replies move in days, while rankings and AI mentions move in weeks.
        </p>
      </Pane>

      <section className="stack" style={{ gap: 14 }}>
        <div className="row row--between" style={{ alignItems: 'flex-end', gap: 12 }}>
          <div>
            <Eyebrow>LISTENING TO YOUR MARKET</Eyebrow>
            <h2 className="h2">Your next customer could be asking a question.</h2>
          </div>
          <Link className="link-arrow" to={`${base}/discover`}>Discover</Link>
        </div>
        <p className="muted small">Pick a place and Foxglove starts listening there.</p>
        <div className="grid3">
          {sources.map((s) => <SourceCard key={s.id} source={s} />)}
        </div>
      </section>

      <Pane title="Your sources and searches" actions={<Btn ghost sm onClick={() => {}}>Manage</Btn>}>
        {searches.map((q) => (
          <div key={q.id} className="row row--between" style={{ gap: 12, padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
            <strong className="small" style={{ minWidth: 0 }}>{q.text}</strong>
            <div className="row" style={{ gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {q.where.split(', ').map((w) => <Chip key={w}>{w}</Chip>)}
            </div>
          </div>
        ))}
      </Pane>

      <div className="grid2">
        <Pane title="Page speed">
          <div className="row" style={{ gap: 26 }}>
            <MiniStat label="Mobile" value={84} />
            <MiniStat label="Desktop" value={96} />
          </div>
          <p className="muted small" style={{ marginTop: 10 }}>Your five most important pages, scored on phone and desktop.</p>
          <Link className="link-arrow" to={`${base}/reports/page-speed`}>Page speed report</Link>
        </Pane>
        <Pane title="SEO health">
          <div className="row" style={{ gap: 26 }}>
            <MiniStat label="Checks passed" value={3} tone="var(--green)" />
            <MiniStat label="Open" value={1} tone="var(--yellow)" />
          </div>
          <p className="muted small" style={{ marginTop: 10 }}>On-page checks from last night’s read of your site.</p>
          <Link className="link-arrow" to={`${base}/reports/seo-health`}>SEO health report</Link>
        </Pane>
        <Pane title="Search visibility">
          <div className="row" style={{ gap: 26 }}>
            <MiniStat label="Impressions" value="1,840" />
            <MiniStat label="Clicks" value={96} />
          </div>
          <p className="muted small" style={{ marginTop: 10 }}>The last 7 days, up from 1,210 and 61 the week before.</p>
          <Link className="link-arrow" to={`${base}/reports/search-visibility`}>Search visibility report</Link>
        </Pane>
        <Pane title="AI visibility">
          <MiniStat label="Assistants that name you" value={`${namedBy} of ${answers.length}`} />
          <p className="muted small" style={{ marginTop: 10 }}>Only Assistant C names you for “best roof for hail in Austin”.</p>
          <Link className="link-arrow" to={`${base}/reports/ai-visibility`}>AI visibility report</Link>
        </Pane>
      </div>

      {alert && alertMeta && (
        <Pane title="Needs your input">
          <div className="row row--between" style={{ gap: 12 }}>
            <div className="row" style={{ gap: 12, minWidth: 0 }}>
              <Pill tone={alertMeta.tone}>{alertMeta.label}</Pill>
              <span className="small">{alert.text}</span>
            </div>
            <Link className="link-arrow" to={`${base}/discover`}>Discover</Link>
          </div>
        </Pane>
      )}

      <Pane title="Business documents">
        {documents.map((d) => (
          <Link
            key={d.id}
            to={`${base}/assets`}
            className="row row--between"
            style={{ gap: 12, padding: '10px 0', borderBottom: '1px solid var(--line)' }}
          >
            <strong className="small">{d.kind}</strong>
            <Chip>Written · {d.updated}</Chip>
          </Link>
        ))}
      </Pane>

      <Pane title="Competitor snapshot">
        <p className="small" style={{ lineHeight: 1.6 }}>
          <strong>Lone Star Roofing</strong> — bids ~$18k on 1,800 sq ft, no itemized breakdown.
          Named in 2 of 12 discussions; you were named in 3.
        </p>
      </Pane>

      <Pane title="Put Foxglove to work." sub="Run a specialist flow for research, enrichment, or a content funnel.">
        {jobs.map((job) => (
          <JobRow key={job.key} job={job} run={runs[job.key]} onRun={runNow} />
        ))}
      </Pane>
      {!hasPlan && <p className="faint small">Starting a job by hand comes with a Foxglove plan.</p>}

      <Pane title="Your Monday plan" sub="Written up and sent to you every Monday morning.">
        <p className="small" style={{ fontWeight: 600 }}>{plan.subject}</p>
        <div className="stack" style={{ gap: 12, marginTop: 12 }}>
          {plan.items.map((it, i) => (
            <div key={i} className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
              <span className="faint small mono">{i + 1}</span>
              <div>
                <div className="small" style={{ fontWeight: 600 }}>{it.title}</div>
                <div className="muted small" style={{ marginTop: 2, lineHeight: 1.5 }}>{it.note}</div>
              </div>
            </div>
          ))}
        </div>
        <hr className="sep" />
        <p className="faint small">{plan.footer}</p>
      </Pane>
    </div>
  )
}
