¡Hola! Como diseñador, te digo que este es un proyecto excelente porque une la precisión del desarrollo técnico con una necesidad real y cotidiana del diseño. Traducir conceptos teóricos del color a una herramienta digital para personas que no son diseñadores es un gran desafío, pero vamos a estructurar esto para que RULEC sea funcional, visualmente impecable y cumpla con todos los requisitos.

## Funciones Requeridas (Según el Documento)

**Círculo Cromático Interactivo**

* El círculo cromático interactivo debe contar con un mínimo de 12 segmentos de color.


* El usuario debe poder arrastrar el círculo de forma libre, ya sea lento, suave o rápido, teniendo control total sobre el giro.


* La plataforma debe permitir fijar un color base y luego elegir el tipo de esquema para ver qué colores le corresponden automáticamente.



**Generación de Esquemas de Color**

* El sistema debe poder generar 6 esquemas de combinación: monocromático, análogo, tríada, complementarios, complementarios extendidos y tétrada.


* Para los microempresarios, se deben usar nombres en lenguaje humano y no técnico como etiqueta principal (ej. "colores que combinan bien").


* Cada esquema generado debe incluir una explicación en una frase de por qué esos colores funcionan juntos.



**Visualización y Aplicación de Paletas**

* Se debe mostrar una visualización clara de la paleta con los colores y su código HEX/RGB para copiarlos o exportarlos.


* La plataforma debe mostrar una vista previa de la paleta aplicada sobre ejemplos reales, como una tarjeta de presentación o una etiqueta de producto simulada.


* El sistema debe lanzar alertas de contraste y legibilidad si dos colores elegidos se leen mal juntos al poner texto sobre fondo.


* Se debe incluir una función para previsualizar cómo se ve la marca en modo oscuro o claro (fondo negro vs. blanco).



**Educación y Psicología del Color**

* Es obligatorio incluir una pestaña o sección educativa donde el usuario aprenda sobre el significado y uso estratégico de cada color.


* La sección debe explicar qué transmite cada color, mostrar ejemplos de marcas reconocidas que lo usan y explicar por qué.


* Se deben incluir recomendaciones de uso de color según el rubro del microempresario.



**Herramientas para Diseñadores y Funciones Globales**

* Los diseñadores gráficos junior deben tener acceso a códigos exactos y copiables al instante (HEX, RGB, CMYK y Pantone).


* Deben contar con control fino sobre matiz, saturación y luminosidad una vez elegido el color base.


* Tienen que poder exportar la paleta en formatos útiles para su flujo de trabajo, como .ase para Adobe o variables CSS.


* La plataforma debe incluir un modo "explicá esta elección" que autogenere un texto corto para justificar la paleta frente al cliente.


* Se debe integrar una simulación de daltonismo para ver la paleta como la vería alguien con protanopia o deuteranopia.


* La herramienta debe permitir compartir la paleta generada mediante un link o código QR sin necesidad de crear una cuenta.



---

## Funciones Adicionales Sugeridas

* **Extracción de color desde una imagen:** Permitir que el usuario suba una foto de inspiración (un paisaje, su local, un producto) y que el sistema detecte el color dominante para ubicarlo automáticamente como "color base" en la rueda.
* **Generador de logo dinámico simple:** Proveer 3 o 4 íconos genéricos (ej. un tenedor para gastronomía, un gancho de ropa para moda) que se coloreen automáticamente con la paleta generada en tiempo real. Esto refuerza mucho la vista previa aplicada para el que no sabe de diseño.
* **Test de "Temperatura" o "Personalidad":** Un filtro visual rápido que le indique al usuario si su paleta seleccionada se percibe como "cálida y enérgica" o "fría y profesional", ayudándole a alinear el diseño con su estrategia de ventas sin necesidad de que lea toda la pestaña de psicología.

---

## Propuesta de Flujo de Usuario (User Flow)

**Paso 1: Pantalla de Bienvenida (Onboarding)**
El usuario ingresa y la plataforma (totalmente *responsive*) le ofrece dos caminos según su perfil:
"Soy diseñador" (acceso directo a la rueda con herramientas técnicas activadas).
"Tengo una marca y no sé por dónde empezar" (acceso al modo guiado).

**Paso 2: Modo Guiado (Cuestionario rápido)**
Si el usuario es microempresario, responde 3 preguntas simples sobre la personalidad de su marca (ej. "¿Tu marca es seria o divertida?"). Basado en esto, el sistema selecciona un color base recomendado por la psicología del color y lo lleva a la rueda.

**Paso 3: Interacción Central (La Rueda)**
El usuario interactúa con la interfaz principal. Arrastra el círculo cromático manualmente, define su color y selecciona las combinaciones (usando botones con nombres amigables como "Colores de Alto Contraste").

**Paso 4: Validación y Vista Previa**
Debajo de la rueda, la paleta seleccionada aparece aplicada en tiempo real sobre los *mockups* (tarjetas, aplicaciones). Si eligen un amarillo claro para texto sobre un fondo blanco, salta la alerta de legibilidad para que ajusten la selección.

**Paso 5: Respaldo Educativo**
Mediante una pestaña lateral o un botón siempre visible, el usuario entra a la sección de "Psicología del color" para validar que los colores que eligió realmente comunican el mensaje de su rubro, viendo ejemplos de otras marcas exitosas.

**Paso 6: Guardado y Exportación**
Una vez conforme, el usuario hace clic en "Exportar". El microempresario descarga un PDF simple con su "kit básico" o genera un código QR para mandárselo a su socio por WhatsApp. Si es diseñador, exporta las variables CSS o el archivo para Adobe Illustrator.

¿Te gustaría que profundicemos en cómo estructurar visualmente esa pantalla principal de la rueda para que no se sienta recargada de información para los microempresarios?