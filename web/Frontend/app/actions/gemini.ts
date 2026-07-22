"use server"

// ─────────────────────────────────────────────
// Configuración de modelos OpenRouter (gratuitos)
// Cambia el modelo aquí si uno falla:
// "google/gemini-2.0-flash-exp:free"
// "meta-llama/llama-3.1-8b-instruct:free"
// "mistralai/mistral-7b-instruct:free"
// "deepseek/deepseek-r1:free"
// ─────────────────────────────────────────────
const OPENROUTER_MODEL = "google/gemini-2.0-flash-exp:free"
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

async function callAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey || apiKey.includes("PEGA-TU-KEY")) {
    throw new Error("OPENROUTER_API_KEY no está configurada. Ve a openrouter.ai, crea una cuenta gratis y pega tu clave en el .env")
  }

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://cromatic.app",
      "X-Title": "Cromatic - Naming Tool",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
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

export async function generateNameIdeas(focus: string): Promise<string[]> {
  const prompt = `Eres un experto en branding y creación de nombres de empresas (Naming).
Un cliente te ha dado la siguiente descripción de su empresa o proyecto:
"${focus}"

Tu tarea es generar exactamente 5 ideas de nombres creativos, memorables y adecuados para este enfoque. 
Responde ÚNICAMENTE con un array de strings en formato JSON, sin markdown, sin explicaciones. 
Ejemplo: ["Nombre1", "Nombre2", "Nombre3", "Nombre4", "Nombre5"]`

  try {
    const text = await callAI(prompt)
    const cleaned = text.trim().replace(/```json/g, "").replace(/```/g, "")
    const ideas = JSON.parse(cleaned)
    return ideas as string[]
  } catch (error: any) {
    console.error("Error generating names:", error?.message)

    if (error?.status === 429) {
      return ["⏳ Límite momentáneo. Espera unos segundos e intenta de nuevo."]
    }
    if (error?.message?.includes("OPENROUTER_API_KEY")) {
      return ["⚙️ Configura tu OPENROUTER_API_KEY en el archivo .env para activar la IA."]
    }
    return [`❌ Error: ${error.message || "Problema de conexión con la IA"}`]
  }
}

export async function getFontAdviceAI(
  focus: string,
  fontName: string,
  fontStyle: string
): Promise<{ isGood: boolean; advice: string }> {
  const prompt = `Eres un Director de Arte experto en diseño de marcas, tipografía y psicología del color.
Un cliente está creando la identidad visual para su empresa, la cual describe de la siguiente manera:
"${focus}"

Para su logotipo y textos principales ha elegido la tipografía "${fontName}" (que pertenece a la familia ${fontStyle}).

Tu tarea es evaluar si esa elección tipográfica transmite las emociones correctas para el enfoque de su empresa.
Responde ÚNICAMENTE con un objeto JSON válido, sin formato markdown, con dos propiedades:
1. "isGood": booleano (true si la fuente encaja bien, false si no).
2. "advice": string (consejo de 2-3 párrafos cortos explicando por qué funciona o por qué no).

Ejemplo:
{
  "isGood": true,
  "advice": "¡Excelente elección! La fuente..."
}`

  try {
    const text = await callAI(prompt)
    const cleaned = text.trim().replace(/```json/g, "").replace(/```/g, "")
    const adviceData = JSON.parse(cleaned)
    return adviceData as { isGood: boolean; advice: string }
  } catch (error: any) {
    console.error("Error getting font advice:", error?.message)

    if (error?.status === 429) {
      return {
        isGood: false,
        advice: "⏳ El asesor está ocupado ahora mismo. Espera unos segundos e intenta de nuevo.",
      }
    }
    if (error?.message?.includes("OPENROUTER_API_KEY")) {
      return {
        isGood: true,
        advice: "⚙️ Configura tu OPENROUTER_API_KEY en el archivo .env para activar el Asesor Tipográfico con IA.",
      }
    }
    return {
      isGood: true,
      advice: `Hubo un error técnico: ${error.message || "Falla de conexión"}. Si te gusta la fuente visualmente, ¡adelante!`,
    }
  }
}
