# Guía de Despliegue en Vercel

Sigue estos pasos para desplegar el proyecto (Next.js con pnpm) en Vercel.

## 1. Preparación del repositorio
Asegúrate de que todo el código esté subido a tu repositorio de GitHub, GitLab o Bitbucket.

1. Abre tu terminal.
2. Haz commit y push de tus cambios:
   ```bash
   git add .
   git commit -m "Preparando para el despliegue en Vercel"
   git push
   ```

## 2. Crear un nuevo proyecto en Vercel

1. Inicia sesión en tu cuenta de [Vercel](https://vercel.com/).
2. Haz clic en el botón **"Add New..."** y selecciona **"Project"**.
3. En la sección *Import Git Repository*, busca tu repositorio y haz clic en **"Import"**.

## 3. Configuración del proyecto en Vercel

Una vez importado, Vercel detectará automáticamente que es un proyecto de **Next.js**. Verifica que la configuración inicial sea correcta:

- **Framework Preset**: `Next.js` (detectado automáticamente)
- **Root Directory**: Si tu proyecto Next.js está dentro de una carpeta específica (como `web/Frontend`), debes configurar este campo. Haz clic en **"Edit"** al lado de *Root Directory* y selecciona la ruta correcta. Si el repositorio contiene únicamente el Frontend en la raíz, déjalo en `./`.
- **Build Command**: `pnpm run build` (detectado automáticamente por la presencia de `pnpm-lock.yaml`)
- **Install Command**: `pnpm install` (detectado automáticamente)

## 4. Configurar Variables de Entorno (Environment Variables)

Antes de hacer clic en Deploy, debes configurar las variables de entorno que el proyecto necesita para funcionar. Despliega la sección **"Environment Variables"** y añade las siguientes claves (puedes sacar los valores de tu archivo `.env` local):

| Nombre de la variable | Descripción |
| --- | --- |
| `AUTH_SECRET` | El secreto utilizado por NextAuth (puedes generarlo con `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | Tu Client ID de Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Tu Client Secret de Google Cloud Console |
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto en Supabase (Project Settings -> API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon Key de Supabase (Project Settings -> API) |

*Nota: Asegúrate de no incluir comillas adicionales en los valores al pegarlos en Vercel, el dashboard las añade automáticamente si son necesarias.*

## 5. Desplegar (Deploy)

1. Una vez añadidas todas las variables de entorno, haz clic en el botón azul **"Deploy"**.
2. Vercel comenzará a construir (build) el proyecto. Este proceso puede tardar unos minutos.
3. Si el build se completa sin errores, verás una pantalla de felicitaciones con vistas previas.
4. Haz clic en **"Continue to Dashboard"** para ver los detalles de tu proyecto y obtener tu URL de producción (ej: `tu-proyecto.vercel.app`).

## 6. Configurar URLs en Servicios Externos

Después de obtener la URL de producción de tu proyecto en Vercel, recuerda actualizar la configuración en los servicios de terceros:

- **Google Cloud Console (OAuth):** Añade la nueva URL a los Orígenes Autorizados de JavaScript y la URI de redireccionamiento (ej. `https://tu-proyecto.vercel.app/api/auth/callback/google`).
- **Supabase:** Actualiza la URL del sitio (Site URL) y las URIs de redireccionamiento permitidas (Redirect URLs) en `Authentication -> URL Configuration` usando tu nueva URL de Vercel.
