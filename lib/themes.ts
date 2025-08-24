export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    // Backgrounds
    background: string;
    backgroundSecondary: string;
    cardBackground: string;
    sidebarBackground: string;
    headerBackground: string;
    
    // Text (with proper contrast)
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textInverse: string; // For dark backgrounds
    
    // Interactive Elements
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    
    // Status Colors
    success: string;
    warning: string;
    error: string;
    info: string;
    
    // UI Elements
    hover: string;
    border: string;
    divider: string;
    overlay: string;
    shadow: string;
  };
  cssVars: Record<string, string>;
}

export const themes: Record<string, Theme> = {
  light: {
    id: 'light',
    name: 'Light / Default',
    description: 'Classic clean white theme — easy to read, high contrast.',
    colors: {
      background: '#FFFFFF',
      backgroundSecondary: '#F8FAFC',
      cardBackground: '#FFFFFF',
      sidebarBackground: '#F8FAFC',
      headerBackground: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#64748B',
      textInverse: '#FFFFFF',
      primary: '#2563EB',
      primaryHover: '#1D4ED8',
      secondary: '#64748B',
      secondaryHover: '#475569',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#0EA5E9',
      hover: '#F1F5F9',
      border: '#E2E8F0',
      divider: '#F1F5F9',
      overlay: 'rgba(0, 0, 0, 0.5)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    cssVars: {
      '--color-background': '#FFFFFF',
      '--color-background-secondary': '#F8FAFC',
      '--color-card-background': '#FFFFFF',
      '--color-sidebar-background': '#F8FAFC',
      '--color-header-background': '#FFFFFF',
      '--color-text-primary': '#0F172A',
      '--color-text-secondary': '#475569',
      '--color-text-muted': '#64748B',
      '--color-text-inverse': '#FFFFFF',
      '--color-primary': '#2563EB',
      '--color-primary-hover': '#1D4ED8',
      '--color-secondary': '#64748B',
      '--color-secondary-hover': '#475569',
      '--color-success': '#059669',
      '--color-warning': '#D97706',
      '--color-error': '#DC2626',
      '--color-info': '#0EA5E9',
      '--color-hover': '#F1F5F9',
      '--color-border': '#E2E8F0',
      '--color-divider': '#F1F5F9',
      '--color-overlay': 'rgba(0, 0, 0, 0.5)',
      '--color-shadow': 'rgba(0, 0, 0, 0.1)',
    },
  },

  // Skool-inspired dark theme - excellent readability
  skoolDark: {
    id: 'skoolDark',
    name: 'Skool Dark',
    description: 'Professional dark theme inspired by Skool - excellent readability.',
    colors: {
      background: '#1A1A1A',           // Main dark background
      backgroundSecondary: '#242424',  // Slightly lighter sections
      cardBackground: '#2A2A2A',       // Card/content areas
      sidebarBackground: '#1F1F1F',    // Sidebar background
      headerBackground: '#1F1F1F',     // Header background
      textPrimary: '#FFFFFF',          // Main text - high contrast
      textSecondary: '#B3B3B3',        // Secondary text - good contrast
      textMuted: '#808080',            // Muted text - readable
      textInverse: '#1A1A1A',          // For light backgrounds
      primary: '#FF6B35',              // Orange primary (from Skool)
      primaryHover: '#E55A2B',         // Darker orange hover
      secondary: '#4A90E2',            // Blue secondary
      secondaryHover: '#357ABD',       // Darker blue hover
      success: '#28A745',              // Green success
      warning: '#FFC107',              // Yellow warning
      error: '#DC3545',                // Red error
      info: '#17A2B8',                 // Cyan info
      hover: '#333333',                // Hover state
      border: '#404040',               // Borders - visible but subtle
      divider: '#333333',              // Dividers
      overlay: 'rgba(0, 0, 0, 0.8)',   // Modal overlays
      shadow: 'rgba(0, 0, 0, 0.3)',    // Shadows
    },
    cssVars: {
      '--color-background': '#1A1A1A',
      '--color-background-secondary': '#242424',
      '--color-card-background': '#2A2A2A',
      '--color-sidebar-background': '#1F1F1F',
      '--color-header-background': '#1F1F1F',
      '--color-text-primary': '#FFFFFF',
      '--color-text-secondary': '#B3B3B3',
      '--color-text-muted': '#808080',
      '--color-text-inverse': '#1A1A1A',
      '--color-primary': '#FF6B35',
      '--color-primary-hover': '#E55A2B',
      '--color-secondary': '#4A90E2',
      '--color-secondary-hover': '#357ABD',
      '--color-success': '#28A745',
      '--color-warning': '#FFC107',
      '--color-error': '#DC3545',
      '--color-info': '#17A2B8',
      '--color-hover': '#333333',
      '--color-border': '#404040',
      '--color-divider': '#333333',
      '--color-overlay': 'rgba(0, 0, 0, 0.8)',
      '--color-shadow': 'rgba(0, 0, 0, 0.3)',
    },
  },

  dark: {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Standard dark theme with blue accents.',
    colors: {
      background: '#0F172A',
      backgroundSecondary: '#1E293B',
      cardBackground: '#1E293B',
      sidebarBackground: '#1A2332',
      headerBackground: '#1E293B',
      textPrimary: '#F8FAFC',
      textSecondary: '#CBD5E1',
      textMuted: '#94A3B8',
      textInverse: '#0F172A',
      primary: '#3B82F6',
      primaryHover: '#2563EB',
      secondary: '#64748B',
      secondaryHover: '#475569',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#06B6D4',
      hover: '#334155',
      border: '#475569',
      divider: '#334155',
      overlay: 'rgba(0, 0, 0, 0.8)',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },
    cssVars: {
      '--color-background': '#0F172A',
      '--color-background-secondary': '#1E293B',
      '--color-card-background': '#1E293B',
      '--color-sidebar-background': '#1A2332',
      '--color-header-background': '#1E293B',
      '--color-text-primary': '#F8FAFC',
      '--color-text-secondary': '#CBD5E1',
      '--color-text-muted': '#94A3B8',
      '--color-text-inverse': '#0F172A',
      '--color-primary': '#3B82F6',
      '--color-primary-hover': '#2563EB',
      '--color-secondary': '#64748B',
      '--color-secondary-hover': '#475569',
      '--color-success': '#10B981',
      '--color-warning': '#F59E0B',
      '--color-error': '#EF4444',
      '--color-info': '#06B6D4',
      '--color-hover': '#334155',
      '--color-border': '#475569',
      '--color-divider': '#334155',
      '--color-overlay': 'rgba(0, 0, 0, 0.8)',
      '--color-shadow': 'rgba(0, 0, 0, 0.5)',
    },
  },

  ocean: {
    id: 'ocean',
    name: 'Ocean / Teal',
    description: 'Calm, professional teal theme.',
    colors: {
      background: '#F0FDFD',
      backgroundSecondary: '#ECFEFF',
      cardBackground: '#FFFFFF',
      sidebarBackground: '#ECFEFF',
      headerBackground: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#334155',
      textMuted: '#64748B',
      textInverse: '#FFFFFF',
      primary: '#14B8A6',
      primaryHover: '#0D9488',
      secondary: '#0EA5E9',
      secondaryHover: '#0284C7',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#0EA5E9',
      hover: '#E6FFFA',
      border: '#B2F5EA',
      divider: '#E6FFFA',
      overlay: 'rgba(0, 0, 0, 0.5)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    cssVars: {
      '--color-background': '#F0FDFD',
      '--color-background-secondary': '#ECFEFF',
      '--color-card-background': '#FFFFFF',
      '--color-sidebar-background': '#ECFEFF',
      '--color-header-background': '#FFFFFF',
      '--color-text-primary': '#0F172A',
      '--color-text-secondary': '#334155',
      '--color-text-muted': '#64748B',
      '--color-text-inverse': '#FFFFFF',
      '--color-primary': '#14B8A6',
      '--color-primary-hover': '#0D9488',
      '--color-secondary': '#0EA5E9',
      '--color-secondary-hover': '#0284C7',
      '--color-success': '#059669',
      '--color-warning': '#D97706',
      '--color-error': '#DC2626',
      '--color-info': '#0EA5E9',
      '--color-hover': '#E6FFFA',
      '--color-border': '#B2F5EA',
      '--color-divider': '#E6FFFA',
      '--color-overlay': 'rgba(0, 0, 0, 0.5)',
      '--color-shadow': 'rgba(0, 0, 0, 0.1)',
    },
  },

  pastel: {
    id: 'pastel',
    name: 'Pastel / Feminine',
    description: 'Soft pastel theme with pink accents.',
    colors: {
      background: '#FFF5F7',
      backgroundSecondary: '#FDF2F8',
      cardBackground: '#FFFFFF',
      sidebarBackground: '#FDF2F8',
      headerBackground: '#FFFFFF',
      textPrimary: '#1F2937',
      textSecondary: '#4B5563',
      textMuted: '#6B7280',
      textInverse: '#FFFFFF',
      primary: '#EC4899',
      primaryHover: '#DB2777',
      secondary: '#A855F7',
      secondaryHover: '#9333EA',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#0EA5E9',
      hover: '#FCE7F3',
      border: '#F9A8D4',
      divider: '#FCE7F3',
      overlay: 'rgba(0, 0, 0, 0.5)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    cssVars: {
      '--color-background': '#FFF5F7',
      '--color-background-secondary': '#FDF2F8',
      '--color-card-background': '#FFFFFF',
      '--color-sidebar-background': '#FDF2F8',
      '--color-header-background': '#FFFFFF',
      '--color-text-primary': '#1F2937',
      '--color-text-secondary': '#4B5563',
      '--color-text-muted': '#6B7280',
      '--color-text-inverse': '#FFFFFF',
      '--color-primary': '#EC4899',
      '--color-primary-hover': '#DB2777',
      '--color-secondary': '#A855F7',
      '--color-secondary-hover': '#9333EA',
      '--color-success': '#059669',
      '--color-warning': '#D97706',
      '--color-error': '#DC2626',
      '--color-info': '#0EA5E9',
      '--color-hover': '#FCE7F3',
      '--color-border': '#F9A8D4',
      '--color-divider': '#FCE7F3',
      '--color-overlay': 'rgba(0, 0, 0, 0.5)',
      '--color-shadow': 'rgba(0, 0, 0, 0.1)',
    },
  },

  luxury: {
    id: 'luxury',
    name: 'Luxury / Gold',
    description: 'Premium dark theme with gold accents.',
    colors: {
      background: '#0C0A09',
      backgroundSecondary: '#1C1917',
      cardBackground: '#1C1917',
      sidebarBackground: '#161412',
      headerBackground: '#1C1917',
      textPrimary: '#F5F5F4',
      textSecondary: '#D6D3D1',
      textMuted: '#A8A29E',
      textInverse: '#0C0A09',
      primary: '#EAB308',
      primaryHover: '#CA8A04',
      secondary: '#78716C',
      secondaryHover: '#57534E',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#0EA5E9',
      hover: '#292524',
      border: '#44403C',
      divider: '#292524',
      overlay: 'rgba(0, 0, 0, 0.8)',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },
    cssVars: {
      '--color-background': '#0C0A09',
      '--color-background-secondary': '#1C1917',
      '--color-card-background': '#1C1917',
      '--color-sidebar-background': '#161412',
      '--color-header-background': '#1C1917',
      '--color-text-primary': '#F5F5F4',
      '--color-text-secondary': '#D6D3D1',
      '--color-text-muted': '#A8A29E',
      '--color-text-inverse': '#0C0A09',
      '--color-primary': '#EAB308',
      '--color-primary-hover': '#CA8A04',
      '--color-secondary': '#78716C',
      '--color-secondary-hover': '#57534E',
      '--color-success': '#059669',
      '--color-warning': '#D97706',
      '--color-error': '#DC2626',
      '--color-info': '#0EA5E9',
      '--color-hover': '#292524',
      '--color-border': '#44403C',
      '--color-divider': '#292524',
      '--color-overlay': 'rgba(0, 0, 0, 0.8)',
      '--color-shadow': 'rgba(0, 0, 0, 0.5)',
    },
  },

  neon: {
    id: 'neon',
    name: 'Neon / Tech',
    description: 'Futuristic theme with cyan and purple.',
    colors: {
      background: '#0F172A',
      backgroundSecondary: '#1E293B',
      cardBackground: '#1E293B',
      sidebarBackground: '#1A2332',
      headerBackground: '#1E293B',
      textPrimary: '#F8FAFC',
      textSecondary: '#CBD5E1',
      textMuted: '#94A3B8',
      textInverse: '#0F172A',
      primary: '#06B6D4',
      primaryHover: '#0891B2',
      secondary: '#8B5CF6',
      secondaryHover: '#7C3AED',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#F43F5E',
      info: '#06B6D4',
      hover: '#334155',
      border: '#475569',
      divider: '#334155',
      overlay: 'rgba(0, 0, 0, 0.8)',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },
    cssVars: {
      '--color-background': '#0F172A',
      '--color-background-secondary': '#1E293B',
      '--color-card-background': '#1E293B',
      '--color-sidebar-background': '#1A2332',
      '--color-header-background': '#1E293B',
      '--color-text-primary': '#F8FAFC',
      '--color-text-secondary': '#CBD5E1',
      '--color-text-muted': '#94A3B8',
      '--color-text-inverse': '#0F172A',
      '--color-primary': '#06B6D4',
      '--color-primary-hover': '#0891B2',
      '--color-secondary': '#8B5CF6',
      '--color-secondary-hover': '#7C3AED',
      '--color-success': '#10B981',
      '--color-warning': '#F59E0B',
      '--color-error': '#F43F5E',
      '--color-info': '#06B6D4',
      '--color-hover': '#334155',
      '--color-border': '#475569',
      '--color-divider': '#334155',
      '--color-overlay': 'rgba(0, 0, 0, 0.8)',
      '--color-shadow': 'rgba(0, 0, 0, 0.5)',
    },
  },

  earth: {
    id: 'earth',
    name: 'Earth / Natural',
    description: 'Warm earth tones theme.',
    colors: {
      background: '#FAF7F5',
      backgroundSecondary: '#F7F3F0',
      cardBackground: '#FFFFFF',
      sidebarBackground: '#F7F3F0',
      headerBackground: '#FFFFFF',
      textPrimary: '#1C1917',
      textSecondary: '#57534E',
      textMuted: '#78716C',
      textInverse: '#FFFFFF',
      primary: '#D97706',
      primaryHover: '#B45309',
      secondary: '#65A30D',
      secondaryHover: '#4D7C0F',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#0EA5E9',
      hover: '#FEF7ED',
      border: '#E7C2A0',
      divider: '#FEF7ED',
      overlay: 'rgba(0, 0, 0, 0.5)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    cssVars: {
      '--color-background': '#FAF7F5',
      '--color-background-secondary': '#F7F3F0',
      '--color-card-background': '#FFFFFF',
      '--color-sidebar-background': '#F7F3F0',
      '--color-header-background': '#FFFFFF',
      '--color-text-primary': '#1C1917',
      '--color-text-secondary': '#57534E',
      '--color-text-muted': '#78716C',
      '--color-text-inverse': '#FFFFFF',
      '--color-primary': '#D97706',
      '--color-primary-hover': '#B45309',
      '--color-secondary': '#65A30D',
      '--color-secondary-hover': '#4D7C0F',
      '--color-success': '#059669',
      '--color-warning': '#D97706',
      '--color-error': '#DC2626',
      '--color-info': '#0EA5E9',
      '--color-hover': '#FEF7ED',
      '--color-border': '#E7C2A0',
      '--color-divider': '#FEF7ED',
      '--color-overlay': 'rgba(0, 0, 0, 0.5)',
      '--color-shadow': 'rgba(0, 0, 0, 0.1)',
    },
  },
};

export const getTheme = (themeId: string): Theme => {
  return themes[themeId] || themes.light;
};

export const getAllThemes = (): Theme[] => {
  return Object.values(themes);
};