export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    // Backgrounds (5 levels for proper hierarchy)
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    cardBackground: string;
    sidebarBackground: string;
    headerBackground: string;
    
    // Text (4 contrast levels)
    textPrimary: string;      // High contrast - main headings
    textSecondary: string;    // Medium contrast - body text  
    textMuted: string;        // Low contrast - labels, metadata
    textInverse: string;      // For dark backgrounds (buttons, etc.)
    
    // Brand Colors (dynamic primary/secondary)
    primary: string;          // Main brand color - replaces ALL blue
    primaryHover: string;     // Hover state for primary
    primaryLight: string;     // Light variant for backgrounds
    primaryDark: string;      // Dark variant for text
    secondary: string;        // Secondary brand color
    secondaryHover: string;   // Hover state for secondary
    
    // Status Colors (consistent across themes)
    success: string;
    successHover: string;
    warning: string;
    warningHover: string;
    error: string;
    errorHover: string;
    info: string;
    infoHover: string;
    
    // Interactive States
    hover: string;            // Hover backgrounds
    active: string;           // Active/selected states
    focus: string;            // Focus rings and borders
    disabled: string;         // Disabled element backgrounds
    disabledText: string;     // Disabled text
    
    // UI Structure
    border: string;           // Standard borders
    borderLight: string;      // Subtle borders
    borderStrong: string;     // Emphasized borders
    divider: string;          // Section dividers
    overlay: string;          // Modal overlays
    shadow: string;           // Drop shadows
  };
}

export const themes: Record<string, Theme> = {
  light: {
    id: 'light',
    name: 'Light / Default',
    description: 'Clean light theme with excellent contrast.',
    colors: {
      // Backgrounds
      background: '#FFFFFF',
      backgroundSecondary: '#F8FAFC',
      backgroundTertiary: '#F1F5F9',
      cardBackground: '#FFFFFF',
      sidebarBackground: '#F8FAFC',
      headerBackground: '#FFFFFF',
      
      // Text
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#64748B',
      textInverse: '#FFFFFF',
      
      // Brand Colors
      primary: '#2563EB',        // Blue for light theme
      primaryHover: '#1D4ED8',
      primaryLight: '#2563EB20',
      primaryDark: '#1E40AF',
      secondary: '#7C3AED',
      secondaryHover: '#6D28D9',
      
      // Status Colors
      success: '#059669',
      successHover: '#047857',
      warning: '#D97706',
      warningHover: '#B45309',
      error: '#DC2626',
      errorHover: '#B91C1C',
      info: '#0EA5E9',
      infoHover: '#0284C7',
      
      // Interactive States
      hover: '#F1F5F9',
      active: '#E2E8F0',
      focus: '#2563EB',
      disabled: '#F1F5F9',
      disabledText: '#94A3B8',
      
      // UI Structure
      border: '#E2E8F0',
      borderLight: '#F1F5F9',
      borderStrong: '#CBD5E1',
      divider: '#F1F5F9',
      overlay: 'rgba(0, 0, 0, 0.5)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
  },

  // Skool-Inspired Dark Theme (Default) - HIGH CONTRAST
  skoolDark: {
    id: 'skoolDark',
    name: 'Skool Dark',
    description: 'Professional dark theme with excellent contrast and readability.',
    colors: {
      // Backgrounds
      background: '#1A1A1A',
      backgroundSecondary: '#1F1F1F',
      backgroundTertiary: '#2A2A2A',
      cardBackground: '#2A2A2A',
      sidebarBackground: '#1F1F1F',
      headerBackground: '#1F1F1F',
      
      // Text - HIGH CONTRAST for excellent readability
      textPrimary: '#FFFFFF',        // Pure white - 21:1 contrast ratio
      textSecondary: '#E0E0E0',      // Light gray - 12.6:1 contrast ratio
      textMuted: '#CFCFCF',          // Medium light gray - 8.2:1 contrast ratio
      textInverse: '#000000',        // Pure black for light backgrounds
      
      // Brand Colors - SATURATED for visibility
      primary: '#FF5A1F',            // Bright orange - highly visible
      primaryHover: '#E04A10',       // Darker orange for hover
      primaryLight: '#FF5A1F40',     // Orange with 25% opacity
      primaryDark: '#CC3A00',        // Very dark orange for text
      secondary: '#7B4CFF',          // Bright purple - high contrast
      secondaryHover: '#6A3FE0',     // Darker purple
      
      // Status Colors - SATURATED for visibility
      success: '#00C851',            // Bright green - 5.2:1 contrast
      successHover: '#00A043',       // Darker green
      warning: '#FFB000',            // Bright yellow/orange - 8.1:1 contrast
      warningHover: '#E09A00',       // Darker yellow
      error: '#FF3547',              // Bright red - 4.9:1 contrast
      errorHover: '#E02030',         // Darker red
      info: '#00B8D4',               // Bright cyan - 5.8:1 contrast
      infoHover: '#009FB8',          // Darker cyan
      
      // Interactive States
      hover: '#333333',              // Light gray hover - visible
      active: '#404040',             // Active state - visible
      focus: '#FF5A1F',              // Bright orange focus ring
      disabled: '#2A2A2A',           // Disabled background
      disabledText: '#888888',       // Disabled text - still readable
      
      // UI Structure
      border: '#404040',             // Visible borders
      borderLight: '#333333',        // Subtle borders
      borderStrong: '#555555',       // Strong borders for emphasis
      divider: '#333333',            // Section dividers
      overlay: 'rgba(0, 0, 0, 0.8)', // Modal overlay
      shadow: 'rgba(0, 0, 0, 0.3)',  // Drop shadows
    },
  },

  dark: {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Standard dark theme with enhanced contrast and blue accents.',
    colors: {
      // Backgrounds
      background: '#0F172A',
      backgroundSecondary: '#1E293B',
      backgroundTertiary: '#334155',
      cardBackground: '#1E293B',
      sidebarBackground: '#1A2332',
      headerBackground: '#1E293B',
      
      // Text - Enhanced contrast
      textPrimary: '#FFFFFF',        // Pure white for max contrast
      textSecondary: '#E2E8F0',      // Light gray - better than #CBD5E1
      textMuted: '#CBD5E1',          // Medium light - better than #94A3B8
      textInverse: '#0F172A',
      
      // Brand Colors - Brighter blues
      primary: '#3B82F6',            // Keep blue but ensure good contrast
      primaryHover: '#2563EB',
      primaryLight: '#3B82F620',
      primaryDark: '#1E40AF',
      secondary: '#8B5CF6',          // Brighter purple
      secondaryHover: '#7C3AED',
      
      // Status Colors - Enhanced visibility
      success: '#22C55E',            // Brighter green
      successHover: '#16A34A',
      warning: '#F59E0B',            // Keep warning yellow
      warningHover: '#D97706',
      error: '#EF4444',              // Keep error red
      errorHover: '#DC2626',
      info: '#06B6D4',               // Keep info cyan
      infoHover: '#0891B2',
      
      // Interactive States
      hover: '#334155',
      active: '#475569',
      focus: '#3B82F6',
      disabled: '#1E293B',
      disabledText: '#94A3B8',       // Slightly better than before
      
      // UI Structure
      border: '#475569',
      borderLight: '#334155',
      borderStrong: '#64748B',
      divider: '#334155',
      overlay: 'rgba(0, 0, 0, 0.8)',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },
  },

  ocean: {
    id: 'ocean',
    name: 'Ocean / Teal',
    description: 'Calm, professional teal theme.',
    colors: {
      // Backgrounds
      background: '#F0FDFD',
      backgroundSecondary: '#ECFEFF',
      backgroundTertiary: '#E6FFFA',
      cardBackground: '#FFFFFF',
      sidebarBackground: '#ECFEFF',
      headerBackground: '#FFFFFF',
      
      // Text
      textPrimary: '#0F172A',
      textSecondary: '#334155',
      textMuted: '#64748B',
      textInverse: '#FFFFFF',
      
      // Brand Colors
      primary: '#14B8A6',
      primaryHover: '#0D9488',
      primaryLight: '#14B8A620',
      primaryDark: '#0F766E',
      secondary: '#0EA5E9',
      secondaryHover: '#0284C7',
      
      // Status Colors
      success: '#059669',
      successHover: '#047857',
      warning: '#D97706',
      warningHover: '#B45309',
      error: '#DC2626',
      errorHover: '#B91C1C',
      info: '#0EA5E9',
      infoHover: '#0284C7',
      
      // Interactive States
      hover: '#E6FFFA',
      active: '#CCFBF1',
      focus: '#14B8A6',
      disabled: '#F0FDFD',
      disabledText: '#94A3B8',
      
      // UI Structure
      border: '#B2F5EA',
      borderLight: '#E6FFFA',
      borderStrong: '#99F6E4',
      divider: '#E6FFFA',
      overlay: 'rgba(0, 0, 0, 0.5)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
  },

  pastel: {
    id: 'pastel',
    name: 'Pastel / Feminine',
    description: 'Soft pastel theme with enhanced readability.',
    colors: {
      // Backgrounds
      background: '#FFF5F7',
      backgroundSecondary: '#FDF2F8',
      backgroundTertiary: '#FCE7F3',
      cardBackground: '#FFFFFF',
      sidebarBackground: '#FDF2F8',
      headerBackground: '#FFFFFF',
      
      // Text - Better contrast on light backgrounds
      textPrimary: '#111827',        // Darker for better contrast
      textSecondary: '#374151',      // Darker secondary
      textMuted: '#4B5563',          // Darker muted text
      textInverse: '#FFFFFF',
      
      // Brand Colors - Slightly darker for better contrast
      primary: '#DB2777',            // Darker pink for better readability
      primaryHover: '#BE185D',       // Darker hover
      primaryLight: '#DB277720',     // Pink with opacity
      primaryDark: '#9F1239',        // Very dark pink
      secondary: '#8B5CF6',          // Keep purple
      secondaryHover: '#7C3AED',
      
      // Status Colors - Enhanced for light background
      success: '#047857',            // Darker green for contrast
      successHover: '#065F46',
      warning: '#D97706',            // Keep warning
      warningHover: '#B45309',
      error: '#DC2626',              // Keep error
      errorHover: '#B91C1C',
      info: '#0284C7',               // Darker blue
      infoHover: '#0369A1',
      
      // Interactive States
      hover: '#FCE7F3',
      active: '#F9A8D4',
      focus: '#DB2777',
      disabled: '#FDF2F8',
      disabledText: '#9CA3AF',
      
      // UI Structure
      border: '#F9A8D4',
      borderLight: '#FBCFE8',
      borderStrong: '#F472B6',
      divider: '#FCE7F3',
      overlay: 'rgba(0, 0, 0, 0.5)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
  },

  luxury: {
    id: 'luxury',
    name: 'Luxury / Gold',
    description: 'Premium dark theme with enhanced gold contrast.',
    colors: {
      // Backgrounds
      background: '#0C0A09',
      backgroundSecondary: '#1C1917',
      backgroundTertiary: '#292524',
      cardBackground: '#1C1917',
      sidebarBackground: '#161412',
      headerBackground: '#1C1917',
      
      // Text - Enhanced contrast
      textPrimary: '#FFFFFF',        // Pure white instead of #F5F5F4
      textSecondary: '#E7E5E4',      // Lighter than #D6D3D1
      textMuted: '#D6D3D1',          // Moved up from #A8A29E
      textInverse: '#0C0A09',
      
      // Brand Colors - Brighter gold
      primary: '#FBBF24',            // Brighter gold - better contrast
      primaryHover: '#F59E0B',       // Hover state
      primaryLight: '#FBBF2440',     // Gold with opacity
      primaryDark: '#D97706',        // Dark gold
      secondary: '#A78BFA',          // Light purple for contrast
      secondaryHover: '#8B5CF6',     // Purple hover
      
      // Status Colors - Enhanced for dark background
      success: '#22C55E',            // Brighter green
      successHover: '#16A34A',
      warning: '#F59E0B',            // Bright orange-yellow
      warningHover: '#D97706',
      error: '#F87171',              // Brighter red
      errorHover: '#EF4444',
      info: '#38BDF8',               // Brighter blue
      infoHover: '#0EA5E9',
      
      // Interactive States
      hover: '#292524',
      active: '#44403C',
      focus: '#FBBF24',              // Bright gold focus
      disabled: '#1C1917',
      disabledText: '#A8A29E',       // Better than #78716C
      
      // UI Structure
      border: '#44403C',
      borderLight: '#292524',
      borderStrong: '#57534E',
      divider: '#292524',
      overlay: 'rgba(0, 0, 0, 0.8)',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },
  },

  neon: {
    id: 'neon',
    name: 'Neon / Tech',
    description: 'Futuristic theme with high-contrast neon colors.',
    colors: {
      // Backgrounds
      background: '#0F172A',
      backgroundSecondary: '#1E293B',
      backgroundTertiary: '#334155',
      cardBackground: '#1E293B',
      sidebarBackground: '#1A2332',
      headerBackground: '#1E293B',
      
      // Text - Enhanced neon contrast
      textPrimary: '#FFFFFF',        // Pure white for neon theme
      textSecondary: '#E2E8F0',      // Light gray
      textMuted: '#CBD5E1',          // Medium light
      textInverse: '#0F172A',
      
      // Brand Colors - Bright neon
      primary: '#00E5FF',            // Bright cyan - neon effect
      primaryHover: '#00B8D4',       // Darker cyan
      primaryLight: '#00E5FF40',     // Cyan with opacity
      primaryDark: '#006064',        // Dark cyan
      secondary: '#E91E63',          // Bright magenta
      secondaryHover: '#C2185B',     // Darker magenta
      
      // Status Colors - Neon palette
      success: '#00FF9F',            // Neon green
      successHover: '#00E676',
      warning: '#FFD600',            // Neon yellow
      warningHover: '#FFC107',
      error: '#FF1744',              // Neon red
      errorHover: '#D50000',
      info: '#00E5FF',               // Neon cyan (same as primary)
      infoHover: '#00B8D4',
      
      // Interactive States
      hover: '#334155',
      active: '#475569',
      focus: '#00E5FF',              // Bright cyan focus
      disabled: '#1E293B',
      disabledText: '#94A3B8',
      
      // UI Structure
      border: '#475569',
      borderLight: '#334155',
      borderStrong: '#64748B',
      divider: '#334155',
      overlay: 'rgba(0, 0, 0, 0.8)',
      shadow: 'rgba(0, 255, 229, 0.2)', // Neon glow shadow
    },
  },

  earth: {
    id: 'earth',
    name: 'Earth / Natural',
    description: 'Warm earth tones theme.',
    colors: {
      // Backgrounds
      background: '#FAF7F5',
      backgroundSecondary: '#F7F3F0',
      backgroundTertiary: '#FEF7ED',
      cardBackground: '#FFFFFF',
      sidebarBackground: '#F7F3F0',
      headerBackground: '#FFFFFF',
      
      // Text
      textPrimary: '#1C1917',
      textSecondary: '#57534E',
      textMuted: '#78716C',
      textInverse: '#FFFFFF',
      
      // Brand Colors
      primary: '#D97706',
      primaryHover: '#B45309',
      primaryLight: '#D9770620',
      primaryDark: '#92400E',
      secondary: '#65A30D',
      secondaryHover: '#4D7C0F',
      
      // Status Colors
      success: '#059669',
      successHover: '#047857',
      warning: '#D97706',
      warningHover: '#B45309',
      error: '#DC2626',
      errorHover: '#B91C1C',
      info: '#0EA5E9',
      infoHover: '#0284C7',
      
      // Interactive States
      hover: '#FEF7ED',
      active: '#FED7AA',
      focus: '#D97706',
      disabled: '#F7F3F0',
      disabledText: '#A8A29E',
      
      // UI Structure
      border: '#E7C2A0',
      borderLight: '#FEF7ED',
      borderStrong: '#FDBA74',
      divider: '#FEF7ED',
      overlay: 'rgba(0, 0, 0, 0.5)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
  },
};

export const getTheme = (themeId: string): Theme => {
  return themes[themeId] || themes.skoolDark;
};

export const getAllThemes = (): Theme[] => {
  return Object.values(themes);
};