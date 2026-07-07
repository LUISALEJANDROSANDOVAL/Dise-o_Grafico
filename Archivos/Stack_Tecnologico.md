# Stack Tecnológico - Proyecto RULEC

Dado que el proyecto contará tanto con una versión Web como con una Aplicación Móvil, y aprovechando tu conocimiento previo, el stack ideal se centrará en el ecosistema de **React**. Esto permitirá maximizar la reutilización de código, lógica y herramientas.

## 1. Frontend (Aplicaciones de Usuario)

### Web
*   **Framework:** **React** (Recomendado usar **Vite** para un entorno de desarrollo rapidísimo, o **Next.js** si necesitas que la página tenga un buen SEO para que los microempresarios te encuentren en Google).
*   **Gestor de Estado:** **Zustand**. Al girar la rueda cromática a 60 FPS, el estado del color va a cambiar muchísimas veces por segundo. Zustand es mucho más ligero y rápido para esto que Context API o Redux.
*   **Estilos:** **Tailwind CSS** (para un desarrollo UI muy ágil) o **Framer Motion** (esencial para hacer animaciones muy fluidas en la rueda y los mockups).

### Móvil (App)
*   **Framework:** **React Native** utilizando **Expo**.
*   **Ventajas de Expo aquí:** Te facilitará muchísimo la vida para implementar la función de "sacar una foto para extraer el color base", ya que manejar la cámara y la galería con Expo es muy sencillo.

## 2. Lógica Core (Motor de Color)
Para no inventar la rueda matemática de los colores, debes apoyarte en librerías probadas y precisas:
*   **Chroma.js** o **TinyColor2:** Son librerías de JavaScript fundamentales para este proyecto. Te permitirán:
    *   Generar los esquemas (tríada, análogos, etc.) automáticamente.
    *   Hacer conversiones precisas entre HEX, RGB, CMYK y HSL.
    *   Calcular el ratio de contraste para las alertas de legibilidad (WCAG).
    *   Aplicar simulaciones de daltonismo alterando la matriz de color.

## 3. Backend, Base de Datos y Métricas
Me preguntabas si requieres una base de datos aunque no haya login. **La respuesta es sí, es muy recomendable**, porque te permitirá entender cómo se usa tu producto y mejorarlo.

*   **BaaS (Backend as a Service):** **Firebase** o **Supabase**.
*   **¿Para qué usarlo sin login?**
    *   **Autenticación Anónima:** Firebase permite crear "sesiones anónimas" en el fondo. Así sabes si un usuario es nuevo o recurrente sin pedirle un email.
    *   **Métricas de Producto (Analytics):** Podrás saber cuántas veces se elige el perfil "Diseñador" vs "Microempresario", qué esquema de color es el más popular, y cuántos exportan el PDF.
    *   **Almacenamiento (Storage):** Si quieres guardar temporalmente los mockups generados para generar el link para compartir (`misitio.com/paleta/12345`), puedes guardar un pequeño documento JSON en la base de datos con los colores elegidos bajo ese ID, así cuando alguien abra el link, la app lee el JSON y reconstruye la paleta visualmente (sin necesidad de guardar imágenes pesadas).

## 4. Despliegue (Hosting)
*   **Web:** **Vercel** o **Netlify**. Ambos son gratuitos para empezar, se integran con GitHub y funcionan de maravilla con React/Vite/Next.js.
*   **Móvil:** Las tiendas oficiales (App Store y Google Play) a través del sistema de *build* de Expo (EAS Build).
