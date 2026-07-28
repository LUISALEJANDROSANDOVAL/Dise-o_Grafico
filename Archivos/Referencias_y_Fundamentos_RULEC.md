# Referencias y Fundamentos del Proyecto RULEC / CROMATIC

Este documento recopila las bases teóricas, científicas, tecnológicas y académicas sobre las cuales se diseñó y desarrolló la plataforma. Sirve como justificación técnica y bibliográfica para defender el proyecto ante cualquier revisión, demostrando que ninguna función fue dejada al azar.

---

## 1. Fundamentos Científicos y Matemáticos del Color

Para asegurar que RULEC sea una herramienta de precisión y no solo una aproximación visual, el motor matemático de la aplicación se basa en los siguientes estándares internacionales:

- **Modelo de Espacios de Color de la CIE (Commission Internationale de l'Éclairage):** 
  El motor de color del proyecto no usa librerías externas que encubran el código. Todas las conversiones entre modelos de color (HSL, RGB, HEX, y las aproximaciones CMYK) fueron implementadas directamente a través de las fórmulas matemáticas absolutas descritas originalmente por los estándares de la CIE. El uso de **HSL (Hue, Saturation, Lightness)** como modelo principal se decidió porque es la representación cilíndrica del espacio sRGB más intuitiva para la manipulación y la generación algorítmica de esquemas cromáticos (Armonías).

- **Matrices Oftalmológicas para Simulación de Daltonismo:**
  Los filtros de color de RULEC para simular deficiencias visuales (Protanopía, Deuteranopía y Tritanopía) están basados en matrices de transformación lineal del espacio RGB. Estos algoritmos derivan de las investigaciones clásicas en oftalmología y percepción visual digital (como las basadas en los estudios de *Viénot, Brettel y Mollon, 1999*), que calculan con exactitud qué longitudes de onda no perciben los diferentes tipos de dicrómatas.

## 2. Accesibilidad e Inclusión Digital

RULEC se basa en normas de diseño universales, siendo la accesibilidad uno de sus pilares más importantes:

- **Web Content Accessibility Guidelines (WCAG 2.1) del W3C:**
  El algoritmo validador de legibilidad de RULEC ("Alta", "Alerta", "Ratio de Contraste") se implementó utilizando exactamente la fórmula de **Luminancia Relativa** del W3C (World Wide Web Consortium). 
  * *Ecuación utilizada:* `(L1 + 0.05) / (L2 + 0.05)`. 
  * Justificación: Esto asegura que cuando RULEC le dice a un usuario que un color es seguro para ponerle texto encima (cumpliendo el ratio mínimo de 4.5:1 para AA), la sugerencia cumple con los estándares legales y de usabilidad mundiales.

## 3. Fundamentos de Diseño y Teoría Estética

- **Teoría del Color de Johannes Itten y la Bauhaus:**
  La generación automática de esquemas (Complementarios, Análogos, Tríadas, Monocromáticos y Complementarios Extendidos) es la traducción directa a código de las enseñanzas de Johannes Itten (figura clave de la escuela Bauhaus) en su obra *"El Arte del Color"*. La aplicación utiliza geometría pura (restas y sumas de ángulos de 120º, 180º, etc. sobre el círculo cromático de 360º) para emular matemáticamente las proporciones armónicas de Itten.

- **Psicología del Color en el Marketing (Semiótica Visual):**
  Las descripciones dinámicas generadas en el módulo de Naming y Psicología de la plataforma están sustentadas en estudios modernos de marketing emocional (y referencias clásicas, desde la teoría del color de *Goethe* hasta la semiótica de *Carl Jung*). Nos basamos en análisis estadísticos contemporáneos de cómo las marcas (ej. bancos en azul para confianza; comida en rojo para impulso) utilizan el color para evocar respuestas cognitivas específicas en el consumidor occidental.

## 4. Justificación del Stack Tecnológico

Las tecnologías utilizadas no fueron elegidas por popularidad, sino por resolver problemas específicos del flujo de desarrollo del proyecto:

- **React y su Ecosistema (Next.js para Web / Expo para Móvil):**
  La elección de React como librería central permite reutilizar la compleja lógica matemática del motor de color en ambas plataformas. *Next.js* fue seleccionado para la Web porque el SSR (Server-Side Rendering) es crucial para generar meta-etiquetas dinámicas (OpenGraph), de forma que al compartir una paleta mediante un link (ej. `cromatic.com/p/123`), se genere una vista previa real del color en redes sociales (WhatsApp, Twitter). *Expo (React Native)* se usó en el entorno móvil por su facilidad para acceder a apis nativas como la cámara (para extracción de colores).

- **Renderizado Fluido (Animaciones e Inercia):**
  Las animaciones (rueda cromática, mockups, transiciones) se implementaron combinando la API `requestAnimationFrame` del navegador nativo con herramientas de interpolación (como *Framer Motion* o las animaciones fluidas de *Tailwind CSS*). Esto se basó en el Principio de Interacción Hombre-Máquina (HCI) de respuesta inmediata: las respuestas visuales a los toques deben ocurrir en menos de 100ms y a 60 FPS para generar una ilusión de fisicalidad ("tactile feedback").

- **Base de Datos Desacoplada (Supabase / PostgreSQL):**
  Se eligió Supabase en lugar de opciones tradicionales porque su sistema de Autenticación permite la creación de **Sesiones Anónimas**. Esto respalda fundamentalmente el principio de "Fricción Cero" de RULEC: permitir a los usuarios crear paletas, guardar datos temporalmente y experimentar sin tener que llenar un formulario de registro primero.
