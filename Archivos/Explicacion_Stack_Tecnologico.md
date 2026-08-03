# Arquitectura y Stack Tecnológico de CROMATIK

Este documento explica en detalle todas las tecnologías, bibliotecas, variables de entorno y servicios de terceros que conforman la arquitectura de CROMATIK, así como el razonamiento técnico detrás de cada elección.

---

## 1. El Framework Principal: Next.js (React)
- **Tecnología:** Next.js 16 (App Router) + React 19.
- **¿Por qué se eligió?** 
  - **SEO y OpenGraph:** Permite renderizado del lado del servidor (SSR). Esto es vital para que las paletas compartidas (ej. `/p/abc123`) generen tarjetas dinámicas en WhatsApp/Twitter mediante `/api/og`. Una app de React tradicional (SPA) no puede hacer esto fácilmente.
  - **Rutas de API Integradas:** Nos permite tener el Frontend y el Backend (como la llamada segura a la Inteligencia Artificial) en un solo proyecto sin necesidad de levantar un servidor Node.js aparte.
  - **Turbopack:** Tiempos de compilación ultrarrápidos durante el desarrollo.

## 2. Estilos y Sistema de Diseño
- **Tecnologías:** Tailwind CSS v4 + Tailwind Merge (`tailwind-merge`) + CLSX (`clsx`).
- **¿Por qué se eligió?**
  - Permite prototipar interfaces hermosas de manera instantánea sin escribir archivos `.css` separados.
  - Facilita enormemente el sistema de **Modo Oscuro / Modo Claro** (con las clases `dark:`).
  - Herramientas como `tailwind-merge` y `clsx` permiten que los componentes (botones, modales) sean dinámicos y acepten clases condicionales sin que los estilos colisionen (conflictos de CSS).

## 3. Componentes de UI e Interacción
- **Tecnologías:** Shadcn UI + Base UI (`@base-ui/react`).
- **¿Por qué se eligió?**
  - En lugar de usar librerías pesadas como Material UI o Bootstrap, usamos componentes *Headless* (sin estilos predefinidos) a los que les aplicamos Tailwind. Esto garantiza que la web sea 100% accesible (soporte para lectores de pantalla y navegación por teclado) pero manteniendo un diseño único y de primer nivel (Premium).
  
## 4. Animaciones y Experiencia Fluida
- **Tecnología:** Framer Motion (`framer-motion`).
- **¿Por qué se eligió?**
  - Es el motor detrás del "Laboratorio Físico". Nos permite crear animaciones de inercia (la rueda cromática que sigue girando cuando la "tiras"), las transiciones suaves entre páginas, y los modales que aparecen con efectos de rebote (Spring physics).

## 5. Iconografía
- **Tecnología:** Lucide React (`lucide-react`).
- **¿Por qué se eligió?**
  - Es una librería de iconos SVG limpios, modernos y muy ligeros. Se adaptan perfectamente a grosores y tamaños de fuente, manteniendo la estética profesional de la plataforma.

## 6. Generación de Exportables (El valor para el usuario)
- **PDFs:** `jspdf`
  - *Uso:* Genera el "Kit Básico de Marca". Permite "dibujar" textos, rectángulos y colores en un lienzo PDF directamente desde el navegador del usuario sin sobrecargar un servidor.
- **Códigos QR:** `qrcode`
  - *Uso:* Genera el código escaneable para compartir paletas al instante.
- **Archivos `.ase`:** (Código nativo TypeScript usando `DataView`).
  - *Uso:* Genera la paleta de Adobe Swatch Exchange binaria leyendo y transformando bytes para compatibilidad directa con Illustrator/Photoshop.

## 7. Inteligencia Artificial (El Laboratorio de Naming)
- **Tecnología:** Google Gemini API (`@google/genai`).
- **¿Por qué se eligió?**
  - Gemini ofrece capacidades avanzadas de razonamiento creativo. Le enviamos un *prompt* con los colores (HEX), el rubro y la psicología detectada, y la IA devuelve nombres de marca perfectos con formato JSON estructurado.

## 8. Base de Datos y Autenticación (El Backend as a Service)
- **Tecnología:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`).
- **¿Por qué se eligió?**
  - Es la mejor alternativa de código abierto a Firebase (basada en PostgreSQL).
  - Gestiona el Login con Email y el Login Social (Google OAuth) de forma extremadamente segura.
  - Guarda "Mis Paletas" conectadas al ID del usuario, usando RLS (Row Level Security) para asegurar que nadie pueda borrar o ver las paletas de otra persona.

---

## 🔑 Variables de Entorno y Configuración (El archivo `.env`)

Para que el proyecto funcione en cualquier entorno (Local o Vercel), requiere un archivo `.env` o `.env.local` con las siguientes llaves maestras:

1. **`NEXT_PUBLIC_SUPABASE_URL`**
   - **Qué es:** La URL de la base de datos de Supabase.
   - **Para qué sirve:** Le dice al Frontend a qué servidor conectarse para guardar paletas y hacer login. Al empezar con `NEXT_PUBLIC_`, es seguro que se exponga en el navegador.
2. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
   - **Qué es:** La llave pública "anónima" de Supabase.
   - **Para qué sirve:** Sirve para inicializar el cliente en el navegador. Las reglas de RLS en la base de datos evitan que esta llave sea un peligro (solo pueden operar datos si el usuario tiene una sesión iniciada).
3. **`GEMINI_API_KEY`**
   - **Qué es:** La llave secreta de la API de Google Gemini.
   - **Para qué sirve:** Autoriza a nuestro servidor a generar los nombres de marca. **ATENCIÓN:** Esta llave *NO* tiene el prefijo `NEXT_PUBLIC_`. Esto significa que solo existe en el entorno del servidor seguro (`app/actions.ts`), evitando que piratas informáticos se roben tu cuota de uso de inteligencia artificial.

---

### Resumen del Flujo de la Arquitectura
1. El usuario entra, **Next.js** sirve la interfaz dibujada con **Tailwind CSS**.
2. Juega con los colores interactuando con **Framer Motion** y fórmulas matemáticas nativas.
3. Solicita un nombre de marca: **Next.js (Servidor)** usa la `GEMINI_API_KEY` de forma oculta para hablar con Google y devuelve el resultado.
4. El usuario guarda la paleta: **Supabase** valida su sesión (con la URL y la llave anónima) y lo almacena de forma persistente en PostgreSQL.
5. El usuario exporta: **jsPDF** dibuja el archivo y el navegador lo descarga al instante.
