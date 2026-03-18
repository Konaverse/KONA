"use client";

import { Globe } from "@/components/ui/globe";

export default function TestGlobePage() {
  return (
    <div style={{ background: "#000", width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 600, height: 600, border: "2px solid red" }}>
        <Globe />
      </div>
    </div>
  );
}
