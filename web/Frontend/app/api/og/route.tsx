import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const colorsParam = searchParams.get("colors")

    if (!colorsParam) {
      return new ImageResponse(
        (
          <div
            style={{
              display: "flex",
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              backgroundImage: "linear-gradient(to bottom right, #0f172a, #000000)",
              letterSpacing: "-.02em",
              fontWeight: 700,
              color: "white",
            }}
          >
            <div style={{ display: "flex", fontSize: 60 }}>CROMATIK</div>
            <div style={{ display: "flex", fontSize: 30, color: "#94a3b8", marginTop: 20 }}>
              Laboratorio Visual de Bolsillo
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      )
    }

    const hexes = colorsParam.split("-").map((h) => `#${h}`)
    const primaryHex = hexes[0] || "#ffffff"

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            flexDirection: "column",
            backgroundColor: "#000",
          }}
        >
          {/* Main Color Stripes */}
          <div style={{ display: "flex", flexDirection: "row", height: "80%", width: "100%" }}>
            {hexes.map((hex, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flex: 1,
                  height: "100%",
                  backgroundColor: hex,
                }}
              />
            ))}
          </div>

          {/* Footer branding */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: "20%",
              width: "100%",
              backgroundColor: "#ffffff",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 60px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: primaryHex,
                  marginRight: 20,
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <div style={{ display: "flex", fontSize: 40, fontWeight: 800, color: "#0f172a" }}>
                CROMATIK
              </div>
            </div>
            
            <div style={{ display: "flex", fontSize: 24, color: "#64748b", fontWeight: 500 }}>
              Paleta de Color Generada
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    return new Response("Failed to generate image", { status: 500 })
  }
}
