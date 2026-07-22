"use server"

import { GoogleGenAI } from "@google/genai"

// Modelo con mayor cuota gratuita
const MODEL = "gemini-2.0-flash-lite"

// Reintento automático con espera exponencial
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1500): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      const is429 = error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED")
      const isLast = attempt === retries
      if (is429 && !isLast) {
        console.warn(`[Gemini] Cuota alcanzada. Reintento ${attempt}/${retries} en ${delayMs}ms...`)
        await new Promise((r) => setTimeout(r, delayMs * attempt))
      } else {
        throw error
      }
    }
  }
  throw new Error("No se pudo completar la solicitud después de varios intentos.")
}

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY no está configurada en las variables de entorno.")
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
}

export async function generateNameIdeas(focus: string): Promise<string[]> {
  const ai = getClient()

  const prompt = `Eres un experto en branding y creación de nombres de empresas (Naming).
Un cliente te ha dado la siguiente descripción de su empresa o proyecto:
"${focus}"

Tu tarea es generar exactamente 5 ideas de nombres creativos, memorables y adecuados para este enfoque. 
Responde ÚNICAMENTE con un array de strings en formato JSON, sin markdown, sin explicaciones. 
Ejemplo: ["Nombre1", "Nombre2", "Nombre3", "Nombre4", "Nombre5"]`

  try {
    const response = await withRetry(() =>
      ai.models.generateContent({ model: MODEL, contents: prompt })
    )
    const text = response.text?.trim().replace(/```json/g, "").replace(/```/g, "") ?? ""
    const ideas = JSON.parse(text)
    return ideas as string[]
  } catch (error: any) {
    console.error("Error generating names:", error?.message)
    const is429 = error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED")
    if (is429) {
      return ["⏳ Límite de peticiones alcanzado. Espera unos segundos e intenta de nuevo."]
    }
    return [`❌ Error: ${error.message || "Problema de conexión con la IA"}`]
  }
}

export async function getFontAdviceAI(
  focus: string,
  fontName: string,
  fontStyle: string
): Promise<{ isGood: boolean; advice: string }> {
  const ai = getClient()

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
    const response = await withRetry(() =>
      ai.models.generateContent({ model: MODEL, contents: prompt })
    )
    const text = response.text?.trim().replace(/```json/g, "").replace(/```/g, "") ?? ""
    const adviceData = JSON.parse(text)
    return adviceData as { isGood: boolean; advice: string }
  } catch (error: any) {
    console.error("Error getting font advice:", error?.message)
    const is429 = error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED")
    if (is429) {
      return {
        isGood: false,
        advice: "⏳ El asesor está ocupado ahora mismo. Espera unos segundos e intenta de nuevo — el servicio se recupera automáticamente.",
      }
    }
    return {
      isGood: true,
      advice: `Hubo un error técnico: ${error.message || "Falla de conexión"}. Si te gusta la fuente visualmente, ¡adelante!`,
    }
  }
}
