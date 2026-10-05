import { ImageResponse } from "next/og";

export const alt = "SIGNOVA: Architectural & illuminated signage, London";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "radial-gradient(circle at 70% 40%, #12305e 0%, #060708 55%)", color: "#f3f4f6", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 12 }}>SIGNOVA</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, fontWeight: 700, lineHeight: 0.95, letterSpacing: -3 }}>
          <span>SIGNAGE THAT</span>
          <span>DEFINES YOUR</span>
          <span style={{ color: "#9cc4ff" }}>SPACE.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#8a9099", letterSpacing: 4 }}>
          <span>WE BUILD WHAT GETS NOTICED.</span>
          <span>LONDON</span>
        </div>
      </div>
    ),
    size,
  );
}
