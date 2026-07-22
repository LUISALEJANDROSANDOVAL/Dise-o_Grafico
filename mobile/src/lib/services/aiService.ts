// ─────────────────────────────────────────────
// Motor de IA usando OpenRouter (mismo que la web)
// Lista de modelos gratuitos con fallback automático
// ─────────────────────────────────────────────
const FREE_MODELS = [
  "openai/gpt-oss-20b:free",
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "nvidia/nemotron-nano-9b-v2:free",
];
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

async function callModel(apiKey: string, model: string, prompt: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://cromatic.app",
      "X-Title": "Cromatic Mobile - Naming Tool",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as any)?.error?.message || res.statusText;
    throw Object.assign(new Error(msg), { status: res.status });
  }

  const data = (await res.json()) as any;
  return data.choices?.[0]?.message?.content ?? "";
}

async function callAI(prompt: string): Promise<string> {
  // En Expo, las variables EXPO_PUBLIC_ son inyectadas por Babel en tiempo de compilación
  const apiKey = process.env['EXPO_PUBLIC_OPENROUTER_API_KEY'];

  if (!apiKey || apiKey === 'PEGA-TU-KEY-AQUI' || apiKey.trim() === '') {
    throw new Error('CLAVE_NO_CONFIGURADA: Ve a openrouter.ai, obtén tu API key gratis y ponla en el archivo .env');
  }

  for (const model of FREE_MODELS) {
    try {
      const result = await callModel(apiKey, model, prompt);
      return result;
    } catch (err: any) {
      const isUnavailable =
        err?.message?.includes("unavailable for free") ||
        err?.message?.includes("No endpoints found");
      if (isUnavailable) {
        continue;
      }
      throw err;
    }
  }

  throw new Error("Ningún modelo disponible ahora mismo. Intenta más tarde.");
}

/**
 * Genera 5 ideas de nombres de marca usando IA
 */
export async function generateNameIdeas(focus: string): Promise<string[]> {
  const prompt = `Eres un experto en branding y creación de nombres de empresas (Naming).
Un cliente te ha dado la siguiente descripción de su empresa o proyecto:
"${focus}"

Tu tarea es generar exactamente 5 ideas de nombres creativos, memorables y adecuados para este enfoque. 
Responde ÚNICAMENTE con un array de strings en formato JSON, sin markdown, sin explicaciones. 
Ejemplo: ["Nombre1", "Nombre2", "Nombre3", "Nombre4", "Nombre5"]`;

  try {
    const text = await callAI(prompt);
    const cleaned = text.trim().replace(/```json/g, "").replace(/```/g, "").trim();
    const match = cleaned.match(/\[.*\]/s);
    if (!match) throw new Error("Respuesta inesperada del modelo");
    return JSON.parse(match[0]) as string[];
  } catch (error: any) {
    console.error("Error generando nombres:", error?.message);
    if (error?.status === 429) return ["⏳ Límite momentáneo. Espera unos segundos e intenta de nuevo."];
    if (error?.message?.includes("CLAVE_NO_CONFIGURADA"))
      return ["⚙️ API key no configurada. Ponla en el .env y reinicia la app."];
    return [`❌ ${error.message || "Problema de conexión con la IA"}`];
  }
}

/**
 * Evalúa si una tipografía es adecuada para el negocio usando IA
 */
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
}`;

  try {
    const text = await callAI(prompt);
    const cleaned = text.trim().replace(/```json/g, "").replace(/```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/s);
    if (!match) throw new Error("Respuesta inesperada del modelo");
    return JSON.parse(match[0]) as { isGood: boolean; advice: string };
  } catch (error: any) {
    console.error("Error en asesor tipográfico:", error?.message);
    if (error?.status === 429) {
      return { isGood: false, advice: "⏳ El asesor está ocupado. Espera unos segundos e intenta de nuevo." };
    }
    if (error?.message?.includes("CLAVE_NO_CONFIGURADA")) {
      return { isGood: false, advice: "⚙️ API key no configurada. Ve a openrouter.ai, obtén tu key gratis y ponla en el .env." };
    }
    return { isGood: false, advice: `❌ Error: ${error.message || "Falla de conexión"}. Verifica tu API key.` };
  }
}
