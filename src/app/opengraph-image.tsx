import { DATA } from "@/data/resume";
import { SITE_URL } from "@/lib/site";
import { ImageResponse } from "next/og";

export const alt = `${DATA.name} — ${DATA.description}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BLUEPRINT = "#7083ff";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#08090a",
          color: "#fafafa",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            height: "20px",
            width: "100%",
            border: "1px solid rgba(250, 250, 250, 0.3)",
            backgroundImage: `linear-gradient(135deg, ${BLUEPRINT} 25%, transparent 25%, transparent 50%, ${BLUEPRINT} 50%, ${BLUEPRINT} 75%, transparent 75%, transparent)`,
            backgroundSize: "16px 16px",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-2px" }}>
            {`I'M ${DATA.name.split(" ")[0].toUpperCase()}.`}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 32,
              letterSpacing: "6px",
              color: BLUEPRINT,
            }}
          >
            {`[ ${DATA.description.toUpperCase()} ]`}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            letterSpacing: "2px",
            color: "rgba(250, 250, 250, 0.6)",
          }}
        >
          <span>{SITE_URL.replace("https://", "").toUpperCase()}</span>
          <span>{DATA.location.toUpperCase()}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
