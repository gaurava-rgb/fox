import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { store } from '../mock/api.js'
import { Wordmark, Mark, Icons } from '../ui/index.jsx'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const nav = useNavigate()
  const go = (e) => {
    e.preventDefault()
    store.signIn()
    nav('/projects/demo/summary')
  }

  return (
    <div className="auth mk">
      {/* ---------- plum plate ---------- */}
      <aside className="auth__plate">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="row" style={{ gap: 9 }}>
            <Mark size={17} />
            <span className="wordmark" style={{ fontSize: '0.95rem' }}>Foxglove</span>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow" style={{ marginBottom: 16, color: 'rgba(247,237,243,0.5)' }}>
            Est. 2026 — United States
          </p>
          <p className="auth__quote">
            Someone is asking for what you sell right now.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="small" style={{ color: 'rgba(247,237,243,0.62)', maxWidth: '34ch', lineHeight: 1.6 }}>
            Foxglove reads the conversations, searches, and AI answers where your buyers look for
            help, then drafts the reply.
          </p>
        </div>
      </aside>

      {/* ---------- paper form ---------- */}
      <main className="auth__form">
        <div className="auth__card">
          <div className="eyebrow">Welcome back</div>
          <h1 style={{ fontSize: '2.15rem', margin: '12px 0 8px' }}>
            Sign in to Foxglove
          </h1>
          <p className="muted small" style={{ marginBottom: 24 }}>
            Demo build — any email works. No auth backend.
          </p>

          <form className="stack" onSubmit={go} style={{ gap: 12 }}>
            <button
              className="btn btn--ghost"
              type="button"
              style={{ justifyContent: 'center', gap: 9 }}
            >
              <Icons.bloom size={13} />
              Continue with Google (mock)
            </button>

            <div className="row" style={{ gap: 12 }}>
              <hr className="rule" style={{ flex: 1 }} />
              <span className="eyebrow" style={{ letterSpacing: '0.16em' }}>or</span>
              <hr className="rule" style={{ flex: 1 }} />
            </div>

            <label className="eyebrow" htmlFor="email" style={{ marginBottom: -4 }}>
              Email address
            </label>
            <input
              id="email"
              className="field"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="eyebrow" htmlFor="password" style={{ marginBottom: -4 }}>
              Password
            </label>
            <input id="password" className="field" type="password" placeholder="••••••••" />

            <button className="btn btn--solid" style={{ justifyContent: 'center', marginTop: 6 }}>
              Continue
              <Icons.arrow size={14} />
            </button>
          </form>

          <p className="muted small" style={{ marginTop: 20 }}>
            New here?{' '}
            <Link to="/signin" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Create an account
            </Link>
          </p>

          <div className="row" style={{ gap: 8, marginTop: 22, flexWrap: 'wrap' }}>
            <Link to="/" className="link-arrow small">Back to site</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
