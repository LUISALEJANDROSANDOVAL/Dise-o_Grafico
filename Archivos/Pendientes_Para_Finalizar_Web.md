# Tareas Pendientes para Finalizar la Web (CROMATIC)

Tras analizar los requisitos funcionales y no funcionales del proyecto, así como el código actual del Frontend, aquí se listan las tareas que faltan por implementar para que la aplicación web se considere 100% terminada.

---

## 1. Módulo Educativo y de Guiado (Perfil Microempresario)
- [ ] **RF-18 - Modo Guiado (Cuestionario Inteligente):** Implementar un formulario interactivo rápido que pregunte al usuario por el rubro o tipo de marca (ej. "restaurante", "tecnología", "salud") y, a partir de sus respuestas, la plataforma le sugiera automáticamente paletas de colores apropiadas. Esto evitará que los usuarios no técnicos dependan de la selección manual en el círculo cromático.

## 2. Tests y Validación de Paleta
- [ ] **RF-14 - Test de Temperatura / Personalidad:** Desarrollar un pequeño componente visual que evalúe la paleta seleccionada y determine en tiempo real si se percibe como "cálida/fría", "seria/divertida" o "moderna/clásica" basado en la predominancia de los colores de la paleta.

## 3. Exportación Profesional
- [x] **RF-21 - Exportar PDF real (Kit Básico de Marca):** Sustituir el actual comando `window.print()` por una librería de generación de PDFs (como `jspdf` o `@react-pdf/renderer`) para entregar un documento pulido y profesional que el microempresario pueda descargar.
- [x] **RF-22 - Exportación Técnica (Perfil Diseñador):** Permitir la descarga de la paleta en formatos útiles para el diseñador gráfico, como archivos `.ase` (Adobe Swatch Exchange) para importar en Photoshop/Illustrator, y la generación de variables `.css` / Tailwind CSS listas para copiar y pegar.

## 4. Mejoras Técnicas Adicionales (Requisitos No Funcionales)
- [ ] **PWA (Progressive Web App):** Configurar el `manifest.json` y el Service Worker para que CROMATIC pueda ser instalada como una aplicación móvil o de escritorio de forma nativa.
- [ ] **SEO y OpenGraph:** Terminar de inyectar las etiquetas de metadatos dinámicas para que, al compartir un enlace de paleta (ej. `cromatic.com/p/abc123`) en redes sociales (WhatsApp, Twitter, Facebook), se genere una vista previa atractiva (tarjeta con imagen).

---

### Prioridad Sugerida
Se recomienda priorizar el **Modo Guiado (RF-18)** y la **Exportación a PDF (RF-21)**, ya que son las dos características de mayor valor inmediato para el usuario principal objetivo (el microempresario) y consolidan la herramienta como un producto completo y profesional.
