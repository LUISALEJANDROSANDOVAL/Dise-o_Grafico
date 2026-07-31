# Stack Tecnológico Definitivo: CROMATIK (Web & Móvil)

Este documento detalla las tecnologías, lenguajes y frameworks exactos que componen el ecosistema de CROMATIK, habiendo sido seleccionados por su alto rendimiento, escalabilidad y capacidad para manejar cálculos matemáticos en tiempo real en el cliente.

---

## 1. Aplicación Web (Frontend)
El entorno web está construido para ofrecer una experiencia ultrarrápida (Zero-Lag) y soportar Server-Side Rendering para la previsualización de enlaces (SEO).

*   **Core Framework:** **Next.js (App Router) + React 18**
*   **Lenguaje:** **TypeScript** (Tipado estricto para evitar errores matemáticos en las fórmulas de color).
*   **Estilos y Maquetación:** **Tailwind CSS**.
*   **Animaciones y Físicas:** **Framer Motion** (Usado para la inercia, rebote táctil y fluidez a 60 FPS de la rueda cromática).
*   **Gestor de Paquetes:** **pnpm** (Seleccionado por su eficiencia y rapidez en el manejo de dependencias).
*   **Iconografía:** **Lucide React**.
*   **Despliegue y Hosting:** **Vercel** (Proporciona Edge Computing y un CI/CD impecable sincronizado directamente con el repositorio de código).

---

## 2. Aplicación Móvil (App)
La versión móvil aprovecha la misma lógica de negocio y motor de color, pero está adaptada para ejecutarse de forma nativa en dispositivos iOS y Android.

*   **Core Framework:** **React Native con Expo (Expo Router)**.
*   **Lenguaje:** **TypeScript**.
*   **Estilizado Nativo:** **NativeWind** (Permite usar las clases de Tailwind CSS directamente sobre los componentes nativos móviles).
*   **Animaciones Móviles:** **React Native Reanimated** (Lleva el peso matemático de las animaciones directamente al Thread nativo del teléfono, liberando el hilo de Javascript para el cálculo de colores).
*   **Acceso a Hardware:** Módulos de Expo para acceder a la cámara del dispositivo y extraer colores del mundo real.

---

## 3. Backend, Base de Datos y Autenticación
CROMATIK utiliza una arquitectura Serverless apoyada en Backend-as-a-Service, evitando la necesidad de mantener servidores propios.

*   **Infraestructura (BaaS):** **Supabase**.
*   **Base de Datos:** **PostgreSQL** (Alojada en Supabase).
    *   Se utiliza un modelo de base de datos eficiente guardando las paletas complejas dentro de columnas tipo `JSONB`, lo que permite tiempos de lectura instantáneos cuando alguien abre un enlace compartido (`/p/[id]`).
*   **Autenticación sin Fricción:** **Supabase Anonymous Auth**.
    *   Permite a los usuarios guardar paletas y generar links *sin obligarlos a crear una cuenta o dar su correo*, protegiendo la filosofía de "cero fricción" de la plataforma, mientras se registran sesiones anónimas para métricas de uso.

---

## 4. Procesamiento Interno y Exportación (Zero-Dependency)
El corazón de la aplicación no depende de APIs de terceros y todo el cálculo pesado se realiza directamente en el dispositivo del usuario.

*   **Motor de Color:** **Custom Math Engine** (`color.ts`). Desarrollado desde cero con operadores *Bitwise* y álgebra lineal; no utiliza librerías pesadas como `chroma.js`.
*   **Exportador a Adobe:** **DataView API** nativa de Javascript para escribir datos binarios (Big-Endian) localmente y generar archivos `.ase` (Adobe Swatch Exchange).
*   **Generador de PDF:** **jsPDF** (Procesa vectores, mockups y accesibilidad visual directamente en el navegador del usuario para entregar un Kit de Marca imprimible en segundos).
*   **Renderizado de Mockups:** Maquetas en SVG/CSS dinámico superpuesto con variables CSS (CSS Variables) en tiempo real para no sobrecargar la red descargando imágenes pesadas.
