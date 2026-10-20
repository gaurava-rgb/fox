import { Link, NavLink, Outlet } from 'react-router-dom'
import { Btn } from '../ui/index.jsx'

export default function MarketingLayout() {
  const nav = [
    { to: '/', label: 'Founders' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
  ]
  return (
    <div className="mk">
      <header style={{ borderBottom: '1px solid var(--line)', background: 'rgba(251,250,255,0.9)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="wrap row row--between" style={{ height: 64 }}>
          <Link to="/" className="row" style={{ gap: 8 }}>
            <span style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--accent)', color: 'var(--accent-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>F</span>
            <strong style={{ letterSpacing: '-0.01em' }}>Foxglove</strong>
          </Link>
          <nav className="row" style={{ gap: 22 }}>
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => (isActive && n.to !== '/' ? 'link-arrow' : 'muted')} style={{ fontSize: '0.9rem' }}>{n.label}</NavLink>
            ))}
          </nav>
          <div className="row">
            <Btn to="/signin" ghost sm>Sign in</Btn>
            <Btn to="/signin" solid sm>Get started →</Btn>
          </div>
        </div>
      </header>
      <Outlet />
      <footer style={{ borderTop: '1px solid var(--line)', marginTop: 80, padding: '40px 0 28px' }}>
        <div className="wrap">
          <div className="grid2" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 28 }}>
            <div>
              <div className="row" style={{ gap: 8, marginBottom: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: 7, background: 'var(--accent)', color: 'var(--accent-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11 }}>F</span>
                <strong>Foxglove</strong>
              </div>
              <p className="muted small">Be found by the people already searching for you.</p>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: 10 }}>Product</p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 8 }}>
                <li><Link to="/" className="muted small">For founders</Link></li>
                <li><Link to="/pricing" className="muted small">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: 10 }}>Company</p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 8 }}>
                <li><Link to="/about" className="muted small">About</Link></li>
                <li><a href="mailto:hello@foxglove.example" className="muted small">hello@foxglove.example</a></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: 10 }}>Account</p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 8 }}>
                <li><Link to="/signin" className="muted small">Sign in</Link></li>
                <li><Link to="/signin" className="muted small">Get started</Link></li>
              </ul>
            </div>
          </div>
          <p className="faint small" style={{ marginTop: 32 }}>© 2026 Foxglove · A local demonstration clone. Available in the United States, for now.</p>
        </div>
      </footer>
    </div>
  )
}
