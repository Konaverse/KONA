const ACCENT = "#6B7F62";

export default function FooterSection() {
  return (
    <footer
      style={{
        position: "relative",
        padding: "6rem 8vw 3rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "#0a0a0c",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "4rem" }}>
        {/* Brand */}
        <div>
          <div style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 200, fontSize: "1.3rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#f0ede8", marginBottom: "1rem" }}>
            Konaverse
          </div>
          <p style={{ fontSize: "0.82rem", fontWeight: 300, color: "rgba(240,237,232,0.45)", lineHeight: 1.7, maxWidth: 280, fontFamily: "var(--font-jakarta), sans-serif" }}>
            A creative studio at the intersection of design, code, and cinema. Based everywhere work takes us.
          </p>
        </div>

        {/* Services */}
        <div>
          <h4 style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#f0ede8", marginBottom: "1.5rem", fontFamily: "var(--font-jakarta), sans-serif" }}>
            Services
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {["Web Design", "Web Development", "Videography", "Video Editing", "Brand Identity"].map((l) => (
              <li key={l}>
                <a href="#" style={{ fontSize: "0.82rem", fontWeight: 300, color: "rgba(240,237,232,0.45)", textDecoration: "none", fontFamily: "var(--font-jakarta), sans-serif" }}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Studio */}
        <div>
          <h4 style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#f0ede8", marginBottom: "1.5rem", fontFamily: "var(--font-jakarta), sans-serif" }}>
            Studio
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {["About", "Work", "Process", "Contact"].map((l) => (
              <li key={l}>
                <a href="#" style={{ fontSize: "0.82rem", fontWeight: 300, color: "rgba(240,237,232,0.45)", textDecoration: "none", fontFamily: "var(--font-jakarta), sans-serif" }}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#f0ede8", marginBottom: "1.5rem", fontFamily: "var(--font-jakarta), sans-serif" }}>
            Connect
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {["hello@konaverse.com", "Instagram", "Vimeo", "LinkedIn"].map((l) => (
              <li key={l}>
                <a href="#" style={{ fontSize: "0.82rem", fontWeight: 300, color: "rgba(240,237,232,0.45)", textDecoration: "none", fontFamily: "var(--font-jakarta), sans-serif" }}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em", fontFamily: "var(--font-jakarta), sans-serif" }}>
          &copy; 2026 Konaverse. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["IG", "VM", "LI", "X"].map((s) => (
            <a
              key={s}
              href="#"
              style={{ fontSize: "0.7rem", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,237,232,0.45)", textDecoration: "none", fontFamily: "var(--font-jakarta), sans-serif" }}
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
