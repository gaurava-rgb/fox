import { Link, NavLink, Outlet } from 'react-router-dom'
import { Btn, Wordmark, Mark } from '../ui/index.jsx'

export default function MarketingLayout() {
  const nav = [
    { to: '/', label: 'Founders' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
  ]
  return (
    <div className="mk">
      <header
        style={{
          borderBottom: '1px solid var(--line)',
          background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div className="wrap row row--between" style={{ height: 68 }}>
          <Wordmark size={0.95} />

          <nav className="row mk-nav" style={{ gap: 30 }}>
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) => (isActive && n.to !== '/' ? '' : 'muted')}
                style={({ isActive }) => ({
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '-0.005em',
                  color: isActive && n.to !== '/' ? 'var(--ink)' : undefined,
                  boxShadow: isActive && n.to !== '/' ? 'inset 0 -1.5px 0 var(--accent)' : undefined,
                  paddingBottom: 2,
                })}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="row" style={{ gap: 10 }}>
            <Btn to="/signin" ghost sm>Sign in</Btn>
            <Btn to="/signin" solid sm>Get started</Btn>
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="mk-foot">
        <div className="wrap">
          <div className="grid2 foot-grid" style={{ gridTemplateColumns: '2.2fr 1fr 1fr 1fr', gap: 32 }}>
            <div>
              <div style={{ marginBottom: 12 }}>
                <Wordmark size={0.9} />
              </div>
              <p className="muted small" style={{ maxWidth: '30ch' }}>
                Be found by the people already searching for you.
              </p>
            </div>

            <div>
              <p className="eyebrow" style={{ marginBottom: 14 }}>Product</p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 10 }}>
                <li><Link to="/" className="muted small">For founders</Link></li>
                <li><Link to="/pricing" className="muted small">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <p className="eyebrow" style={{ marginBottom: 14 }}>Company</p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 10 }}>
                <li><Link to="/about" className="muted small">About</Link></li>
                <li><a href="mailto:hello@foxglove.example" className="muted small">hello@foxglove.example</a></li>
              </ul>
            </div>

            <div>
              <p className="eyebrow" style={{ marginBottom: 14 }}>Account</p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 10 }}>
                <li><Link to="/signin" className="muted small">Sign in</Link></li>
                <li><Link to="/signin" className="muted small">Get started</Link></li>
              </ul>
            </div>
          </div>

          <div
            className="row row--between"
            style={{
              marginTop: 44,
              paddingTop: 20,
              borderTop: '1px solid var(--line)',
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <p className="faint small" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mark size={13} />
              © 2026 Foxglove · A local demonstration clone.
            </p>
            <p className="faint small">Available in the United States, for now.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
