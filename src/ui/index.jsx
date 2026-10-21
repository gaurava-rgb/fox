import { Link } from 'react-router-dom'

/* ---------------------------------------------------------------------------
   Icon set — 24x24, hairline strokes (1.5) to match the printed/editorial feel.
   No emoji, no filled glyphs.
   ------------------------------------------------------------------------- */
const I = (props) => (
  <svg
    width={props.size || 16}
    height={props.size || 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={props.weight || 1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ flex: 'none', ...props.style }}
  >
    {props.children}
  </svg>
)

export const Icons = {
  /* Foxglove mark — a six-ray bloom on a stem. Deliberately geometric so it
     still reads at 14–16px in a nav bar. */
  flower: (p) => (
    <I {...p} weight={p.weight || 1.5}>
      <path d="M12 2.6v11.2" />
      <path d="M6.9 4.8 17.1 11.6" />
      <path d="M17.1 4.8 6.9 11.6" />
      <path d="M12 13.8V21.4" />
    </I>
  ),

  /* Six-ray asterisk bloom — the pure ornament, no stem. */
  bloom: (p) => (
    <I {...p} weight={p.weight || 1.8}>
      <path d="M12 2.4v19.2" />
      <path d="M3.7 7.2l16.6 9.6" />
      <path d="M20.3 7.2 3.7 16.8" />
    </I>
  ),

  home: (p) => (
    <I {...p}>
      <path d="m3 10.5 9-7.5 9 7.5V20a1 1 0 0 1-1 1h-5v-6.5H9V21H4a1 1 0 0 1-1-1Z" />
    </I>
  ),
  doc: (p) => (
    <I {...p}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </I>
  ),
  plug: (p) => (
    <I {...p}>
      <path d="M9 3v6M15 3v6" />
      <path d="M6 9h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6Z" />
      <path d="M12 18v3" />
    </I>
  ),
  graph: (p) => (
    <I {...p}>
      <circle cx="6" cy="17" r="2.4" />
      <circle cx="17.5" cy="15" r="2.4" />
      <circle cx="12" cy="5.5" r="2.4" />
      <path d="m7.6 14.9 3.1-6.3M10.4 6.9l5.4 6.6M8.4 17.4h6.7" />
    </I>
  ),
  flow: (p) => (
    <I {...p}>
      <rect x="3" y="3" width="7" height="6" rx="1.6" />
      <rect x="14" y="15" width="7" height="6" rx="1.6" />
      <path d="M6.5 9v6a3 3 0 0 0 3 3H14" />
    </I>
  ),
  chart: (p) => (
    <I {...p}>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M8 16v-4M13 16V8M18 16v-6" />
    </I>
  ),
  card: (p) => (
    <I {...p}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 14.5h3" />
    </I>
  ),
  settings: (p) => (
    <I {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3" />
    </I>
  ),
  bell: (p) => (
    <I {...p}>
      <path d="M6 8.5a6 6 0 0 1 12 0c0 6.5 2.5 8 2.5 8h-17S6 15 6 8.5" />
      <path d="M10.3 20.5a1.9 1.9 0 0 0 3.4 0" />
    </I>
  ),
  chevron: ({ up, ...p }) => (
    <I {...p} weight={2} style={{ transform: up ? 'rotate(180deg)' : 'none' }}>
      <path d="m6 9 6 6 6-6" />
    </I>
  ),
  lock: (p) => (
    <I {...p}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </I>
  ),
  copy: (p) => (
    <I {...p}>
      <rect x="9" y="9" width="11.5" height="11.5" rx="2" />
      <path d="M15 5.5A1.5 1.5 0 0 0 13.5 4H5.5A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15" />
    </I>
  ),
  check: (p) => <I {...p} weight={2.2}><path d="m4.5 12.5 5 5 10-11" /></I>,
  arrow: (p) => <I {...p} weight={1.8}><path d="M4 12h15M13 6l6 6-6 6" /></I>,
  plus: (p) => <I {...p} weight={2}><path d="M12 5v14M5 12h14" /></I>,
  search: (p) => (
    <I {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </I>
  ),
}

export function Spinner() {
  return <span className="spinner" aria-label="Loading" role="status" />
}

/* ---------------------------------------------------------------------------
   Brand
   ------------------------------------------------------------------------- */

export function Mark({ size = 18 }) {
  return (
    <span className="mark">
      <Icons.flower size={size} weight={1.5} />
    </span>
  )
}

export function Wordmark({ to = '/', showMark = true, size = 1 }) {
  return (
    <Link to={to} className="row" style={{ gap: 9 }} aria-label="Foxglove — home">
      {showMark && <Mark size={17 * size} />}
      <span className="wordmark" style={{ fontSize: `${1.02 * size}rem` }}>
        Foxglove
      </span>
    </Link>
  )
}

/* ---------------------------------------------------------------------------
   Typography helpers
   ------------------------------------------------------------------------- */

export function Eyebrow({ children, index }) {
  return (
    <div className="eyebrow row" style={{ gap: 10 }}>
      {index && <span className="num">{index}</span>}
      {index && <span style={{ opacity: 0.4 }}>—</span>}
      <span>{children}</span>
    </div>
  )
}

/* A printed hairline divider, optionally carrying a label. */
export function Rule({ children }) {
  if (!children) return <hr className="rule" />
  return <div className="rule rule--labelled"><span className="eyebrow">{children}</span></div>
}

/* ---------------------------------------------------------------------------
   Surfaces & controls
   ------------------------------------------------------------------------- */

export function Pane({ title, sub, actions, children, pad = true, feature, quiet, style, ...rest }) {
  const cls = `pane${feature ? ' pane--feature' : ''}${quiet ? ' pane--quiet' : ''}`
  return (
    <section className={cls} style={{ ...style, padding: pad ? 20 : 0 }} {...rest}>
      {(title || actions) && (
        <div className="row row--between" style={{ marginBottom: sub ? 4 : 12, alignItems: 'flex-start' }}>
          <div style={{ minWidth: 0 }}>
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

export function Btn({ to, href, onClick, children, solid, ghost, sm, disabled, icon, ...rest }) {
  const cls = `btn${solid ? ' btn--solid' : ''}${ghost ? ' btn--ghost' : ''}${sm ? ' btn--sm' : ''}`
  const inner = (
    <>
      {children}
      {icon}
    </>
  )
  if (to) return <Link className={cls} to={to} {...rest}>{inner}</Link>
  if (href) return <a className={cls} href={href} {...rest}>{inner}</a>
  return <button className={cls} onClick={onClick} disabled={disabled} {...rest}>{inner}</button>
}

export function Chip({ children, solid, on, ...rest }) {
  return (
    <span className={`chip${solid ? ' chip--solid' : ''}${on ? ' chip--on' : ''}`} {...rest}>
      {children}
    </span>
  )
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

/* ---------------------------------------------------------------------------
   Source monograms — serif initials in a hairline stamp, not brand-coloured tiles
   ------------------------------------------------------------------------- */

export function SourceBadge({ src }) {
  const map = {
    reddit: ['R', 'src--r'],
    linkedin: ['L', 'src--l'],
    facebook: ['F', 'src--f'],
    x: ['X', 'src--x'],
    google: ['G', 'src--g'],
    forums: ['fg', 'src--fg'],
  }
  if (src === 'foxglove') return <span className="src"><Icons.flower size={13} /></span>
  if (src === 'site') return <span className="src"><Icons.home size={13} /></span>
  if (src === 'repo') return <span className="src"><Icons.doc size={13} /></span>
  const [letter, cls] = map[src] || ['?', '']
  return <span className={`src ${cls}`} aria-hidden>{letter}</span>
}

export function Tabs({ tabs, current, onChange }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={`tab${current === t.key ? ' tab--on' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/* A spec-sheet figure: mono label, large tabular value, quiet delta. */
export function Metric({ label, value, sub, tone }) {
  return (
    <div className="pane" style={{ padding: 16 }}>
      <div className="eyebrow">{label}</div>
      <div
        className="mono"
        style={{
          fontSize: '1.75rem',
          fontWeight: 500,
          letterSpacing: '-0.03em',
          margin: '10px 0 4px',
          color: tone || 'inherit',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && <div className="muted small">{sub}</div>}
    </div>
  )
}

export function LockNote({ children }) {
  return (
    <div
      className="pane"
      style={{
        padding: 14,
        background: 'color-mix(in srgb, var(--yellow) 7%, transparent)',
        borderColor: 'color-mix(in srgb, var(--yellow) 30%, transparent)',
      }}
    >
      <p className="small" style={{ color: 'var(--yellow)', display: 'flex', alignItems: 'center', gap: 7 }}>
        <Icons.lock size={13} /> {children}
      </p>
    </div>
  )
}
