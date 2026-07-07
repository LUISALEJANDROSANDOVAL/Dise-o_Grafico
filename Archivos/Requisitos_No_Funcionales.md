# Requisitos No Funcionales - Proyecto RULEC

Este documento describe los atributos de calidad, restricciones técnicas y de diseño que debe cumplir la plataforma RULEC, garantizando una excelente experiencia de usuario.

## 1. Usabilidad y Experiencia de Usuario (UX/UI)
- **RNF-01 (Responsividad):** La plataforma debe ser 100% *responsive* adaptándose perfectamente a dispositivos móviles, dado que los microempresarios (uno de los públicos objetivo) suelen gestionar sus marcas desde el celular.
- **RNF-02 (Accesibilidad):** El sistema debe cumplir con pautas de accesibilidad, asegurando que las alertas de contraste visual y las herramientas de simulación de daltonismo funcionen sin fricciones.
- **RNF-03 (Curva de Aprendizaje Mínima):** La interfaz para el "Modo Guiado" (Microempresario) debe ser minimalista y autoexplicativa, evitando la jerga técnica innecesaria.

## 2. Rendimiento y Fluidez
- **RNF-04 (Renderizado del Círculo):** El giro y arrastre del círculo cromático interactivo debe renderizarse de manera fluida (idealmente a 60 FPS) sin interrupciones, ofreciendo sensación de control físico.
- **RNF-05 (Actualización en Tiempo Real):** La generación de esquemas, los cambios en los colores y su aplicación en los mockups deben procesarse de forma instantánea (tiempo de respuesta < 100ms) a medida que el usuario ajusta el color base.
- **RNF-06 (Carga Rápida):** El acceso inicial a la plataforma y las vistas guiadas deben cargar en menos de 2 segundos, incluso en redes móviles estándar.

## 3. Arquitectura y Compatibilidad
- **RNF-07 (Navegadores Soportados):** La aplicación web debe ser compatible con las últimas versiones de navegadores web modernos (Chrome, Safari, Firefox, Edge).
- **RNF-08 (Fricción Cero):** La arquitectura del sistema debe permitir que las funciones core (generar paletas, exportar PDF, compartir por QR o link) operen completamente sin requerir registro en una base de datos o cuentas de usuario.

## 4. Seguridad y Tratamiento de Datos
- **RNF-09 (Procesamiento de Imágenes):** La función de "Extracción de color desde imagen" debe preferentemente procesar la imagen de forma local en el navegador del usuario, o eliminarla de inmediato del servidor para mantener la privacidad de los datos cargados y abaratar costos de infraestructura.
- **RNF-10 (Conexiones Seguras):** Si bien no requiere cuentas, la plataforma debe utilizar protocolo HTTPS para toda la navegación y generación de enlaces de compartir.

## 5. Mantenibilidad y Diseño Frontend
- **RNF-11 (Escalabilidad de Componentes):** El código debe desarrollarse bajo una arquitectura basada en componentes (ej. React, Vue, Svelte) que permita actualizar fácilmente los "mockups dinámicos", añadir más ejemplos a la sección educativa o escalar a nuevos modelos de exportación en el futuro.
