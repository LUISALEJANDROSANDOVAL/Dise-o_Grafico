import chroma from 'chroma-js';

export interface BrandCase {
  title: string;
  category: string;
  imageUri: string;
}

export interface ColorPsychology {
  name: string;
  hex: string;
  headline: string;
  paragraphs: string[];
  emotions: string[];
  brands: BrandCase[];
}

// Catálogo base de psicología del color
export const COLOR_PSYCHOLOGY_CATALOG: ColorPsychology[] = [
  {
    name: 'Rojo',
    hex: '#E53935',
    headline: 'Urgencia, Pasión y Disrupción.',
    paragraphs: [
      'El rojo es el color de mayor impacto fisiológico. Acelera el pulso y llama a la acción inmediata. En contextos de marca, comunica energía, audacia y un espíritu disruptivo que no teme ser el centro de atención.',
      'No es un tono para pasar desapercibido; es una declaración de poder, velocidad y pasión visceral. Ideal para marcas deportivas, entretenimiento y consumo rápido.'
    ],
    emotions: ['Energía', 'Pasión', 'Urgencia', 'Poder', 'Audacia'],
    brands: [
      {
        title: 'Netflix',
        category: 'Entretenimiento',
        imageUri: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80'
      },
      {
        title: 'Supreme',
        category: 'Streetwear',
        imageUri: 'https://images.unsplash.com/photo-1579762593175-20226054cad0?w=800&q=80'
      }
    ]
  },
  {
    name: 'Naranja',
    hex: '#FF8000',
    headline: 'Optimismo, Accesibilidad y Movimiento.',
    paragraphs: [
      'El naranja combina la energía del rojo con la calidez del amarillo. Es el tono por excelencia de la sociabilidad, el entusiasmo y la accesibilidad, derribando barreras entre la marca y el usuario.',
      'Su uso estratégico sugiere innovación asequible, juventud y un enfoque lúdico o dinámico en industrias que a menudo pueden parecer rígidas.'
    ],
    emotions: ['Optimismo', 'Sociabilidad', 'Entusiasmo', 'Creatividad', 'Accesibilidad'],
    brands: [
      {
        title: 'Hermès',
        category: 'Lujo de Herencia',
        imageUri: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80'
      },
      {
        title: 'Strava',
        category: 'Deporte & Comunidad',
        imageUri: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80'
      }
    ]
  },
  {
    name: 'Amarillo',
    hex: '#FDD835',
    headline: 'Claridad, Alegría y Advertencia.',
    paragraphs: [
      'El amarillo es el primer color que el ojo humano procesa. Refleja la luz y comunica un optimismo radiante, claridad mental y una alerta amigable.',
      'En dosis altas puede fatigar, pero usado estratégicamente, infunde vitalidad, esperanza y frescura en la narrativa de la marca.'
    ],
    emotions: ['Alegría', 'Claridad', 'Atención', 'Esperanza', 'Frescura'],
    brands: [
      {
        title: 'IKEA',
        category: 'Hogar & Diseño',
        imageUri: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'
      },
      {
        title: 'National Geographic',
        category: 'Exploración',
        imageUri: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=800&q=80'
      }
    ]
  },
  {
    name: 'Verde Bosque',
    hex: '#2A4B3C',
    headline: 'Naturaleza, Equilibrio y Crecimiento.',
    paragraphs: [
      'Este tono evoca la quietud inalterable de los bosques densos y la vitalidad silenciosa de la flora en crecimiento. Comunica una estabilidad institucional, una conexión auténtica y enraizada con el entorno.',
      'No es un tono de urgencia ni de innovación disruptiva; es una afirmación serena de presencia, herencia y salud perdurable. Es el color de la confianza madura.'
    ],
    emotions: ['Estabilidad', 'Renovación', 'Prosperidad', 'Calma', 'Herencia'],
    brands: [
      {
        title: 'Aesop',
        category: 'Cosmética Botánica',
        imageUri: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80'
      },
      {
        title: 'Vanguard L.',
        category: 'Gestión Patrimonial',
        imageUri: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800&q=80'
      },
      {
        title: 'Kurasu',
        category: 'Gastronomía Consciente',
        imageUri: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80'
      }
    ]
  },
  {
    name: 'Azul',
    hex: '#0080FF',
    headline: 'Confianza, Inteligencia y Espacio.',
    paragraphs: [
      'El azul domina el panorama corporativo por su universalidad. Evoca la inmensidad del cielo y el océano, promoviendo una sensación de seguridad, lógica y comunicación clara.',
      'Es el antídoto contra la ansiedad; una marca azul promete fiabilidad tecnológica, integridad financiera o profesionalismo inquebrantable.'
    ],
    emotions: ['Confianza', 'Lógica', 'Seguridad', 'Serenidad', 'Profesionalismo'],
    brands: [
      {
        title: 'IBM',
        category: 'Tecnología',
        imageUri: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'
      },
      {
        title: 'American Express',
        category: 'Servicios Financieros',
        imageUri: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80'
      }
    ]
  },
  {
    name: 'Púrpura',
    hex: '#8E24AA',
    headline: 'Imaginación, Lujo y Misterio.',
    paragraphs: [
      'Históricamente asociado a la realeza por la rareza de su pigmento, el púrpura combina la estabilidad del azul con la energía del rojo. Es el color de la introspección profunda y la creatividad ilimitada.',
      'Funciona excepcionalmente bien para marcas que venden experiencias sensoriales exclusivas, sabiduría esotérica o productos de vanguardia artística.'
    ],
    emotions: ['Imaginación', 'Lujo', 'Misterio', 'Sabiduría', 'Exclusividad'],
    brands: [
      {
        title: 'Cadbury',
        category: 'Chocolatería Premium',
        imageUri: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80'
      },
      {
        title: 'Twitch',
        category: 'Entretenimiento Digital',
        imageUri: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80'
      }
    ]
  },
  {
    name: 'Rosa',
    hex: '#FF0080',
    headline: 'Empatía, Cuidado y Subversión.',
    paragraphs: [
      'Lejos de los estereotipos, el rosa contemporáneo es una fuerza de disrupción amable. Evoca empatía genuina, cuidado personal y, en sus tonos más brillantes, una audacia irreverente.',
      'Es la elección de marcas que quieren suavizar industrias tradicionalmente frías, o marcas que apuestan por la autoexpresión sin disculpas.'
    ],
    emotions: ['Empatía', 'Cuidado', 'Audacia', 'Romance', 'Autoexpresión'],
    brands: [
      {
        title: 'Glossier',
        category: 'Belleza Moderna',
        imageUri: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80'
      },
      {
        title: 'T-Mobile',
        category: 'Telecomunicaciones',
        imageUri: 'https://images.unsplash.com/photo-1520869562399-e772f042f422?w=800&q=80'
      }
    ]
  }
];

/**
 * Función que encuentra la psicología más cercana a un color dado en formato HEX.
 * Utiliza Chroma.js para calcular la distancia de color.
 */
export function getPsychologyForColor(hexColor: string): ColorPsychology {
  try {
    let minDistance = Infinity;
    let closestPsychology = COLOR_PSYCHOLOGY_CATALOG[3]; // Default a Verde Bosque

    for (const psych of COLOR_PSYCHOLOGY_CATALOG) {
      // Usamos la distancia CIE76 en el espacio Lab para mayor precisión perceptual humana
      const distance = chroma.distance(hexColor, psych.hex, 'lab');
      if (distance < minDistance) {
        minDistance = distance;
        closestPsychology = psych;
      }
    }

    return closestPsychology;
  } catch (e) {
    return COLOR_PSYCHOLOGY_CATALOG[3];
  }
}
