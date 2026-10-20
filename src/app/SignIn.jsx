import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { store } from '../mock/api.js'
import { Btn } from '../ui/index.jsx'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const nav = useNavigate()
  const go = (e) => { e.preventDefault(); store.signIn(); nav('/projects/demo/summary') }
  return (
    <div className="app" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <div className="pane" style={{ width: 380, padding: 28 }}>
        <div className="row" style={{ gap: 8, marginBottom: 18 }}>
          <span style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--accent)', color: 'var(--accent-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>F</span>
          <strong>Foxglove</strong>
        </div>
        <div className="eyebrow">Welcome back</div>
        <h2 className="h2" style={{ margin: '6px 0 4px' }}>Sign in to Foxglove</h2>
        <p className="muted small" style={{ marginBottom: 18 }}>Demo build — any email works. No auth backend.</p>
        <form className="stack" onSubmit={go} style={{ gap: 10 }}>
          <button className="btn btn--ghost" type="button" style={{ justifyContent: 'center' }}>Continue with Google (mock)</button>
          <div className="row" style={{ gap: 10 }}><hr className="sep" style={{ flex: 1, margin: 0 }} /><span className="faint small">or</span><hr className="sep" style={{ flex: 1, margin: 0 }} /></div>
          <input className="field" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="field" type="password" placeholder="Password" />
          <button className="btn btn--solid" style={{ justifyContent: 'center' }}>Continue</button>
        </form>
        <p className="muted small" style={{ marginTop: 16 }}>New here? <Link to="/signin" style={{ color: 'var(--accent)' }}>Create an account</Link> · <Link to="/" className="faint">Back to site</Link></p>
      </div>
    </div>
  )
}
