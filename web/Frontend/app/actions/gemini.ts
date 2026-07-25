"use server"

// ─────────────────────────────────────────────
// Motor de IA usando OpenRouter
// Lista verificada de modelos gratuitos (consultada en tiempo real).
// Si el primero falla, prueba el siguiente automáticamente.
// ─────────────────────────────────────────────
const FREE_MODELS = [
  "openai/gpt-oss-20b:free",
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "nvidia/nemotron-nano-9b-v2:free",
]
const API_URL = "https://openrouter.ai/api/v1/chat/completions"

async function callModel(apiKey: string, model: string, prompt: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://cromatic.app",
      "X-Title": "Cromatic - Naming Tool",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = (err as any)?.error?.message || res.statusText
    throw Object.assign(new Error(msg), { status: res.status })
  }

  const data = await res.json() as any
  return data.choices?.[0]?.message?.content ?? ""
}

async function callAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey || apiKey.includes("PEGA-TU-KEY")) {
    throw new Error("OPENROUTER_API_KEY no configurada. Ve a openrouter.ai y pega tu clave en el .env")
  }

  for (const model of FREE_MODELS) {
    try {
      console.log(`[IA] Intentando con modelo: ${model}`)
      const result = await callModel(apiKey, model, prompt)
      console.log(`[IA] Éxito con: ${model}`)
      return result
    } catch (err: any) {
      const isUnavailable = err?.message?.includes("unavailable for free") || err?.message?.includes("No endpoints found")
      if (isUnavailable) {
        console.warn(`[IA] Modelo no disponible: ${model}. Probando siguiente...`)
        continue
      }
      // Si el error es diferente (ej: 429 cuota), lanzar directo
      throw err
    }
  }

  throw new Error("Ningún modelo gratuito está disponible ahora mismo. Intenta más tarde.")
}


export async function generateNameIdeas(focus: string): Promise<string[]> {
  const prompt = `Eres un experto en branding y creación de nombres de empresas (Naming).
Un cliente te ha dado la siguiente descripción de su empresa o proyecto:
"${focus}"

Tu tarea es generar exactamente 5 ideas de nombres creativos, memorables y adecuados para este enfoque. 
Responde ÚNICAMENTE con un array de strings en formato JSON, sin markdown, sin explicaciones. 
Ejemplo: ["Nombre1", "Nombre2", "Nombre3", "Nombre4", "Nombre5"]`

  try {
    const text = await callAI(prompt)
    const cleaned = text.trim().replace(/```json/g, "").replace(/```/g, "").trim()
    const match = cleaned.match(/\[.*\]/s)
    if (!match) throw new Error("Respuesta inesperada del modelo")
    return JSON.parse(match[0]) as string[]
  } catch (error: any) {
    console.error("Error generando nombres:", error?.message)
    if (error?.status === 429) return ["⏳ Límite momentáneo. Espera unos segundos e intenta de nuevo."]
    if (error?.message?.includes("OPENROUTER_API_KEY")) return ["⚙️ Configura tu OPENROUTER_API_KEY en el archivo .env"]
    return [`❌ Error: ${error.message || "Problema de conexión con la IA"}`]
  }
}

export async function getFontAdviceAI(
  focus: string,
  fontName: string,
  fontStyle: string
): Promise<{ isGood: boolean; advice: string }> {
  const prompt = `Eres un Director de Arte experto en diseño de marcas y tipografía.
Un cliente está creando la identidad visual para su empresa:
"${focus}"

Ha elegido la tipografía "${fontName}" (familia: ${fontStyle}).

Evalúa si esa tipografía transmite las emociones correctas para este negocio.
Responde ÚNICAMENTE con un objeto JSON válido, sin markdown:
{
  "isGood": true o false,
  "advice": "consejo de 2-3 párrafos cortos"
}`

  try {
    const text = await callAI(prompt)
    const cleaned = text.trim().replace(/```json/g, "").replace(/```/g, "").trim()
    const match = cleaned.match(/\{[\s\S]*\}/s)
    if (!match) throw new Error("Respuesta inesperada del modelo")
    return JSON.parse(match[0]) as { isGood: boolean; advice: string }
  } catch (error: any) {
    console.error("Error en asesor tipográfico:", error?.message)
    if (error?.status === 429) {
      return { isGood: false, advice: "⏳ El asesor está ocupado. Espera unos segundos e intenta de nuevo." }
    }
    if (error?.message?.includes("OPENROUTER_API_KEY")) {
      return { isGood: true, advice: "⚙️ Configura tu OPENROUTER_API_KEY en el archivo .env para activar el asesor." }
    }
    return { isGood: true, advice: `Error técnico: ${error.message || "Falla de conexión"}. Si te gusta la fuente, ¡adelante!` }
  }
}
