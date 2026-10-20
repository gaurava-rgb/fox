import { useEffect, useState } from 'react'
import { getBillingSummary, subscribe, topUp, cancelPlan } from '../mock/api.js'
import { PLAN_TIERS, TOPUP_PACKS, PILOT_MONTH_CREDITS } from '../mock/jobs.js'
import { Eyebrow, Pane, Btn, Chip, Pill, Metric , Spinner } from '../ui/index.jsx'

/* ---------- No plan: the three tier cards ---------- */
function TierCards({ busy, onSubscribe }) {
  return (
    <div className="grid3">
      {Object.entries(PLAN_TIERS).map(([tier, t]) => (
        <div className="pane" key={tier} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="eyebrow">FOXGLOVE {t.name}</div>
          <h3 className="h3" style={{ marginTop: 10 }}>{t.publicName}</h3>
          <div className="row" style={{ gap: 6, margin: '10px 0 2px', alignItems: 'baseline' }}>
            <span className="mono" style={{ fontSize: '2rem', fontWeight: 600 }}>${t.monthlyUsd}</span>
            <span className="faint small">a month</span>
          </div>
          <p className="muted small" style={{ margin: '6px 0 18px' }}>{t.credits.toLocaleString()} credits each month</p>
          {busy === tier ? (
            <Btn solid disabled style={{ marginTop: 'auto' }}><Spinner /> Subscribing…</Btn>
          ) : (
            <Btn solid style={{ marginTop: 'auto' }} onClick={() => onSubscribe(tier)}>Subscribe</Btn>
          )}
        </div>
      ))}
    </div>
  )
}

/* ---------- Page ---------- */
export default function Billing() {
  const [sum, setSum] = useState(null)
  const [busy, setBusy] = useState(null) // 't1'…'t3' | 'top0'…'top2' | 'cancel'

  const refresh = () => getBillingSummary().then(setSum)
  useEffect(() => { refresh() }, [])

  const doSubscribe = async (tier) => {
    if (busy) return
    setBusy(tier)
    await subscribe(tier)
    await refresh()
    setBusy(null)
  }

  const doTopUp = async (idx) => {
    if (busy) return
    setBusy(`top${idx}`)
    await topUp(idx)
    await refresh()
    setBusy(null)
  }

  const doCancel = async () => {
    if (busy) return
    const ok = window.confirm('Cancel your Foxglove plan? Scheduled work pauses, and top-up credits stay.')
    if (!ok) return
    setBusy('cancel')
    await cancelPlan()
    await refresh()
    setBusy(null)
  }

  const sub = sum?.subscription

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="row row--between" style={{ alignItems: 'flex-start' }}>
        <div>
          <Eyebrow>YOUR ACCOUNT</Eyebrow>
          <h1 className="h1">Plan and credits</h1>
          {sum !== null && (
            <p className="lede">
              {sub
                ? `FOXGLOVE ${sub.name} · ${sub.publicName} — $${sub.monthlyUsd} a month, ${sub.credits.toLocaleString()} credits.`
                : 'Choose the Foxglove plan that fits.'}
            </p>
          )}
        </div>
        {sum !== null && (sub
          ? <Pill tone="green">Plan active</Pill>
          : <Pill tone="yellow">No active plan</Pill>)}
      </div>

      {sum === null ? (
        <p className="faint small">Reading your account…</p>
      ) : sub ? (
        <>
          {sum.low && (
            <div className="pane fade-in" style={{ background: 'rgba(233,217,81,0.05)', borderColor: 'rgba(233,217,81,0.25)', padding: 14 }}>
              <div className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
                <Pill tone="yellow">Running low</Pill>
                <p className="small" style={{ color: 'var(--yellow)', lineHeight: 1.55 }}>
                  Your credits are nearly gone. Top up below, or scheduled work pauses at zero.
                </p>
              </div>
            </div>
          )}

          <div className="grid3">
            <Metric label="Plan credits" value={sum.balance.plan.toLocaleString()} sub="Refills on your billing day" />
            <Metric label="Top-up credits" value={sum.balance.topup.toLocaleString()} sub="Never expires" />
            <Metric label="Total" value={sum.balance.total.toLocaleString()} sub="Available to spend now" tone={sum.low ? 'var(--yellow)' : undefined} />
          </div>

          <Pane title="Top-ups" sub="One-time credit packs on top of your plan" actions={<Chip>Refer and earn</Chip>}>
            <div className="grid3">
              {TOPUP_PACKS.map((p, i) => (
                <div className="pane" key={i} style={{ background: 'var(--rail)' }}>
                  <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 600 }}>{p.credits.toLocaleString()} credits</div>
                  <p className="muted small" style={{ margin: '6px 0 14px' }}>${p.usd} one time</p>
                  {busy === `top${i}` ? (
                    <Btn solid disabled><Spinner /> Topping up…</Btn>
                  ) : (
                    <Btn solid onClick={() => doTopUp(i)}>Top up</Btn>
                  )}
                </div>
              ))}
            </div>
          </Pane>

          <div className="row row--between" style={{ alignItems: 'center' }}>
            <p className="faint small">Credits refill on your billing day. Top-ups never expire. Work pauses at zero.</p>
            {busy === 'cancel'
              ? <Btn ghost disabled><Spinner /> Cancelling…</Btn>
              : <Btn ghost onClick={doCancel}>Cancel plan</Btn>}
          </div>
        </>
      ) : (
        <>
          <TierCards busy={busy} onSubscribe={doSubscribe} />
          <p className="muted small">
            Have an invite code? Choose T1, then add it as a promotion code at checkout. It gives two free months with {PILOT_MONTH_CREDITS.toLocaleString()} credits each.
          </p>
          <p className="faint small">Credits refill on your billing day. Top-ups never expire. Work pauses at zero.</p>
        </>
      )}
    </div>
  )
}
