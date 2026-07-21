# Prompt para v0: Landing Page de CROMATIC

Copia y pega el siguiente texto en [v0.dev](https://v0.dev) para generar una Landing Page de primer nivel:

---

**PROMPT:**

Actúa como un diseñador UI/UX experto y desarrollador Frontend de élite. Quiero que construyas la Landing Page de una aplicación web llamada **CROMATIC**.

**¿Qué es CROMATIC?**
Es una herramienta inteligente de generación de paletas de color para identidades de marca. Está diseñada para dos tipos de usuarios:
1. *Microempresarios*: Que no saben de teoría del color y necesitan que la herramienta los guíe con psicología del color y emociones.
2. *Diseñadores*: Que necesitan herramientas avanzadas, ajustes HSL/CMYK, previsualización de mockups y validación estricta de contraste WCAG.

**Estilo Visual y Estética (CRÍTICO):**
- **Minimalismo Extremo y Elegante:** Mucho espacio en blanco (whitespace), tipografía sans-serif moderna (tipo Geist, Inter o SF Pro) muy limpia y legible.
- **Glassmorphism (Efecto Vidrio):** Usa fondos semi-transparentes con `backdrop-blur` sutiles para tarjetas y cabeceras.
- **Bordes y Sombras:** Bordes redondeados suaves (radios amplios), sombras muy tenues y difuminadas. Líneas delimitadoras de 1px con opacidad muy baja (ej: `border-slate-200/50`).
- **Modo Claro y Oscuro:** La página debe lucir espectacular en ambos modos. Usa Tailwind `dark:` para manejar los colores. En modo oscuro, usa un fondo casi negro (ej. `#0a0a0a`), no gris.
- **Animaciones (Framer Motion):** Incluye micro-interacciones. Hover states fluidos en los botones, y efectos de aparición (`fade in`, `slide up`) cuando los elementos entran en pantalla.
- **Fondo Dinámico:** Implementa un fondo abstracto muy sutil, con algunos orbes de colores muy difuminados (blur extremo) que se muevan lentamente en el fondo para darle vida a la marca "CROMATIC", usando colores como violeta y azul cyan.

**Estructura de la Página:**
1. **Header (Fijo/Sticky):** 
   - Izquierda: Logo tipográfico "CROMATIC" en negrita.
   - Derecha: Botón ghost "Guía de Nombres" y botón primario destacado "Iniciar Sesión" (con el ícono de LogIn de Lucide). Selector de Modo Oscuro/Claro. Fondo con `backdrop-blur`.

2. **Hero Section (Principal):**
   - Centrado. Un pequeño 'chip' superior que diga "Tu identidad visual en segundos".
   - Título impactante (h1 grande y grueso): "Dale color a tu marca con inteligencia y propósito". La palabra "color" debe tener un gradiente de texto vibrante.
   - Subtítulo descriptivo y conciso.

3. **Call To Action (Tarjetas Duales):**
   - Dos tarjetas grandes (Cards) flotantes lado a lado para los dos perfiles de usuario.
   - Tarjeta 1: "Tengo una marca". Icono de tienda, texto enfocado a la facilidad y psicología. Botón para "Empezar modo guiado".
   - Tarjeta 2: "Soy diseñador". Icono de paleta, texto enfocado en herramientas avanzadas y WCAG. Botón tipo outline para "Abrir herramientas avanzadas".
   - Al hacer hover en las tarjetas, deben tener un sutil resplandor (glow) del color del perfil (azul para empresas, violeta para diseñadores) y un leve levante (`translate-y`).

4. **Sección de Features (Características):**
   - Grid de 3 columnas destacando:
     - "Mockups en tiempo real": Previsualización en tarjetas y apps.
     - "Validación WCAG": Accesibilidad garantizada.
     - "Generación Inteligente": Modelos matemáticos de armonía (análogos, monocromáticos, etc.).
   - Usa íconos de `lucide-react`.

**Requisitos Técnicos:**
- Usa React, Tailwind CSS, Lucide React y Framer Motion.
- Usa componentes limpios y separados si es posible.
- Código altamente responsivo (mobile first).
- La UI no debe verse como un template genérico de Bootstrap, sino como un producto SaaS Premium del nivel de Vercel, Linear o Stripe.
