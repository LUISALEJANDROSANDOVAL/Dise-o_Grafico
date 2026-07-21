---
name: Premium Branding Assistant
colors:
  surface: '#fff8f1'
  surface-dim: '#dfd9d2'
  surface-bright: '#fff8f1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f3eb'
  surface-container: '#f3ede6'
  surface-container-high: '#ede7e0'
  surface-container-highest: '#e7e2db'
  on-surface: '#1d1b17'
  on-surface-variant: '#4c463f'
  inverse-surface: '#32302c'
  inverse-on-surface: '#f6f0e9'
  outline: '#7e766e'
  outline-variant: '#cfc5bc'
  surface-tint: '#645d57'
  primary: '#0b0704'
  on-primary: '#ffffff'
  primary-container: '#241f1a'
  on-primary-container: '#8e867f'
  inverse-primary: '#cfc5bd'
  secondary: '#605e59'
  on-secondary: '#ffffff'
  secondary-container: '#e6e2db'
  on-secondary-container: '#66645f'
  tertiary: '#07080b'
  on-tertiary: '#ffffff'
  tertiary-container: '#1f2023'
  on-tertiary-container: '#87878b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ebe1d8'
  primary-fixed-dim: '#cfc5bd'
  on-primary-fixed: '#201b16'
  on-primary-fixed-variant: '#4c4640'
  secondary-fixed: '#e6e2db'
  secondary-fixed-dim: '#c9c6c0'
  on-secondary-fixed: '#1c1c18'
  on-secondary-fixed-variant: '#484742'
  tertiary-fixed: '#e3e2e6'
  tertiary-fixed-dim: '#c7c6ca'
  on-tertiary-fixed: '#1a1b1e'
  on-tertiary-fixed-variant: '#46474a'
  background: '#fff8f1'
  on-background: '#1d1b17'
  surface-variant: '#e7e2db'
  paper-bg: '#FAF6EF'
  ink-text: '#241F1A'
  border-subtle: rgba(36, 31, 26, 0.08)
  accent-warm: '#D9D2C5'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  button-text:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  touch-target: 44px
  margin-mobile: 20px
  margin-desktop: 64px
  gutter: 24px
  section-gap: 80px
---

## Brand & Style

This design system is built for an elite tier of micro-entrepreneurs and professional designers who value precision, editorial quality, and quiet luxury. The brand personality is authoritative yet approachable, mirroring the experience of walking into a high-end design atelier. 

The aesthetic is **Ultra-Minimalist** with a **Tactile/Paper** influence. It draws heavily from the Apple/Linear school of thought: reducing visual noise to the absolute minimum so that content—the user's brand identity—remains the focal point. The interface should feel "expensive" through its restraint, utilizing generous whitespace (negative space) as a structural element rather than a void. The emotional response should be one of calm, clarity, and confidence.

## Colors

The palette is rooted in a "Physical Material" philosophy, moving away from sterile digital whites toward a warm, organic paper-like experience. 

- **Primary:** The dark charcoal (#241F1A) serves as our "Ink." It is used for all high-emphasis text and primary actions to ensure maximum contrast and legibility.
- **Secondary:** The warm paper (#FAF6EF) is the canvas. It reduces eye strain compared to pure white and adds a sophisticated, tactile depth.
- **Accents:** Use secondary tones of the background (#D9D2C5) for subtle groupings or inactive states. 
- **Borders:** Borders should be crisp and nearly invisible, using low-opacity versions of the Ink color to maintain a light, airy feel.

## Typography

The typography strategy relies on the tension between a high-end serif and a functional sans-serif.

- **Headlines:** Use Playfair Display for all major headings and display text. It provides the "editorial" feel of a branding agency. Keep tracking (letter spacing) tight on larger sizes to maintain a sense of precision.
- **UI & Body:** Inter is used for all functional elements, long-form text, and labels. It ensures clarity at small sizes and maintains a modern, neutral tone.
- **Spanish Language Nuance:** Ensure line heights are generous (1.5x for body text) to accommodate the slightly longer word lengths and frequent use of ascenders/descenders in Spanish.
- **Labels:** Use uppercase Inter with increased letter spacing for small metadata or section headers to create a "technical" contrast against the serif headlines.

## Layout & Spacing

The layout is governed by a **Fixed Grid** on desktop (1200px max-width) and a **Fluid Fluid** on mobile. 

- **Rhythm:** All spacing must be a multiple of 4px. Use extreme vertical rhythm (section-gap) to separate distinct tasks or topics, creating a sense of luxury through "wasted" space.
- **Touch Targets:** A strict 44pt minimum height/width for all interactive elements is required to meet professional accessibility standards and provide a premium, effortless interaction feel.
- **Margins:** Desktop layouts should feel centered and purposeful with significant side margins (64px+). Mobile layouts should maintain a 20px "safe zone" from the edge of the screen.

## Elevation & Depth

This system avoids heavy shadows and traditional 3D effects. Depth is communicated through **Tonal Layers** and **Crisp Outlines**.

- **Surfaces:** Use slightly different shades of the "Paper" background to indicate stacking. A modal or popover should have a 1px border (#241F1A at 8% opacity) rather than a heavy shadow.
- **Subtle Depth:** If a shadow is absolutely necessary for context (e.g., a floating action button), use a very large blur (24px+) with extremely low opacity (4-6%) tinted with the Ink color.
- **Active States:** Instead of raising an element, indicate interaction through subtle color shifts or high-contrast fills.

## Shapes

The shape language is "Architectural." We use **Soft (0.25rem)** roundedness for standard UI components like inputs and small buttons. Larger containers like cards or panels may use **rounded-lg (0.5rem)**.

Avoid pill-shaped or overly circular buttons, as they feel too "consumer-grade" and casual for this professional branding context. The slight rounding is intended only to take the "edge" off the minimalism, making it feel approachable rather than clinical.

## Components

- **Buttons:** Primary buttons use a solid Ink (#241F1A) fill with Paper (#FAF6EF) text. Secondary buttons use a transparent background with a 1px border. All buttons must adhere to the 44px height rule.
- **Input Fields:** Use a minimal approach—only a bottom border or a very light 4-sided border. Focus states should transition the border to a solid 1px Ink line. Labels sit above the field in "label-caps" style.
- **Cards:** No shadows. Use a subtle background shift (a shade darker or lighter than the main paper color) or a fine 1px border.
- **Chips/Tags:** Use a "Label" typography style with 4px of rounding and a very light accent-warm fill.
- **Lists:** Use generous padding (16px vertical) between list items with a 1px border-subtle separator.
- **Progressive Disclosure:** Use clean icons (20px) and serif sub-headers to guide the user through complex branding workflows without overwhelming them.