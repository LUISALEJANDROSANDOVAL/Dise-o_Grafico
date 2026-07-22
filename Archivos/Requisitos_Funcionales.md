# Requisitos Funcionales - Proyecto RULEC

Este documento describe las funcionalidades específicas que el sistema RULEC debe cumplir, basándose en la estructura principal del proyecto.

## 1. Gestión de Perfiles de Usuario
- **RF-01:** El sistema debe permitir al usuario seleccionar su perfil al inicio: "Diseñador" o "Microempresario" (sin necesidad de crear una cuenta obligatoria).
- **RF-02:** El sistema debe adaptar la interfaz, el lenguaje y las herramientas disponibles según el perfil seleccionado.

## 2. Interacción con el Círculo Cromático
- **RF-03:** El sistema debe mostrar un círculo cromático interactivo con al menos 12 segmentos de color.
- **RF-04:** El usuario debe poder arrastrar y girar el círculo de forma libre y fluida.
- **RF-05:** El sistema debe permitir fijar un "color base" seleccionado en la rueda.
- **RF-06:** El sistema debe ofrecer la extracción automática de un color base a partir de una imagen subida por el usuario.

## 3. Generación de Esquemas de Color
- **RF-07:** El sistema debe calcular y generar automáticamente 6 esquemas de combinación a partir del color base: monocromático, análogo, tríada, complementarios, complementarios extendidos y tétrada.
- **RF-08:** El sistema debe usar etiquetas en "lenguaje humano" para los esquemas en el perfil de microempresario (ej. "colores que combinan bien").
- **RF-09:** El sistema debe autogenerar un texto explicativo (o justificación de diseño) para cada esquema generado de forma dinámica.

## 4. Visualización, Validación y Accesibilidad
- **RF-10:** El sistema debe mostrar los colores de la paleta con sus respectivos códigos (HEX, RGB, CMYK, Pantone).
- **RF-11:** El sistema debe aplicar la paleta generada en tiempo real sobre mockups dinámicos (tarjetas, logos genéricos).
- **RF-12:** El sistema debe evaluar el contraste entre los colores y lanzar alertas de legibilidad si no cumplen los estándares al aplicarse texto sobre fondo.
- **RF-13:** El sistema debe incluir un filtro de simulación de daltonismo (protanopia, deuteranopia) aplicado a la paleta y mockups.
- **RF-14:** El sistema debe incluir un "Test de Temperatura/Personalidad" para evaluar si la paleta elegida se percibe cálida/fría o seria/divertida.
- **RF-15:** El sistema debe permitir alternar entre vista en modo claro y modo oscuro.

## 5. Módulo Educativo (Psicología del Color)
- **RF-16:** El sistema debe contener una sección interactiva que explique el significado y uso estratégico de cada color.
- **RF-17:** El sistema debe mostrar ejemplos de marcas reales que utilizan el color seleccionado y explicar el motivo.
- **RF-18:** El sistema debe incluir un cuestionario rápido guiado para sugerir colores según el rubro o tipo de marca del microempresario.

## 6. Herramientas Avanzadas y Exportación
- **RF-19:** El sistema debe proporcionar controles precisos de matiz, saturación y luminosidad (especial para el perfil diseñador).
- **RF-20:** El sistema debe permitir compartir la paleta generada a través de un enlace único o un código QR (sin registro previo).
- **RF-21:** El sistema debe permitir exportar un PDF simple como "kit básico de marca" (perfil microempresario).
- **RF-22:** El sistema debe permitir exportar la paleta en formatos técnicos (.ase para software Adobe, variables CSS) para el flujo de trabajo del diseñador.

## 7. Módulo Complementario (Estrategia de Marca)
- **RF-23:** El sistema debe incluir una pestaña o guía educativa donde los usuarios (principalmente microempresarios) puedan aprender cómo elegir un nombre adecuado para sus empresas.
- **RF-24:** El sistema debe integrar una herramienta de generación de nombres (Naming) potenciada por Inteligencia Artificial, basada en la descripción del negocio.
- **RF-25:** El sistema debe proporcionar un catálogo interactivo de tipografías (Google Fonts) con categorías, vista previa y búsqueda en tiempo real.
- **RF-26:** El sistema debe incluir un "Asesor Tipográfico" con IA para evaluar si la fuente elegida transmite la percepción correcta según la temática del negocio.
