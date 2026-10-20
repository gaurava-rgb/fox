import { Link } from 'react-router-dom'

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
    foxglove: ['✳', ''], site: ['⌂', ''], repo: ['⌥', ''],
  }
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
      <p className="small" style={{ color: 'var(--yellow)' }}>🔒 {children}</p>
    </div>
  )
}
