import { type Swatch, hexToRgb } from "./color"

/**
 * Generates an Adobe Swatch Exchange (.ase) file.
 * Wraps all colors in a named group for maximum Photoshop compatibility.
 *
 * Structure:
 *   Header  → ASEF + version 1.0 + block count
 *   Block 1 → Group Start  (type 0xC001)
 *   Block 2…N → Color Entry (type 0x0001)
 *   Block N+1 → Group End   (type 0xC002)
 */
export function generateASE(palette: Swatch[]): Blob {
  // --- helpers -----------------------------------------------------------
  /** Byte length of a UTF-16BE encoded string including its null terminator */
  const utf16Bytes = (s: string) => (s.length + 1) * 2

  const groupName = "CROMATIC Palette"
  // Total blocks = 1 group-start + N colors + 1 group-end
  const blockCount = palette.length + 2

  // Pre-calculate the total byte length of the file body (everything after the 12-byte header)
  let bodyLength = 0

  // Group Start block: type(2) + size(4) + nameLen(2) + nameUtf16
  const groupStartDataSize = 2 + utf16Bytes(groupName)
  bodyLength += 2 + 4 + groupStartDataSize

  // Color blocks
  palette.forEach((_s, i) => {
    const name = `Color ${i + 1}`
    const colorDataSize = 2 + utf16Bytes(name) + 4 + 12 + 2  // nameLen + name + model + 3 floats + type
    bodyLength += 2 + 4 + colorDataSize
  })

  // Group End block: type(2) + size(4) + 0 bytes of data
  bodyLength += 2 + 4

  // Allocate buffer: 12-byte header + body
  const buf = new ArrayBuffer(12 + bodyLength)
  const v = new DataView(buf)
  let o = 0 // write offset

  // --- Header -------------------------------------------------------------
  // Signature "ASEF"
  v.setUint8(o++, 0x41) // A
  v.setUint8(o++, 0x53) // S
  v.setUint8(o++, 0x45) // E
  v.setUint8(o++, 0x46) // F
  // Version 1.0
  v.setUint16(o, 1, false); o += 2   // major
  v.setUint16(o, 0, false); o += 2   // minor
  // Block count
  v.setUint32(o, blockCount, false); o += 4

  // --- Group Start --------------------------------------------------------
  v.setUint16(o, 0xC001, false); o += 2          // block type
  v.setUint32(o, groupStartDataSize, false); o += 4 // data size
  // Name length (chars including null)
  v.setUint16(o, groupName.length + 1, false); o += 2
  // Name in UTF-16 BE
  for (let i = 0; i < groupName.length; i++) {
    v.setUint16(o, groupName.charCodeAt(i), false); o += 2
  }
  v.setUint16(o, 0, false); o += 2 // null terminator

  // --- Color Entries ------------------------------------------------------
  palette.forEach((swatch, idx) => {
    const name = `Color ${idx + 1}`
    const dataSize = 2 + utf16Bytes(name) + 4 + 12 + 2

    // Block type: color entry
    v.setUint16(o, 0x0001, false); o += 2
    // Data size
    v.setUint32(o, dataSize, false); o += 4
    // Name length
    v.setUint16(o, name.length + 1, false); o += 2
    // Name UTF-16 BE
    for (let i = 0; i < name.length; i++) {
      v.setUint16(o, name.charCodeAt(i), false); o += 2
    }
    v.setUint16(o, 0, false); o += 2 // null

    // Color model "RGB "
    v.setUint8(o++, 0x52) // R
    v.setUint8(o++, 0x47) // G
    v.setUint8(o++, 0x42) // B
    v.setUint8(o++, 0x20) // space

    // Color values (float32, 0–1 range)
    const { r, g, b } = hexToRgb(swatch.hex)
    v.setFloat32(o, r / 255, false); o += 4
    v.setFloat32(o, g / 255, false); o += 4
    v.setFloat32(o, b / 255, false); o += 4

    // Color type: 0 = Global
    v.setUint16(o, 0, false); o += 2
  })

  // --- Group End ----------------------------------------------------------
  v.setUint16(o, 0xC002, false); o += 2  // block type
  v.setUint32(o, 0, false); o += 4       // 0 bytes of data

  return new Blob([buf], { type: "application/octet-stream" })
}
