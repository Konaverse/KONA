import '@/app/(v4)/services/scenes.css'
/**
 * THE SCENES — a service, drawn in code (2026-09-17). Lifted out of
 * HubBench.tsx unchanged so two pages can show one object: the hub's
 * bento plays a scene inside each card, and the service page's hero
 * (RunBrief.tsx) shows the same scene enlarged as the agent's artboard —
 * the card you clicked becomes the page. Markup only; scenes.css draws
 * and moves them, keyed on an ancestor's `is-hot` / `is-seen`.
 * Decoration: the host marks it aria-hidden.
 */

/** which scene a service gets */
export const SCENE: Record<string, string> = {
  'web-design': 'design',
  'web-development': 'dev',
  '3d-websites': 'three',
  'one-page-websites': 'one',
  'website-redesign': 're',
  seo: 'seo',
}

export default function ServiceScene({ kind }: { kind: string }) {
  switch (kind) {
    case 'design':
      return (
        <div className="hv hv-design">
          <span className="hv-frame-l">Home — 1440</span>
          <div className="hv-board">
            <i className="hv-b hv-b1" />
            <i className="hv-b hv-b2"><u /><u /></i>
            <i className="hv-b hv-b3" />
            <i className="hv-b hv-b4" />
            <i className="hv-b hv-b5" />
            <span className="hv-cur">
              <svg viewBox="0 0 24 24"><path d="M4 2.5l15.5 8.2-6.6 1.9-2.6 6.6z" /></svg>
              <b>Kona</b>
            </span>
          </div>
        </div>
      )
    case 'dev':
      return (
        <div className="hv hv-dev">
          <div className="hv-win">
            <span className="hv-bar"><i /><i /><i /></span>
            <div className="hv-code">
              {[
                [18, 34],
                [10, 26, 40],
                [22, 16],
                [10, 44, 12],
                [30, 20],
                [10, 18, 30],
                [14],
              ].map((ln, l) => (
                <span key={l} className="hv-ln" style={{ '--l': l, '--in': l > 0 && l < 6 ? 1 : 0 } as React.CSSProperties}>
                  {ln.map((w, j) => (
                    <i key={j} style={{ width: `${w}%` }} />
                  ))}
                </span>
              ))}
            </div>
          </div>
          <span className="hv-pill"><i />Build passed · 0.8 s</span>
        </div>
      )
    case 'three':
      return (
        <div className="hv hv-three">
          <div className="hv-tilt">
            <div className="hv-cube">
              <i /><i /><i /><i /><i /><i />
              <div className="hv-core"><i /><i /><i /><i /><i /><i /></div>
            </div>
          </div>
          <span className="hv-floor" />
        </div>
      )
    case 'one':
      return (
        <div className="hv hv-one">
          <div className="hv-tall">
            <div className="hv-strip">
              <i className="hv-s hv-s1"><u /><u /></i>
              <i className="hv-s hv-s2" />
              <i className="hv-s hv-s3"><u /><u /><u /></i>
              <i className="hv-s hv-s4" />
              <i className="hv-s hv-s5"><u /></i>
            </div>
          </div>
          <span className="hv-rail"><i /></span>
        </div>
      )
    case 're':
      return (
        <div className="hv hv-re">
          <div className="hv-after">
            <i className="hv-a1" /><i className="hv-a2" /><i className="hv-a3" /><i className="hv-a4" />
          </div>
          <div className="hv-before">
            {Array.from({ length: 14 }).map((_, j) => (
              <i key={j} style={{ '--j': j } as React.CSSProperties} />
            ))}
          </div>
          <span className="hv-div"><i /></span>
          <b className="hv-lab hv-lab-b">Before</b>
          <b className="hv-lab hv-lab-a">After</b>
        </div>
      )
    default:
      return (
        <div className="hv hv-seo">
          <div className="hv-serp">
            <span className="hv-q"><i />web design cyprus</span>
            {[0, 1, 2, 3].map((r) => (
              <span key={r} className={`hv-r${r === 3 ? ' hv-you' : ''}`} style={{ '--r': r } as React.CSSProperties}>
                <i /><u /><u />
                {r === 3 ? <b>You</b> : null}
              </span>
            ))}
          </div>
          <div className="hv-rank">
            <span className="hv-rank-n"><b>#4</b><b>#1</b></span>
            <svg viewBox="0 0 120 60" aria-hidden="true">
              <path d="M2 54C24 52 34 44 48 40S72 30 84 18 104 8 118 4" />
            </svg>
          </div>
        </div>
      )
  }
}
