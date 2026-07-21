# Plan de Implementación Backend por Módulos y Pantallas - RULEC Móvil

Este documento sirve como **guía ejecutiva y técnica de trabajo en equipo**. Detalla las tareas específicas que se deben realizar en el Backend y la lógica de negocio para cada **pantalla / módulo** de la aplicación móvil, vinculando explícitamente cada tarea con su **Requisito Funcional (RF)**, **Requisito No Funcional (RNF)** y los campos correspondientes de la **Base de Datos Supabase (`Base.sql`)**.

---

## Desglose por Módulos y Pantallas

---

### 📱 Módulo 1: Pantalla de Paleta de Color (`src/app/index.tsx`)

Este módulo gestiona la creación interactiva de la paleta cromática, la matemática del color y la generación de códigos en tiempo real.

* **Requisitos Funcionales Asociados:**
  * **RF-03:** Mostrar círculo cromático interactivo.
  * **RF-04:** Permitir girar y arrastrar el círculo de forma fluida.
  * **RF-05:** Fijar color base seleccionado en la rueda.
  * **RF-07:** Generar automáticamente esquemas de color (Monocromático, Análogo, Tríada, Complementario).
  * **RF-10:** Mostrar los códigos de color (HEX, RGB, HSL, CMYK).
  * **RF-20:** Compartir la paleta generada mediante enlace único o código QR.
* **Requisitos No Funcionales Asociados:** **RNF-04** (Giro fluido a 60 FPS), **RNF-05** (Actualización < 100ms).
* **Campos de Base de Datos Impactados:** `public.paletas` (`id`, `usuario_id`, `color_base`, `esquema_tipo`, `colores` [JSONB]).

#### 🛠️ Tareas Backend / Lógica a Realizar:
1. **Conectar Motor de Color Local (`lib/colorEngine.ts`)**:
   * Implementar la función `generateHarmonies(hexBase)` que calcula los 4 tonos según el esquema seleccionado (Complementario, Análogo, Tríada, Monocromo).
   * Implementar `convertColorFormats(hex)` para extraer los valores de RGB, HSL y CMYK.
2. **Conectar la Rueda Cromática al Estado Reactivo**:
   * Al tocar o girar la rueda en `index.tsx`, llamar dinámicamente a `generateHarmonies()` para actualizar el estado global de los 4 swatches de color.
3. **Persistencia en Base de Datos Supabase (`lib/services/paletteService.ts`)**:
   * Implementar `savePalette()`: Al presionar "Guardar Paleta", insertar un nuevo registro en la tabla `public.paletas` enviando `color_base`, `esquema_tipo` y el objeto JSONB con los colores.
4. **Generador de Enlace Único y QR (RF-20)**:
   * Crear el payload de enlace compartible (`rulec://paleta/:id` o `https://rulec.app/paleta/:id`) usando la librería `react-native-qrcode-svg`.

---

### 🎨 Módulo 2: Pantalla de Visualización y Mockups (`src/app/mockups.tsx`)

Este módulo aplica la paleta activa sobre componentes físicos reales (tarjetas de presentación y envases) y valida el contraste accesible.

* **Requisitos Funcionales Asociados:**
  * **RF-11:** Aplicar la paleta generada en tiempo real sobre mockups dinámicos.
  * **RF-12:** Evaluar el contraste entre texto y fondo y lanzar alertas de legibilidad (WCAG 2.1).
  * **RF-13:** Incluir simulación de daltonismo (Protanopía, Deuteranopía).
* **Requisitos No Funcionales Asociados:** **RNF-02** (Accesibilidad), **RNF-05** (Procesamiento < 100ms).
* **Campos de Base de Datos Impactados:** Lectura de la sesión activa y tabla `public.paletas`.

#### 🛠️ Tareas Backend / Lógica a Realizar:
1. **Sincronización de Paleta Activa**:
   * Conectar `mockups.tsx` a la paleta activa en la sesión para que los componentes "Aura Noir" (tarjeta de presentación) y "No. 04" (etiqueta de producto) adopten inmediatamente el color de fondo y de acento seleccionados.
2. **Evaluador Matemático de Contraste WCAG (`lib/colorEngine.ts`)**:
   * Implementar `calculateContrastRatio(textHex, bgHex)` siguiendo la fórmula estándar del W3C ($L1 + 0.05) / (L2 + 0.05)$.
   * Si el ratio es $\ge 4.5:1$, mostrar el badge en verde: **`Legibilidad: Alta`** (**RF-12**).
   * Si el ratio es $< 4.5:1$, cambiar el badge automáticamente a **`Alerta: Contraste Bajo`**.
3. **Filtro de Simulación de Daltonismo (RF-13)**:
   * Aplicar matriz de transformación de color para simular Protanopía/Deuteranopía sobre los mockups.

---

### 📖 Módulo 3: Pantalla de Psicología del Color (`src/app/psychology.tsx`)

Este módulo educa sobre la narrativa de cada tono y presenta casos reales de éxito comercial.

* **Requisitos Funcionales Asociados:**
  * **RF-16:** Sección interactiva que explique el significado y uso estratégico de cada color.
  * **RF-17:** Mostrar ejemplos de marcas reales (*Aesop, Vanguard L., Kurasu*) y explicar el motivo de elección del tono.
* **Requisitos No Funcionales Asociados:** **RNF-03** (Curva de aprendizaje mínima).
* **Campos de Base de Datos Impactados:** Catálogo estático/dinámico de psicología de marcas.

#### 🛠️ Tareas Backend / Lógica a Realizar:
1. **Mapeo Dinámico de Significados Cromáticos**:
   * Crear un catálogo de datos (`lib/data/colorPsychology.ts`) que contenga la narrativa, las emociones asociadas (ej. *Estabilidad, Renovación, Calma*) y las marcas de referencia para cada rango de color (Verde, Azul, Rojo, Amarillo, etc.).
2. **Conexión con el Color Seleccionado**:
   * Cuando el usuario cambie el color base en la rueda, actualizar la vista de `psychology.tsx` para mostrar la narrativa y los casos de marcas que corresponden al color activo (**RF-16**, **RF-17**).

---

### ✍️ Módulo 4: Pantalla de Naming y Estrategia (`src/app/naming.tsx`)

Este módulo proporciona el laboratorio interactivo para evaluar el nombre de la marca, recomendar la tipografía adecuada y guardar el perfil del negocio.

* **Requisitos Funcionales Asociados:**
  * **RF-01:** Selección y almacenamiento de perfil de usuario (Diseñador vs. Microempresario).
  * **RF-02:** Adaptación de herramientas según el perfil.
  * **RF-23:** Guía y laboratorio interactivo de Naming.
* **Requisitos No Funcionales Asociados:** **RNF-03** (Minimalismo y cero jerga técnica).
* **Campos de Base de Datos Impactados:** Tabla **`public.perfiles`** (`id`, `nombre_marca`, `rubro`, `rol`).

#### 🛠️ Tareas Backend / Lógica a Realizar:
1. **Algoritmo de Evaluador de Naming ("Health Check Score 0-100")**:
   * Evaluar la longitud del nombre escrito en tiempo real: si es $< 8$ letras suma máximo puntaje de brevedad.
   * Evaluar fonética y terminación fluida.
   * Calcular y retornar el puntaje total ($0$ a $100$) y el color del badge (**RF-23**).
2. **Recomendador Tipográfico por Rubro (Typography Match)**:
   * Al seleccionar el rubro (*Cosmética, Tech, Gastronomía, Estudio*), cambiar dinámicamente la clase de fuente (`Playfair Display` vs `Inter`) en la previsualización.
3. **Persistencia del Perfil en Supabase (`lib/services/authService.ts`)**:
   * Implementar `saveUserProfile()`: Guardar o actualizar automáticamente los campos `nombre_marca` y `rubro` en la tabla **`public.perfiles`** vinculados al `usuario_id` anónimo de la sesión activa (**RF-01**, **RF-02**).

---

### 🔐 Módulo 5: Configuración Core de Infraestructura y Base de Datos

Módulo transversal para el funcionamiento de todo el proyecto.

* **Requisitos No Funcionales Asociados:** **RNF-08** (Fricción cero), **RNF-10** (Conexiones HTTPS seguras).
* **Tablas Impactadas:** `public.perfiles` y `public.paletas`.

#### 🛠️ Tareas Backend / Lógica a Realizar:
1. **Cliente Supabase para React Native (`lib/supabase.ts`)**:
   * Configurar `@supabase/supabase-js` con `AsyncStorage` para almacenar el token JWT de la sesión.
2. **Inicialización de Sesiones Anónimas (`authService.ts`)**:
   * Ejecutar `supabase.auth.signInAnonymously()` al abrir la app. Si es un usuario nuevo, crear automáticamente su fila correspondiente en `public.perfiles`.

---

## Resumen de Tareas para el Equipo

| Pantalla / Módulo | Archivo de Pantalla | Archivo Backend a Crear / Modificar | Requisitos Funcionales | Tabla Supabase |
| :--- | :--- | :--- | :--- | :--- |
| **1. Paleta de Color** | `src/app/index.tsx` | `lib/colorEngine.ts`, `lib/services/paletteService.ts` | RF-03, 04, 05, 07, 10, 20 | `public.paletas` |
| **2. Mockups & Contraste** | `src/app/mockups.tsx` | `lib/colorEngine.ts` | RF-11, RF-12, RF-13 | Lectura de paleta activa |
| **3. Psicología del Color** | `src/app/psychology.tsx` | `lib/data/colorPsychology.ts` | RF-16, RF-17 | Catálogo cromático |
| **4. Naming & Estrategia** | `src/app/naming.tsx` | `lib/services/authService.ts` | RF-01, RF-02, RF-23 | `public.perfiles` |
| **5. Core Infraestructura** | `_layout.tsx` | `lib/supabase.ts` | RNF-08, RNF-10 | `auth.users` |
