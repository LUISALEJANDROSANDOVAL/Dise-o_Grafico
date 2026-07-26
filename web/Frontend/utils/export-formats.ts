import { type Swatch, hexToRgb } from "@/lib/color"

/**
 * Genera y descarga un archivo .css con variables para :root.
 */
export function downloadCSS(palette: Swatch[]) {
  let cssContent = `/* Cromatic - Kit Básico de Marca */\n\n:root {\n`
  palette.forEach((swatch, index) => {
    cssContent += `  --color-brand-${index + 1}: ${swatch.hex};\n`
  })
  cssContent += `}\n`

  const blob = new Blob([cssContent], { type: "text/css;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", "paleta-marca.css")
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Genera un bloque de texto que contiene la configuración de colores de Tailwind CSS.
 */
export function generateTailwindConfig(palette: Swatch[]): string {
  let colorsObj = `// Extiende tu archivo tailwind.config.js o tailwind.config.ts\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        brand: {\n`
  
  palette.forEach((swatch, index) => {
    // Creamos una nomenclatura semántica basada en el índice
    const suffix = index === 0 ? "50" : index === 1 ? "100" : index === 2 ? "500" : index === 3 ? "700" : "900"
    colorsObj += `          '${suffix}': '${swatch.hex}', // Color ${index + 1}\n`
  })
  
  colorsObj += `        }\n      }\n    }\n  }\n}`
  return colorsObj
}

/**
 * Genera y descarga un archivo binario .ase (Adobe Swatch Exchange)
 * estructurado bajo el formato oficial de Adobe en Big Endian.
 */
export function downloadASE(palette: Swatch[]) {
  // Encabezado del archivo ASE:
  // - Firma 'ASEF': 4 bytes
  // - Versión: 4 bytes (1.0 -> 0x0001, 0x0000)
  // - Cantidad de bloques: 4 bytes
  // Total encabezado = 12 bytes
  
  let totalBytes = 12
  const blocks: { name: string; rgb: { r: number; g: number; b: number } }[] = []
  
  palette.forEach((swatch, idx) => {
    const name = `Color ${idx + 1}`
    const rgb = hexToRgb(swatch.hex)
    blocks.push({ name, rgb })
    
    // Cada bloque de color tiene:
    // - Tipo de bloque (Color Entry: 0x0001): 2 bytes
    // - Longitud del bloque de datos: 4 bytes
    // Datos internos:
    //   - Longitud del nombre (incluyendo terminador nulo): 2 bytes
    //   - Nombre codificado en UTF-16 BE (cada caracter ocupa 2 bytes, más el terminador nulo): (name.length + 1) * 2 bytes
    //   - Espacio de color (ej. "RGB "): 4 bytes
    //   - 3 floats IEEE 754 de 4 bytes cada uno: 12 bytes
    //   - Tipo de color (Global: 0): 2 bytes
    const nameLen = name.length + 1 // Incluye el terminador nulo \0
    const blockDataLen = 2 + (nameLen * 2) + 4 + 12 + 2
    totalBytes += 6 + blockDataLen // 6 bytes del tipo de bloque (2) + longitud (4)
  })
  
  const buffer = new ArrayBuffer(totalBytes)
  const view = new DataView(buffer)
  
  let offset = 0
  
  // 1. Escribir Firma 'ASEF'
  view.setUint8(offset++, 0x41) // 'A'
  view.setUint8(offset++, 0x53) // 'S'
  view.setUint8(offset++, 0x45) // 'E'
  view.setUint8(offset++, 0x46) // 'F'
  
  // 2. Escribir versión (major = 1, minor = 0)
  view.setUint16(offset, 1, false)
  offset += 2
  view.setUint16(offset, 0, false)
  offset += 2
  
  // 3. Escribir número de bloques
  view.setUint32(offset, blocks.length, false)
  offset += 4
  
  // 4. Escribir bloques de colores
  blocks.forEach((block) => {
    // Tipo de bloque (Color Entry = 0x0001)
    view.setUint16(offset, 0x0001, false)
    offset += 2
    
    // Calcular longitud de datos
    const nameLen = block.name.length + 1
    const blockDataLen = 2 + (nameLen * 2) + 4 + 12 + 2
    view.setUint32(offset, blockDataLen, false)
    offset += 4
    
    // Longitud del nombre (caracteres + terminador nulo)
    view.setUint16(offset, nameLen, false)
    offset += 2
    
    // Escribir nombre en UTF-16 Big Endian
    for (let i = 0; i < block.name.length; i++) {
      view.setUint16(offset, block.name.charCodeAt(i), false)
      offset += 2
    }
    // Terminador nulo (\0)
    view.setUint16(offset, 0, false)
    offset += 2
    
    // Espacio de color: "RGB " (0x52, 0x47, 0x42, 0x20)
    view.setUint8(offset++, 0x52) // 'R'
    view.setUint8(offset++, 0x47) // 'G'
    view.setUint8(offset++, 0x42) // 'B'
    view.setUint8(offset++, 0x20) // ' '
    
    // Componentes del color en flotantes en el rango [0.0, 1.0] (R, G, B)
    view.setFloat32(offset, block.rgb.r / 255, false)
    offset += 4
    view.setFloat32(offset, block.rgb.g / 255, false)
    offset += 4
    view.setFloat32(offset, block.rgb.b / 255, false)
    offset += 4
    
    // Tipo de color: 0x0000 (Global)
    view.setUint16(offset, 0, false)
    offset += 2
  })
  
  const blob = new Blob([buffer], { type: "application/octet-stream" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", "paleta-marca.ase")
  link.click()
  URL.revokeObjectURL(url)
}
