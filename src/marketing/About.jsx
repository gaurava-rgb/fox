import { Btn, Eyebrow } from '../ui/index.jsx'

export default function About() {
  return (
    <main>
      <section className="wrap" style={{ paddingTop: 92, maxWidth: 800 }}>
        <Eyebrow>About</Eyebrow>
        <h1
          className="h1"
          style={{ fontSize: 'clamp(2.1rem, 4.5vw, 2.8rem)', lineHeight: 1.14, letterSpacing: '-0.015em', margin: '16px 0 0' }}
        >
          Named for a flower that stands tall.
        </h1>
        <p className="lede" style={{ marginTop: 26, fontSize: '1.02rem' }}>
          A foxglove is a quiet plant — a single spire of bell-shaped flowers that rises straight
          up over the garden around it, easy to spot and hard to ignore. That is the kind of
          finding we are after: standing where people are already looking, without shouting
          over anyone.
        </p>
        <p className="lede" style={{ marginTop: 16, fontSize: '1.02rem' }}>
          Foxglove exists so that people building something good get found by the people looking
          for it, without becoming full-time marketers.
        </p>
      </section>

      <section className="wrap" style={{ paddingTop: 52, maxWidth: 800 }}>
        <div
          className="pane"
          style={{ padding: 20, background: 'rgba(233,217,81,0.06)', borderColor: 'rgba(160,140,50,0.3)' }}
        >
          <div className="eyebrow" style={{ marginBottom: 8 }}>An honest note</div>
          <p className="muted small" style={{ lineHeight: 1.6 }}>
            This website is a local demonstration clone. It was built from publicly observable
            information — pages, pricing, and posted copy — with no access to any internal
            systems, and it is not affiliated with the product that inspired it.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 56 }}>
        <div className="grid2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div className="pane pane--pad stack" style={{ gap: 8 }}>
            <Eyebrow>Get in touch</Eyebrow>
            <p className="muted small" style={{ lineHeight: 1.6 }}>
              Questions, ideas, or something not working? Write to{' '}
              <a
                href="mailto:hello@foxglove.example"
                style={{ color: 'var(--accent)', fontWeight: 600 }}
              >
                hello@foxglove.example
              </a>
              .
            </p>
          </div>
          <div className="pane pane--pad stack" style={{ gap: 8 }}>
            <Eyebrow>Where we are</Eyebrow>
            <p className="muted small" style={{ lineHeight: 1.6 }}>
              Foxglove is available to businesses in the United States.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 88, textAlign: 'center' }}>
        <h2 className="h1" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)', fontWeight: 300 }}>
          See who is already asking.
        </h2>
        <p className="lede" style={{ margin: '14px auto 26px' }}>
          Tell Foxglove about your business and see what it finds this week.
        </p>
        <Btn to="/signin" solid>Get started</Btn>
      </section>
    </main>
  )
}
