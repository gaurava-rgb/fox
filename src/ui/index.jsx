import { Link } from 'react-router-dom'

/* Small inline SVG icon set (Lucide-style, 24x24 viewBox) — no emoji in UI. */
const I = (props) => (
  <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" style={{ flex: 'none' }}>{props.children}</svg>
)
export const Icons = {
  flower: (p) => <I {...p}><path d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" /><path d="M12 9v13" /><path d="M12 22c-4.2 0-7-1.7-7-4l7-4" /></I>,
  home: (p) => <I {...p}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1Z" /></I>,
  repo: (p) => <I {...p}><path d="M4 20h16" /><path d="M6 20V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14" /><path d="M10 8h4" /><circle cx="9.5" cy="12.5" r=".5" /><circle cx="9.5" cy="16.5" r=".5" /><circle cx="14.5" cy="16.5" r=".5" /></I>,
  lock: (p) => <I {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></I>,
}
export function Spinner() { return <span className="spinner" aria-label="Loading" role="status" /> }

export function Eyebrow({ children }) {
  return <div className="eyebrow">{children}</div>
}

export function Pane({ title, sub, actions, children, pad = true, style }) {
  return (
    <section className="pane" style={{ ...style, padding: pad ? 20 : 0 }}>
      {(title || actions) && (
        <div className="row row--between" style={{ marginBottom: sub ? 4 : 12 }}>
          <div>
            {title && <h3 className="h3">{title}</h3>}
            {sub && <p className="muted small" style={{ marginTop: 4 }}>{sub}</p>}
          </div>
          {actions && <div className="row">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

export function Btn({ to, href, onClick, children, solid, ghost, sm, disabled, ...rest }) {
  const cls = `btn ${solid ? 'btn--solid' : ''} ${ghost ? 'btn--ghost' : ''} ${sm ? 'btn--sm' : ''}`
  if (to) return <Link className={cls} to={to} {...rest}>{children}</Link>
  if (href) return <a className={cls} href={href} {...rest}>{children}</a>
  return <button className={cls} onClick={onClick} disabled={disabled} {...rest}>{children}</button>
}

export function Chip({ children, solid, on }) {
  return <span className={`chip ${solid ? 'chip--solid' : ''} ${on ? 'chip--on' : ''}`}>{children}</span>
}

export function Pill({ tone = 'grey', children }) {
  return <span className={`pill pill--${tone}`}><span className="dot" />{children}</span>
}

export function StatusPill({ tone, children }) {
  return <span className={`pill pill--${tone}`}>{children}</span>
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="empty">
      <h4>{title}</h4>
      {body && <p>{body}</p>}
      {action}
    </div>
  )
}

export function SourceBadge({ src }) {
  const map = {
    reddit: ['R', 'src--r'], linkedin: ['L', 'src--l'], facebook: ['f', 'src--f'],
    x: ['X', 'src--x'], google: ['G', 'src--g'], forums: ['Fg', 'src--fg'],
  }
  if (src === 'foxglove') return <span className="src"><Icons.flower size={14} /></span>
  if (src === 'site') return <span className="src"><Icons.home size={14} /></span>
  if (src === 'repo') return <span className="src"><Icons.repo size={14} /></span>
  const [letter, cls] = map[src] || ['?', '']
  return <span className={`src ${cls}`} aria-hidden>{letter}</span>
}

export function Tabs({ tabs, current, onChange }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={`tab ${current === t.key ? 'tab--on' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

export function Metric({ label, value, sub, tone }) {
  return (
    <div className="pane" style={{ padding: 16 }}>
      <div className="eyebrow">{label}</div>
      <div className="mono" style={{ fontSize: '1.7rem', fontWeight: 600, margin: '8px 0 4px', color: tone || 'inherit' }}>
        {value}
      </div>
      {sub && <div className="muted small">{sub}</div>}
    </div>
  )
}

export function LockNote({ children }) {
  return (
    <div className="pane" style={{ padding: 14, background: 'rgba(233,217,81,0.05)', borderColor: 'rgba(233,217,81,0.25)' }}>
      <p className="small" style={{ color: 'var(--yellow)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icons.lock size={13} /> {children}
        </p>
    </div>
  )
}
