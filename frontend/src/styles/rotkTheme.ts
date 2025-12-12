/**
 * Romance of the Three Kingdoms (ROTK) Theme
 * 
 * A comprehensive theme system inspired by Chinese period-piece aesthetics
 * (Han–Three Kingdoms era) featuring lacquered wood, carved bronze, jade
 * accents, silk banners, and ink-brush textures.
 * 
 * @see docs/UI_STYLE_GUIDE.md for complete documentation
 */

// ============================================
// COLOR PALETTE
// ============================================

export const rotkColors = {
  // Primary Ornamental Colors
  gold: '#D4AF37',
  goldLight: '#F5D48A',
  goldDark: '#B8960F',
  bronze: '#CD7F32',
  bronzeLight: '#E6A55C',
  bronzeDark: '#A66628',

  // Cinnabar / Lacquer Reds
  cinnabar: '#C41E3A',
  cinnabarLight: '#E85C73',
  cinnabarDark: '#8B0000',
  lacquer: '#990000',

  // Jade Greens
  jade: '#00A86B',
  jadeLight: '#3FD99B',
  jadeDark: '#006B3F',
  
  // Ink / Neutrals
  inkBlack: '#1A1A1A',
  charcoal: '#2D2D2D',
  inkGray: '#424242',
  inkWash: '#757575',
  
  // Parchment / Paper
  parchment: '#FDF6E3',
  parchmentAged: '#D4C5A9',
  parchmentDark: '#BEB19A',
  
  // Cool Blue (Secondary)
  coolBlue: '#4682B4',
  coolBlueLight: '#6FA3CF',
  coolBlueDark: '#2E5C7B',

  // Status Colors
  hp: '#8B0000',
  hpLight: '#CC3333',
  ae: '#4169E1',
  aeLight: '#6B8DEF',
  guard: '#C0C0C0',
  strain: '#DAA520',
  strainLight: '#F0C040',

  // Ghost / Spirit (for effects)
  ghostWhite: '#E8E8E8',
  boneWhite: '#F5F5DC',
};

// ============================================
// GRADIENTS
// ============================================

export const rotkGradients = {
  gold: 'linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)',
  goldHorizontal: 'linear-gradient(90deg, #CD7F32 0%, #D4AF37 50%, #CD7F32 100%)',
  goldShimmer: 'linear-gradient(90deg, #D4AF37 0%, #F5D48A 25%, #D4AF37 50%, #F5D48A 75%, #D4AF37 100%)',
  cinnabar: 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)',
  cinnabarVertical: 'linear-gradient(180deg, #C41E3A 0%, #8B0000 100%)',
  jade: 'linear-gradient(135deg, #00A86B 0%, #006B3F 100%)',
  parchment: 'linear-gradient(135deg, #FDF6E3 0%, #D4C5A9 100%)',
  parchmentVertical: 'linear-gradient(180deg, #FDF6E3 0%, #D4C5A9 100%)',
  ink: 'linear-gradient(180deg, #1A1A1A 0%, #424242 50%, #757575 100%)',
  inkRadial: 'radial-gradient(ellipse at center, #2D2D2D 0%, #1A1A1A 100%)',
  
  // Bar gradients
  hpBar: 'linear-gradient(90deg, #8B0000 0%, #CC3333 50%, #8B0000 100%)',
  aeBar: 'linear-gradient(90deg, #4169E1 0%, #6B8DEF 50%, #4169E1 100%)',
  guardBar: 'linear-gradient(90deg, #A0A0A0 0%, #C0C0C0 50%, #A0A0A0 100%)',
  strainBar: 'linear-gradient(90deg, #B8860B 0%, #DAA520 50%, #B8860B 100%)',
};

// ============================================
// TYPOGRAPHY
// ============================================

export const rotkTypography = {
  fontFamily: {
    heading: '"Cinzel", Georgia, "Times New Roman", serif',
    headingCjk: '"Noto Serif SC", SimSun, serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "Courier New", monospace',
    damage: '"Cinzel", Georgia, serif',
  },
  fontSize: {
    xs: '0.75rem',     // 12px - Chip labels, micro text
    sm: '0.875rem',    // 14px - Secondary labels, tooltips
    base: '1rem',      // 16px - Body text, stat values
    lg: '1.25rem',     // 20px - Section headers
    xl: '1.5rem',      // 24px - Panel titles
    '2xl': '2rem',     // 32px - Character names
    '3xl': '2.5rem',   // 40px - Damage numbers
    '4xl': '3rem',     // 48px - Critical damage
    '5xl': '4rem',     // 64px - Victory/Defeat text
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};

// ============================================
// SPACING
// ============================================

export const rotkSpacing = {
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem', // 40px
  12: '3rem',   // 48px
  16: '4rem',   // 64px
  20: '5rem',   // 80px
};

// ============================================
// BORDERS & RADIUS
// ============================================

export const rotkBorders = {
  width: {
    sm: '1px',
    md: '2px',
    lg: '3px',
    xl: '4px',
  },
  radius: {
    none: '0',
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },
};

// ============================================
// SHADOWS & ELEVATION
// ============================================

export const rotkShadows = {
  // Panel shadows
  base: '0 2px 4px rgba(0,0,0,0.1)',
  raised: '0 4px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)',
  elevated: '0 8px 16px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1)',
  floating: '0 16px 32px rgba(0,0,0,0.25), 0 8px 16px rgba(0,0,0,0.15)',
  
  // Inner shadows
  inner: 'inset 0 2px 4px rgba(0,0,0,0.06)',
  innerDeep: 'inset 0 4px 8px rgba(0,0,0,0.1)',
  
  // Glow effects
  goldGlow: '0 0 10px rgba(212, 175, 55, 0.4), 0 0 20px rgba(212, 175, 55, 0.2)',
  cinnabarGlow: '0 0 10px rgba(196, 30, 58, 0.4), 0 0 20px rgba(196, 30, 58, 0.2)',
  jadeGlow: '0 0 10px rgba(0, 168, 107, 0.4), 0 0 20px rgba(0, 168, 107, 0.2)',
  
  // Text shadows
  textDark: '0 2px 4px rgba(0,0,0,0.5)',
  textLight: '0 1px 2px rgba(255,255,255,0.5)',
};

// ============================================
// ANIMATION
// ============================================

export const rotkAnimation = {
  duration: {
    fast: '150ms',
    base: '250ms',
    slow: '400ms',
    shimmer: '3s',
  },
  easing: {
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// ============================================
// Z-INDEX LAYERS
// ============================================

export const rotkZIndex = {
  base: 0,
  hud: 10,
  dropdown: 20,
  sticky: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  notification: 70,
  overlay: 80,
};

// ============================================
// COMPONENT TOKENS
// ============================================

export const rotkComponents = {
  // Panel variants
  panel: {
    parchment: {
      background: rotkGradients.parchment,
      border: `2px solid ${rotkColors.bronze}`,
      borderRadius: rotkBorders.radius.md,
      shadow: rotkShadows.raised,
      padding: rotkSpacing[6],
    },
    lacquer: {
      background: rotkGradients.cinnabar,
      border: `2px solid ${rotkColors.gold}`,
      borderRadius: rotkBorders.radius.md,
      shadow: rotkShadows.raised,
      padding: rotkSpacing[6],
    },
    ink: {
      background: rotkColors.inkBlack,
      border: `1px solid ${rotkColors.bronze}`,
      borderRadius: rotkBorders.radius.md,
      shadow: rotkShadows.elevated,
      padding: rotkSpacing[6],
    },
  },
  
  // Button variants
  button: {
    primary: {
      background: rotkGradients.cinnabar,
      color: rotkColors.parchment,
      border: `2px solid ${rotkColors.gold}`,
      hoverBackground: rotkColors.cinnabarLight,
      activeBackground: rotkColors.cinnabarDark,
      disabledBackground: rotkColors.inkGray,
    },
    secondary: {
      background: rotkGradients.parchment,
      color: rotkColors.inkBlack,
      border: `2px solid ${rotkColors.bronze}`,
      hoverBackground: rotkColors.parchmentAged,
      activeBackground: rotkColors.parchmentDark,
      disabledBackground: rotkColors.inkWash,
    },
    gold: {
      background: rotkGradients.gold,
      color: rotkColors.inkBlack,
      border: `2px solid ${rotkColors.goldDark}`,
      hoverBackground: rotkColors.goldLight,
      activeBackground: rotkColors.goldDark,
      disabledBackground: rotkColors.inkGray,
    },
  },
  
  // Status bar
  bar: {
    hp: {
      background: rotkColors.charcoal,
      fill: rotkGradients.hpBar,
      border: `1px solid ${rotkColors.bronze}`,
    },
    ae: {
      background: rotkColors.charcoal,
      fill: rotkGradients.aeBar,
      border: `1px solid ${rotkColors.bronze}`,
    },
    guard: {
      background: rotkColors.charcoal,
      fill: rotkGradients.guardBar,
      border: `1px solid ${rotkColors.bronze}`,
    },
    strain: {
      background: rotkColors.charcoal,
      fill: rotkGradients.strainBar,
      border: `1px solid ${rotkColors.bronze}`,
    },
  },
  
  // Chips
  chip: {
    buff: {
      background: rotkColors.jade,
      color: rotkColors.parchment,
      border: `1px solid ${rotkColors.jadeDark}`,
    },
    debuff: {
      background: rotkColors.cinnabarDark,
      color: rotkColors.parchment,
      border: `1px solid ${rotkColors.lacquer}`,
    },
    neutral: {
      background: rotkColors.coolBlue,
      color: rotkColors.parchment,
      border: `1px solid ${rotkColors.coolBlueDark}`,
    },
  },
  
  // Building pin
  buildingPin: {
    default: {
      background: rotkColors.parchment,
      border: `3px solid ${rotkColors.bronze}`,
      shadow: rotkShadows.raised,
    },
    hover: {
      border: `3px solid ${rotkColors.gold}`,
      shadow: rotkShadows.goldGlow,
      scale: 1.05,
    },
    selected: {
      background: rotkColors.cinnabar,
      border: `3px solid ${rotkColors.gold}`,
      color: rotkColors.parchment,
    },
    disabled: {
      opacity: 0.6,
      filter: 'grayscale(1)',
    },
  },
  
  // Navigation tab
  navTab: {
    default: {
      background: rotkGradients.parchment,
      color: rotkColors.inkBlack,
      border: `2px solid ${rotkColors.bronze}`,
    },
    hover: {
      border: `2px solid ${rotkColors.gold}`,
      shadow: rotkShadows.goldGlow,
    },
    selected: {
      background: rotkGradients.cinnabar,
      color: rotkColors.parchment,
      border: `2px solid ${rotkColors.gold}`,
    },
  },
};

// ============================================
// COMPLETE THEME OBJECT
// ============================================

export const rotkTheme = {
  colors: rotkColors,
  gradients: rotkGradients,
  typography: rotkTypography,
  spacing: rotkSpacing,
  borders: rotkBorders,
  shadows: rotkShadows,
  animation: rotkAnimation,
  zIndex: rotkZIndex,
  components: rotkComponents,
};

export default rotkTheme;
