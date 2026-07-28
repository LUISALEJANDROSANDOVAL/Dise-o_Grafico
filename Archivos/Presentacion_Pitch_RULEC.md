# Estructura de Presentación (Pitch Deck) - RULEC / CROMATIC

Este documento está diseñado para ser utilizado directamente como la estructura de tus diapositivas (PowerPoint / Canva / Keynote) o como el guión para tu exposición del proyecto. Está resumido, enfocado en el impacto, el problema y la solución.

---

## Diapositiva 1: Portada
* **Título:** RULEC (CROMATIC)
* **Subtítulo:** Tu laboratorio de identidad visual y color en el bolsillo.
* **Elemento Visual Sugerido:** Mockup de un teléfono con la aplicación abierta en la rueda cromática interactiva al lado de la pantalla web de Cromatic.

---

## Diapositiva 2: El Problema
* **Título:** El desafío de la Identidad Visual
* **Viñetas Clave (Bullet points):**
  - **Para el microempresario:** Elegir colores para su negocio es un proceso intuitivo que suele fallar. No entienden de códigos ni de teoría del color, resultando en marcas poco legibles o sin impacto.
  - **Para el diseñador:** Procesos largos para generar variantes accesibles, exportar variables técnicas y validar el contraste WCAG para clientes.
* **Elemento Visual Sugerido:** Imagen dividida. A la izquierda, un negocio con colores que chocan (difícil de leer). A la derecha, un diseñador frustrado con múltiples ventanas abiertas.

---

## Diapositiva 3: La Solución (Nuestra Propuesta de Valor)
* **Título:** Conoce RULEC / CROMATIC
* **Texto Principal:** Una plataforma dual (Web y Móvil) que democratiza la teoría del color y ofrece herramientas de diseño profesional accesibles para todos, operando en tiempo real.
* **Beneficios Clave:**
  - **Modo Dual:** Experiencia guiada para principiantes y herramientas técnicas para profesionales.
  - **Sin fricción:** No requiere registro inicial para empezar a crear.
  - **Educativo:** Explica la psicología detrás de cada tono.

---

## Diapositiva 4: Características Principales (Magia en Tiempo Real)
* **Título:** Funcionalidades Core
* **Viñetas Clave (Bullet points):**
  - **Motor de Color Matemático:** Genera esquemas armónicos (complementarios, tríadas, etc.) matemáticamente perfectos y a 60 fotogramas por segundo.
  - **Mockups en Vivo:** Previsualización instantánea de la paleta sobre productos físicos (ej. tarjetas de presentación, envases).
  - **Accesibilidad Inclusiva:** Simulador de daltonismo y validador de contraste WCAG 2.1 automático.
  - **Laboratorio de Naming:** Evalúa el nombre de la marca y recomienda la tipografía perfecta según el rubro.

---

## Diapositiva 5: ¿Cómo funciona bajo el capó? (Para el jurado técnico)
* **Título:** Tecnología y Algoritmos
* **Puntos Técnicos a Destacar (Hablar con seguridad):**
  - **Matemática sin dependencias:** No dependemos de APIs lentas; implementamos las ecuaciones de color de la comisión CIE y del W3C directamente en el dispositivo.
  - **Stack Moderno y Veloz:** React / Next.js para la Web y React Native (Expo) para la App.
  - **Base de Datos Inteligente:** Supabase (PostgreSQL) con sesiones anónimas.
  - **Motor de Inercia Físico:** Algoritmo propio usando `requestAnimationFrame` para que el giro de la rueda se sienta como un objeto físico real.

---

## Diapositiva 6: Entregables (Resultados del Usuario)
* **Título:** De la Pantalla a la Realidad
* **Viñetas Clave (Bullet points):**
  - **Exportación Profesional:** Generación de un Kit de Marca en PDF descargable.
  - **Recursos para Desarrolladores/Diseñadores:** Descarga de archivos Adobe `.ase` y variables CSS.
  - **Compartir Fácilmente:** Generación de enlaces únicos (`cromatic.com/p/...`) y Códigos QR para compartir paletas al instante.
* **Elemento Visual Sugerido:** Un PDF siendo impreso o un código QR al lado de un archivo de Adobe.

---

## Diapositiva 7: Próximos Pasos (Roadmap)
* **Título:** El Futuro de RULEC
* **Viñetas Clave (Bullet points):**
  - Implementación de Inteligencia Artificial guiada (Chatbot de Naming).
  - Conversión de la plataforma Web a una PWA (Progressive Web App) instalable de forma nativa.
  - Generación de contenido dinámico de marcas generadas en redes sociales.

---

## Diapositiva 8: Cierre y Preguntas
* **Título:** Transforma tu Marca Hoy
* **Texto de Cierre:** RULEC no solo elige colores, construye la esencia visual de tu negocio.
* **Llamado a la acción:** "Prueba la app escaneando este QR" (Pon un QR funcional que lleve al entorno local o Vercel si está desplegado).
* **Preguntas y Respuestas (Q&A)**

---

### Consejos para tu presentación:
1. **Haz una demostración (Demo) en vivo:** Entre la diapositiva 4 y 5, si es posible, gira la rueda cromática frente al jurado. Eso siempre sorprende.
2. **Habla de la validación matemática:** Enfatiza mucho que los algoritmos (especialmente el de legibilidad WCAG y la conversión HSL-RGB) fueron implementados puramente con ecuaciones. Da la impresión de un desarrollo muy sólido y técnico.
