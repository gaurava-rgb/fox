import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getRankings, getAiAnswers } from '../mock/api.js'
import { Eyebrow, Pane, Pill, EmptyState, Metric } from '../ui/index.jsx'

/* ---------- shared header ---------- */
function ReportHeader({ title, lede }) {
  return (
    <div>
      <Eyebrow>OVERVIEW / REPORT</Eyebrow>
      <h1 className="h1">{title}</h1>
      <p className="lede">{lede}</p>
    </div>
  )
}

/* ---------- 8-bar sparkline row (plain divs) ---------- */
const DAYS = ['13', '14', '15', '16', '17', '18', '19', '20']
const IMPRESSIONS = [180, 210, 195, 240, 260, 235, 270, 250]
const CLICKS_BY_DAY = [8, 10, 9, 13, 14, 12, 16, 14]

function Sparkline({ label, values, color }) {
  const max = Math.max(...values)
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 10 }}>{label}</div>
      <div className="row" style={{ alignItems: 'flex-end', gap: 6, height: 64 }}>
        {values.map((v, i) => (
          <div
            key={i}
            title={String(v)}
            style={{ flex: 1, height: Math.max(3, (v / max) * 58), background: color, opacity: 0.75, borderRadius: '4px 4px 0 0' }}
          />
        ))}
      </div>
      <div className="row mono faint" style={{ gap: 6, marginTop: 6, fontSize: '0.66rem' }}>
        {DAYS.map((d) => <span key={d} style={{ flex: 1, textAlign: 'center' }}>{d}</span>)}
      </div>
    </div>
  )
}

/* ---------- search visibility ---------- */
function RankingsPane() {
  const [rows, setRows] = useState(null)
  useEffect(() => { getRankings().then(setRows) }, [])

  return (
    <Pane title="Where you come up in search" sub="Checked each night for the searches you watch">
      {rows === null ? (
        <p className="faint small">Reading your rankings…</p>
      ) : (
        <>
          <div className="row faint small" style={{ padding: '4px 0 8px', borderBottom: '1px solid var(--line)', fontSize: '0.68rem', letterSpacing: '0.12em' }}>
            <span style={{ flex: 1 }}>SEARCH</span>
            <span style={{ width: 64 }}>POSITION</span>
            <span style={{ width: 64 }}>CHANGE</span>
            <span style={{ width: 120 }} />
          </div>
          {rows.map((r) => {
            const diff = r.last - r.position // positive = moved up
            const tone = diff > 0 ? 'var(--green)' : diff < 0 ? 'var(--red)' : 'var(--faint)'
            return (
              <div key={r.query} className="row" style={{ padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ flex: 1, fontSize: '0.9rem' }}>{r.query}</span>
                <span className="mono" style={{ width: 64, fontSize: '0.9rem' }}>#{r.position}</span>
                <span style={{ width: 64, fontSize: '0.8rem', color: tone }}>
                  {diff > 0 ? `▲ ${diff}` : diff < 0 ? `▼ ${-diff}` : '—'}
                </span>
                <div title={`#${r.position} — shorter is closer to the top`} style={{ width: 120, height: 6, background: 'var(--rail)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (r.position / 30) * 100)}%`, height: '100%', background: 'var(--accent)', opacity: 0.7 }} />
                </div>
              </div>
            )
          })}
        </>
      )}
    </Pane>
  )
}

function AiAnswersPane() {
  const [rows, setRows] = useState(null)
  useEffect(() => { getAiAnswers().then(setRows) }, [])

  return (
    <Pane title="What the AI assistants say" sub="Asked weekly · “best roof for hail in Austin”">
      {rows === null ? (
        <p className="faint small">Reading AI answers…</p>
      ) : rows.map((a) => (
        <div key={a.assistant} className="row" style={{ padding: '12px 0', borderBottom: '1px solid var(--line)', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ width: 92, fontWeight: 600, fontSize: '0.88rem' }}>{a.assistant}</span>
          {a.named ? <Pill tone="green">Named you</Pill> : <Pill tone="red">Did not name you</Pill>}
          <p className="muted small" style={{ flex: 1, lineHeight: 1.55 }}>{a.answer}</p>
        </div>
      ))}
    </Pane>
  )
}

function SearchVisibility() {
  return (
    <div className="stack" style={{ gap: 18 }}>
      <ReportHeader title="Search visibility" lede="Understand the searches that bring people to your business." />

      <Pane
        title="Search Console"
        sub="Read every night from your connected property"
        actions={<Pill tone="green">Connected</Pill>}
      >
        <div className="grid2">
          <Metric label="Impressions" value="1,840" sub="last 7 days · was 1,210" />
          <Metric label="Clicks" value="96" sub="was 61" />
        </div>
        <hr className="sep" />
        <div className="grid2">
          <Sparkline label="Search impressions" values={IMPRESSIONS} color="var(--accent)" />
          <Sparkline label="Clicks to your site" values={CLICKS_BY_DAY} color="var(--green)" />
        </div>
      </Pane>

      <RankingsPane />
      <AiAnswersPane />
    </div>
  )
}

/* ---------- seo health ---------- */
const ISSUES = [
  { tone: 'red', label: 'Fix', text: 'Contact form has no phone field — half your inquiries mention calling.' },
  { tone: 'yellow', label: 'Slow', text: '2 images on /hail-guide load slowly (1.8s).' },
  { tone: 'grey', label: 'Missing', text: 'Meta description on /about.' },
]

function SeoHealth() {
  return (
    <div className="stack" style={{ gap: 18 }}>
      <ReportHeader title="SEO health" lede="Review the issues that could make your pages harder to find or understand." />

      <div className="grid2">
        <Metric label="Mobile performance" value="84" sub="was 79 last week" />
        <Metric label="Desktop performance" value="96" sub="was 94 last week" />
      </div>

      <Pane title="Issues" sub="Checked this week across your five key pages">
        {ISSUES.map((it) => (
          <div key={it.text} className="row" style={{ padding: '12px 0', borderBottom: '1px solid var(--line)', gap: 12, alignItems: 'flex-start' }}>
            <Pill tone={it.tone}>{it.label}</Pill>
            <p className="small" style={{ flex: 1, lineHeight: 1.55 }}>{it.text}</p>
          </div>
        ))}
        <p className="muted small" style={{ marginTop: 12 }}>A pull request is drafted for the first fix.</p>
      </Pane>
    </div>
  )
}

/* ---------- page ---------- */
export default function Reports() {
  const { slug } = useParams()

  if (slug === 'search-visibility') return <SearchVisibility />
  if (slug === 'seo-health') return <SeoHealth />

  return (
    <div className="stack" style={{ gap: 18 }}>
      <ReportHeader title="Reports" lede="The reports Foxglove keeps for your business." />
      <EmptyState title="This page is not here." body="The link may be old or mistyped." />
    </div>
  )
}
