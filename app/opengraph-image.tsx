import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background:
            "linear-gradient(180deg, #fcdbbd 0%, #fabd9e 28%, #78c2c2 46%, #216170 100%)",
          padding: "72px",
          color: "#173a40",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 1, color: "#1f5f64" }}>
          max.mcgee
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, marginTop: 12 }}>
          {site.name}
        </div>
        <div style={{ fontSize: 36, marginTop: 8 }}>{site.role}</div>
        <div
          style={{
            fontSize: 28,
            marginTop: 18,
            maxWidth: 820,
            lineHeight: 1.35,
            fontFamily: "sans-serif",
          }}
        >
          {site.summary}
        </div>
      </div>
    ),
    size
  );
}
