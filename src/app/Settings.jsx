import { store } from '../mock/api.js'
import { Btn, Pane, Eyebrow } from '../ui/index.jsx'
import { Link } from 'react-router-dom'

export default function Settings() {
  return (
    <div className="stack" style={{ maxWidth: 720 }}>
      <Eyebrow>YOUR ACCOUNT</Eyebrow>
      <h1 className="h1">Settings</h1>
      <Pane title="Account" sub="Demo build — changes are not persisted.">
        <p className="muted small" style={{ lineHeight: 1.6 }}>
          Signed in as Dana Whitfield (mock session).<br />
          Business: Pinegrove Roofing &amp; Exteriors · 1 business on this account.
        </p>
      </Pane>
      <Pane title="Danger zone">
        <div className="row">
          <Btn onClick={() => { store.signOut() }} to="/" ghost sm>Sign out</Btn>
        </div>
      </Pane>
    </div>
  )
}
