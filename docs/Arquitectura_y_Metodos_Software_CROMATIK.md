# Arquitectura y Métodos de Software (CROMATIK)

Este documento detalla la estructura profunda de ingeniería de software detrás de CROMATIK. Se desglosan los algoritmos, funciones clave, patrones de diseño y lógica computacional que permiten a la aplicación funcionar en tiempo real sin dependencias pesadas (Zero-Dependency Core).

---

## 1. El Motor Core Matemático (`lib/color.ts`)

La aplicación no utiliza librerías de terceros (como `chroma.js` o `tinycolor2`) para el cálculo de los colores, sino que implementa sus propios algoritmos matemáticos, garantizando un rendimiento inferior a 1 ms por cálculo.

### A. Conversiones de Espacio de Color
- **`hexToRgb(hex)`:** 
  Utiliza operadores a nivel de bits (Bitwise Operators) para un rendimiento extremo. Convierte el string Hexadecimal a un entero y aplica desplazamientos (Shift `>>`) y máscaras (`& 255`) para extraer los canales.
  ```typescript
  const bigint = Number.parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
  ```
- **`rgbToHsl` / `hslToHex`:**
  Implementa las fórmulas del espacio de color cilíndrico estándar. Utiliza funciones matemáticas puras (`Math.abs`, `Math.max`, `Math.min`) para calcular el Croma y la Luminosidad, asegurando que los valores siempre estén confinados entre 0-360 (Hue) y 0-100 (S y L).

### B. Algoritmo de Generación de Armonías (`generatePalette`)
Usa un patrón *Factory* a través de un `switch` statement para calcular las coordenadas geométricas en el círculo cromático.
- En lugar de colores aleatorios, aplica desplazamientos trigonométricos sobre el ángulo `H` (Hue) y ajusta topes con `clamp()` sobre `S` y `L`.
- *Ejemplo Tríada:* Retorna el color base, base + 120º y base + 240º.

### C. Validador de Accesibilidad (WCAG)
- **`luminance(hex)`:**
  Implementa el algoritmo de luminancia relativa sRGB linealizado del W3C. Si la fracción de color es $\le 0.03928$, aplica división directa; de lo contrario, aplica la corrección gamma polinomial (`Math.pow((cs + 0.055) / 1.055, 2.4)`).
- **`contrastRatio(fg, bg)`:** 
  Retorna la relación de contraste matemáticamente precisa $(L_{light} + 0.05) / (L_{dark} + 0.05)$, determinando si un par de colores es seguro para leer (AA o AAA).

### D. Simulador Oftalmológico (Álgebra Lineal)
- **`simulate(hex, mode)`:**
  Utiliza multiplicación de matrices estáticas (`CB_MATRIX`) contra el vector RGB del color actual para simular la ceguera al color. El álgebra aplicada reduce artificialmente la percepción de las longitudes de onda según el tipo de dicromatismo (Protanopía, Deuteranopía, Tritanopía).

---

## 2. Físicas de Interacción (`color-engine.tsx`)

La rueda cromática interactiva de CROMATIK simula el tacto de un objeto físico pesado (como la rueda de una caja fuerte) implementando un motor de físicas personalizado.

### A. Detección Angular (Trigonometría)
Al interactuar con el mouse o la pantalla táctil (`onPointerMove`), se extraen las coordenadas `X` e `Y` relativas al centro del contenedor.
- Se utiliza el arco tangente (`Math.atan2(dy, dx)`) para convertir esas coordenadas cartesianas en grados de rotación matemática puros.

### B. Motor de Inercia en Tiempo Real (`requestAnimationFrame`)
Para evitar el uso de librerías de animación pesadas, se desarrolló un bucle de animación nativo:
- **Cálculo de Velocidad:** Mide la diferencia de ángulo dividida por el *Delta Time* (tiempo transcurrido calculado mediante `performance.now()`).
- **Fricción (Damping):** Cuando el usuario suelta la rueda, si la velocidad es alta, se activa el bucle `requestAnimationFrame`. En cada frame, la velocidad se reduce multiplicándola por un factor de amortiguamiento matemático (`velocity *= Math.pow(0.95, dt / 16)`).
- El giro se detiene automáticamente cuando la velocidad cae por debajo del umbral de $0.01$.

---

## 3. Manejo de Estado y Rendimiento (React)

Dado que la rueda cromática genera actualizaciones continuas a 60 FPS, la arquitectura de React está optimizada para prevenir re-renderizados innecesarios:
- **Caché en Memoria (`useRef`):** Todos los valores transitorios de la física (velocidad, ángulo anterior, timestamp) se almacenan en referencias, los cuales mutan sin bloquear el *Main Thread* ni forzar re-renderizados de la UI.
- **Memoización (`useMemo`):** La generación de los 5 colores de la paleta (`generatePalette`) y la comprobación de contrastes están memoizados. Solo se recalculan si el ángulo base (Hue) sufre una modificación de estado final.
- **Renderizado Vectorial Fluido:** Los punteros de la rueda se dibujan mediante un nodo `<svg>` absoluto con vectores (`<line>`, `<circle>`). Como los vectores son dibujados por la GPU, el rendimiento no decae incluso en teléfonos de gama baja.

---

## 4. Ingeniería de Exportación

La plataforma provee métodos complejos para extraer la data directamente desde el cliente, sin gastar recursos de servidor:
- **Exportación de Adobe (.ase):**
  Implementa manipulación binaria directa. CROMATIK escribe bloques de memoria (Buffers) usando codificación Big-Endian para crear un archivo binario `.ase` legítimo, compatible con Photoshop e Illustrator, empaquetando cada valor CMYK/RGB byte por byte de forma local.
- **Exportación a PDF:**
  Utiliza `jspdf` para pintar de forma programática rectángulos y textos, renderizando la paleta de colores activa y la evaluación de accesibilidad en un documento imprimible, que es posteriormente forzado a descarga a través del navegador.
- **Integración Backend (Supabase):**
  La persistencia de las paletas ocurre asíncronamente conectándose a PostgreSQL. Los esquemas complejos de color son convertidos a JSON plano (`JSON.stringify`) y almacenados en una columna `JSONB`, lo que permite consultas extremadamente rápidas al momento de cargar un enlace compartido (`/p/id`).
