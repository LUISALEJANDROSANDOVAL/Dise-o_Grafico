# Documentación Completa del Proyecto RULEC / CROMATIC

## 1. Introducción y Objetivos
**RULEC (también conocido en su versión web como CROMATIC)** es una plataforma dual (Aplicación Web y Aplicación Móvil) diseñada para facilitar la creación, evaluación y exportación de paletas de color y estrategias de identidad visual (branding). 
Está orientada a dos perfiles principales:
- **Microempresarios:** Usuarios sin conocimientos técnicos que necesitan una guía rápida y fundamentada para elegir colores para sus negocios (modo guiado, psicología del color, previsualización fácil).
- **Diseñadores Gráficos:** Profesionales que requieren herramientas técnicas, validación de contraste WCAG, exportación de variables CSS y archivos `.ase` (Adobe Swatch Exchange).

### Objetivos Principales:
- Desmitificar la teoría del color y hacerla accesible para emprendedores.
- Proporcionar herramientas de validación técnica de accesibilidad.
- Brindar un laboratorio interactivo que evalúe en tiempo real nombres de marca, paletas aplicadas en mockups y simulación de daltonismo.

---

## 2. Arquitectura y Stack Tecnológico

El proyecto está diseñado bajo un ecosistema centrado en **React** para maximizar la reutilización de código y la lógica de negocio.

### Frontend Web (CROMATIC)
- **Framework:** Next.js (App Router) y React 19.
- **Estilos y Animaciones:** Tailwind CSS (v4) y Framer Motion (para fluidez en la rueda cromática a 60 FPS).
- **Gestión de Estado / Lógica:** React Hooks estándar y contexto, diseñado para ser rápido ante los cambios constantes del color.
- **Generación de Archivos:** Librería `jspdf` para exportación de kits de marca y funciones nativas para exportar CSS y archivos `.ase`.

### Frontend Móvil (RULEC App)
- **Framework:** React Native manejado con Expo (Expo Router).
- **Estilos:** NativeWind (Tailwind para React Native).
- **Características Nativas:** Aprovecha Expo para un rápido acceso a cámara (captura de color base) y generación de códigos QR (`react-native-qrcode-svg`).

### Backend y Base de Datos (Infraestructura Compartida)
- **BaaS (Backend as a Service):** Supabase (PostgreSQL + Auth).
- **Autenticación:** Modo anónimo por defecto (`signInAnonymously`), escalable a OAuth (ej. Google) para guardar "Mis Paletas".
- **Esquema de Base de Datos (`Base.sql`):**
  - Tabla `perfiles`: Almacena el `id` del usuario (anónimo o logueado), `email`, `rol` (disenador, microempresario), `nombre_marca`, y `rubro`.
  - Tabla `paletas`: Almacena el `id` de paleta, `usuario_id`, `color_base` (HEX), `esquema_tipo` (mono, analogous, etc.), y los `colores` exactos generados (en formato JSONB).

---

## 3. Requisitos del Sistema

### Requisitos Funcionales (RF)
- **RF-01 / RF-02:** Selección y adaptación de interfaz según perfil de usuario (Diseñador vs Microempresario).
- **RF-03 a RF-05:** Círculo cromático interactivo, con inercia y arrastre fluido.
- **RF-07:** Generación automática de esquemas de color matemáticos (Monocromático, Análogo, Tríada, Complementario, etc.).
- **RF-10:** Conversión y visualización de códigos (HEX, RGB, HSL, CMYK).
- **RF-11:** Aplicación en tiempo real de la paleta sobre mockups de productos físicos (ej. tarjetas de presentación, envases).
- **RF-12:** Evaluador de contraste automático bajo estándares WCAG 2.1.
- **RF-13:** Simulación de daltonismo (Protanopía, Deuteranopía, Tritanopía) modificando la matriz de los colores.
- **RF-16 / RF-17:** Módulo de psicología del color interactivo, cambiando la explicación y casos de éxito reales según el tono base.
- **RF-20:** Compartir paletas mediante enlaces únicos.
- **RF-21 / RF-22:** Exportación profesional (PDF, CSS, `.ase`).
- **RF-23:** Laboratorio de Naming (evaluación de la longitud del nombre y emparejamiento tipográfico por rubro).

### Requisitos No Funcionales (RNF)
- **RNF-02:** Cumplimiento de accesibilidad.
- **RNF-04:** Renderizado fluido a 60 FPS en la rueda cromática.
- **RNF-05:** Tiempo de cálculo de algoritmos matemáticos y renderizado visual inferior a 100ms para no generar latencia.
- **RNF-08:** Fricción cero (poder usar la app sin loguearse inicialmente mediante sesiones anónimas de Supabase).

---

## 4. Métodos Aplicados y Matemática del Color

Esta es la sección más técnica de la plataforma, que explica cómo la herramienta genera todo sin depender de APIs externas, sino mediante puros cálculos matemáticos en el cliente (`lib/color.ts` y componentes del motor de color).

### 4.1. Conversiones de Formato Base (HSL a HEX, RGB y CMYK)
El sistema opera internamente en formato **HSL (Hue, Saturation, Lightness)** porque es el modelo más intuitivo para el ojo humano (grado en un círculo cromático).
- **HSL a HEX/RGB:** Se utilizan fórmulas de conversión de espacio de color absolutas. Se calcula el "Chroma" ($C = (1 - |2L - 1|) \times S$), se saca un punto intermedio $X$ según el sector del círculo del Hue ($X = C \times (1 - |(H / 60) \pmod 2 - 1|)$) y se suma un emparejamiento $m$ ($L - C/2$). Esto se mapea a canales R, G, B y luego se convierte a un string Hexadecimal en base 16.
- **CMYK (Aproximación de Impresión):** Se calcula extrayendo el negro ($K = 1 - \max(R, G, B)$) y determinando la proporción restante de Cyan, Magenta y Yellow. Además, existe una función `simulateCMYK` que reduce artificialmente la saturación (hasta un 25-30% menos) e interviene la luminosidad de los verdes y azules para simular cómo se apagan estos colores vibrantes de pantalla al imprimirse en papel.

### 4.2. Generación de Esquemas de Color (Armonías)
Dependiendo del "Hue" ($H$) base, se generan matemáticamente los colores acompañantes ajustando el $H$, $S$ y $L$:
- **Monocromático:** Mismo $H$ y $S$, pero se varía el $L$ (Luminosidad) sumando y restando porcentajes (ej. $L + 40$, $L + 20$, $L - 18$).
- **Análogo:** Se toman ángulos vecinos restando y sumando grados al $H$ (ej. $H - 30^\circ$, $H - 15^\circ$, $H + 15^\circ$, $H + 30^\circ$) y se ajusta levemente el $L$ para mantener distinción.
- **Complementario:** Se invierte el ángulo en $180^\circ$ ($H + 180^\circ$).
- **Complementarios Extendidos (Split):** Se calculan los adyacentes al complementario ($H + 150^\circ$, $H + 210^\circ$).
- **Tríada:** Se divide el círculo en tres partes iguales ($H + 120^\circ$, $H + 240^\circ$).

### 4.3. Validación de Accesibilidad (Contraste WCAG 2.1)
El método para evaluar si un texto se lee bien sobre un fondo usa la **Luminancia Relativa** del W3C.
1. Se sRGB-linealizan los canales RGB del color (si la proporción del canal es $\le 0.03928$, se divide por $12.92$; de lo contrario, se eleva a $2.4$).
2. Se saca la luminancia total: $L = 0.2126R + 0.7152G + 0.0722B$.
3. El ratio se calcula con la fórmula: $(L_{claro} + 0.05) / (L_{oscuro} + 0.05)$.
4. Si el ratio es $\ge 4.5:1$, el test pasa como **"AA"** o **"Legibilidad Alta"**. Si es $\ge 7$, es **"AAA"**. De lo contrario, se emite una alerta.

### 4.4. Simulación de Daltonismo
Se aplican matrices de transformación estandarizadas sobre el vector RGB del color para simular cómo lo ven personas con anomalías visuales:
- **Protanopía (Ceguera al rojo):** Se multiplica el rojo original por $0.567$ y el verde por $0.433$.
- **Deuteranopía (Ceguera al verde):** Matriz de transformación que anula las proporciones normales de detección verde ($R \times 0.625 + G \times 0.375$).
- **Tritanopía (Ceguera al azul):** Modificación severa de la detección de ondas cortas.

### 4.5. Psicología del Color y Naming
La lógica no utiliza Inteligencia Artificial generativa, sino un mapeo heurístico y algorítmico rápido:
- **Psicología:** El círculo de $360^\circ$ está particionado en segmentos (ej. $345^\circ-15^\circ$ es Rojo; $160^\circ-260^\circ$ es Azul). Al caer el $H$ en un rango, se inyecta la narrativa del significado ("Poder/Acción" vs "Confianza/Lógica") y se muestran ejemplos de marcas reales (`getColorPsychology`).
- **Naming (RF-23):** Un pequeño motor valida en tiempo real la salud del nombre. Los nombres menores a 8 caracteres suman máximo puntaje de brevedad. Y según el *Rubro* (Tecnología, Restaurante, etc.) se altera el CSS (familia de fuente, ej. *Inter* vs *Playfair Display*) para demostrar el "Typography Match".

### 4.6. Motor de Físicas de la Rueda (Inercia)
Para cumplir con el **RNF-04**, la rueda cromática en `color-engine.tsx` implementa un modelo de inercia personalizado.
- Registra eventos nativos de Puntero (`onPointerDown`, `onPointerMove`, `onPointerUp`).
- Calcula el ángulo utilizando el arcotangente del puntero respecto al centro del círculo (`Math.atan2(dy, dx)`).
- Calcula la *Velocidad Angular* dividiendo el delta de grados sobre el tiempo transcurrido (en ms).
- Al soltar el puntero, si hay inercia (velocidad > umbral), usa `requestAnimationFrame` reduciendo la velocidad por una fricción simulada multiplicándola por $0.95$ en cada frame, logrando un giro sedoso similar a la ruleta.

---

## 5. Fuentes de los Algoritmos y Métodos

Todos los algoritmos implementados provienen de estándares consolidados de la industria, evitando dependencias pesadas:
- **Fórmulas de Color y HSL/RGB:** Extraídas y adaptadas de la matemática formal de la comisión CIE (Commission Internationale de l'Éclairage).
- **Validación de Accesibilidad:** Directrices del W3C Web Content Accessibility Guidelines (WCAG) versión 2.1 (Algoritmo de Luminancia Relativa).
- **Simulaciones de Visión:** Matrices de transformación de color para deficiencias visuales de simuladores daltónicos estándar de la industria (ej. *Coblis*).
- **Teoría de Psicología del Color:** Principios de diseño gráfico, marketing y semiótica visual de escuelas de arte y publicidad (ej. Teoría del Color de Johannes Itten y estudios contemporáneos de marketing emocional).

Esta arquitectura completa permite que RULEC/CROMATIC funcione como un "laboratorio visual de bolsillo" de altísima precisión, que se ejecuta casi en su totalidad en el cliente (navegador/móvil), garantizando velocidad, economía de servidor y un valor educativo y práctico enorme para el usuario.
