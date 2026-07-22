"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

export async function generateNameIdeas(focus: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY no está configurada en las variables de entorno.")
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `Eres un experto en branding y creación de nombres de empresas (Naming).
Un cliente te ha dado la siguiente descripción de su empresa o proyecto:
"${focus}"

Tu tarea es generar exactamente 5 ideas de nombres creativos, memorables y adecuados para este enfoque. 
Responde ÚNICAMENTE con un array de strings en formato JSON, sin markdown, sin explicaciones. 
Ejemplo: ["Nombre1", "Nombre2", "Nombre3", "Nombre4", "Nombre5"]`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim().replace(/```json/g, "").replace(/```/g, "")
    const ideas = JSON.parse(text)
    return ideas as string[]
  } catch (error: any) {
    console.error("Error generating names:", error)
    if (error?.status === 429 || error?.message?.includes("429")) {
      return ["Servidor saturado. Espera unos segundos."]
    }
    // Devolvemos el mensaje exacto para saber por qué falla
    return [`Error: ${error.message || "Hubo un problema de conexión con la IA"}`]
  }
}

export async function getFontAdviceAI(focus: string, fontName: string, fontStyle: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY no está configurada en las variables de entorno.")
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `Eres un Director de Arte experto en diseño de marcas, tipografía y psicología del color.
Un cliente está creando la identidad visual para su empresa, la cual describe de la siguiente manera:
"${focus}"

Para su logotipo y textos principales ha elegido la tipografía "${fontName}" (que pertenece a la familia ${fontStyle}).

Tu tarea es evaluar si esa elección tipográfica transmite las emociones correctas para el enfoque de su empresa.
Responde ÚNICAMENTE con un objeto JSON válido, sin formato markdown, con dos propiedades:
1. "isGood": booleano (true si la fuente encaja bien con la personalidad de la empresa, false si choca o da el mensaje equivocado).
2. "advice": string (Un consejo amigable, profesional y directo de unos 2-3 párrafos cortos explicando por qué funciona genial o por qué debería buscar otra alternativa, mencionando específicamente cómo la fuente "${fontName}" impacta psicológicamente).

Ejemplo de respuesta:
{
  "isGood": true,
  "advice": "¡Excelente elección! La fuente..."
}`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim().replace(/```json/g, "").replace(/```/g, "")
    const adviceData = JSON.parse(text)
    return adviceData as { isGood: boolean; advice: string }
  } catch (error: any) {
    console.error("Error getting font advice:", error)
    if (error?.status === 429 || error?.message?.includes("429")) {
      return {
        isGood: false,
        advice: "Has realizado demasiadas consultas seguidas. Nuestro Asesor Inteligente está descansando. Por favor, espera unos segundos e intenta de nuevo."
      }
    }
    return {
      isGood: true,
      advice: `Hubo un error técnico: ${error.message || "Falla de conexión"}. Sin embargo, si te gusta cómo se ve, ¡sigue adelante!`
    }
  }
}
