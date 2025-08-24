export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    // Backgrounds
    background: string;
    cardBackground: string;
    sidebarBackground: string;
    headerBackground: string;
    
    // Text
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    
    // Accents & Actions
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    
    // Interactive
    hover: string;
    border: string;
    divider: string;
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
      cardBackground: '#FFFFFF',
      sidebarBackground: '#F9FAFB',
      headerBackground: '#FFFFFF',
      textPrimary: '#1E1E1E',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',
      primary: '#2563EB',
      secondary: '#6366F1',
      success: '#22C55E',
      warning: '#FACC15',
      error: '#EF4444',
      hover: '#F3F4F6',
      border: '#E5E7EB',
      divider: '#F3F4F6',
    },
    cssVars: {
      '--color-background': '#FFFFFF',
      '--color-card': '#FFFFFF',
      '--color-sidebar': '#F9FAFB',
      '--color-header': '#FFFFFF',
      '--color-text-primary': '#1E1E1E',
      '--color-text-secondary': '#6B7280',
      '--color-text-muted': '#9CA3AF',
      '--color-primary': '#2563EB',
      '--color-secondary': '#6366F1',
      '--color-success': '#22C55E',
      '--color-warning': '#FACC15',
      '--color-error': '#EF4444',
      '--color-hover': '#F3F4F6',
      '--color-border': '#E5E7EB',
      '--color-divider': '#F3F4F6',
    },
  },
  
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    description: 'One of the most requested themes for modern dashboards.',
    colors: {
      background: '#121212',
      cardBackground: '#1E1E1E',
      sidebarBackground: '#1A1A1A',
      headerBackground: '#1E1E1E',
      textPrimary: '#E5E7EB',
      textSecondary: '#9CA3AF',
      textMuted: '#6B7280',
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#F87171',
      hover: '#2D2D2D',
      border: '#374151',
      divider: '#2D2D2D',
    },
    cssVars: {
      '--color-background': '#121212',
      '--color-card': '#1E1E1E',
      '--color-sidebar': '#1A1A1A',
      '--color-header': '#1E1E1E',
      '--color-text-primary': '#E5E7EB',
      '--color-text-secondary': '#9CA3AF',
      '--color-text-muted': '#6B7280',
      '--color-primary': '#3B82F6',
      '--color-secondary': '#8B5CF6',
      '--color-success': '#10B981',
      '--color-warning': '#F59E0B',
      '--color-error': '#F87171',
      '--color-hover': '#2D2D2D',
      '--color-border': '#374151',
      '--color-divider': '#2D2D2D',
    },
  },
  
  ocean: {
    id: 'ocean',
    name: 'Ocean / Teal',
    description: 'Calm, professional, often requested for coaching/learning dashboards.',
    colors: {
      background: '#F0FDFD',
      cardBackground: '#FFFFFF',
      sidebarBackground: '#ECFEFF',
      headerBackground: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#334155',
      textMuted: '#64748B',
      primary: '#14B8A6',
      secondary: '#0EA5E9',
      success: '#059669',
      warning: '#FACC15',
      error: '#DC2626',
      hover: '#E6FFFA',
      border: '#B2F5EA',
      divider: '#E6FFFA',
    },
    cssVars: {
      '--color-background': '#F0FDFD',
      '--color-card': '#FFFFFF',
      '--color-sidebar': '#ECFEFF',
      '--color-header': '#FFFFFF',
      '--color-text-primary': '#0F172A',
      '--color-text-secondary': '#334155',
      '--color-text-muted': '#64748B',
      '--color-primary': '#14B8A6',
      '--color-secondary': '#0EA5E9',
      '--color-success': '#059669',
      '--color-warning': '#FACC15',
      '--color-error': '#DC2626',
      '--color-hover': '#E6FFFA',
      '--color-border': '#B2F5EA',
      '--color-divider': '#E6FFFA',
    },
  },
  
  pastel: {
    id: 'pastel',
    name: 'Pastel / Feminine',
    description: 'Popular in wellness, lifestyle, and creative memberships.',
    colors: {
      background: '#FFF5F7',
      cardBackground: '#FFFFFF',
      sidebarBackground: '#FDF2F8',
      headerBackground: '#FFFFFF',
      textPrimary: '#1F2937',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',
      primary: '#F472B6',
      secondary: '#C084FC',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      hover: '#FCE7F3',
      border: '#F9A8D4',
      divider: '#FCE7F3',
    },
    cssVars: {
      '--color-background': '#FFF5F7',
      '--color-card': '#FFFFFF',
      '--color-sidebar': '#FDF2F8',
      '--color-header': '#FFFFFF',
      '--color-text-primary': '#1F2937',
      '--color-text-secondary': '#6B7280',
      '--color-text-muted': '#9CA3AF',
      '--color-primary': '#F472B6',
      '--color-secondary': '#C084FC',
      '--color-success': '#34D399',
      '--color-warning': '#FBBF24',
      '--color-error': '#F87171',
      '--color-hover': '#FCE7F3',
      '--color-border': '#F9A8D4',
      '--color-divider': '#FCE7F3',
    },
  },
  
  luxury: {
    id: 'luxury',
    name: 'Luxury / Gold',
    description: 'Great for premium or high-ticket memberships.',
    colors: {
      background: '#0C0A09',
      cardBackground: '#1C1917',
      sidebarBackground: '#161412',
      headerBackground: '#1C1917',
      textPrimary: '#F5F5F4',
      textSecondary: '#D6D3D1',
      textMuted: '#A8A29E',
      primary: '#FFD700',
      secondary: '#B8860B',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#DC2626',
      hover: '#292524',
      border: '#44403C',
      divider: '#292524',
    },
    cssVars: {
      '--color-background': '#0C0A09',
      '--color-card': '#1C1917',
      '--color-sidebar': '#161412',
      '--color-header': '#1C1917',
      '--color-text-primary': '#F5F5F4',
      '--color-text-secondary': '#D6D3D1',
      '--color-text-muted': '#A8A29E',
      '--color-primary': '#FFD700',
      '--color-secondary': '#B8860B',
      '--color-success': '#22C55E',
      '--color-warning': '#F59E0B',
      '--color-error': '#DC2626',
      '--color-hover': '#292524',
      '--color-border': '#44403C',
      '--color-divider': '#292524',
    },
  },
  
  neon: {
    id: 'neon',
    name: 'Neon / Modern Tech',
    description: 'Loved in crypto, gaming, and futuristic platforms.',
    colors: {
      background: '#0F172A',
      cardBackground: '#1E293B',
      sidebarBackground: '#1A2332',
      headerBackground: '#1E293B',
      textPrimary: '#E2E8F0',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      primary: '#06B6D4',
      secondary: '#8B5CF6',
      success: '#10B981',
      warning: '#FACC15',
      error: '#F43F5E',
      hover: '#334155',
      border: '#475569',
      divider: '#334155',
    },
    cssVars: {
      '--color-background': '#0F172A',
      '--color-card': '#1E293B',
      '--color-sidebar': '#1A2332',
      '--color-header': '#1E293B',
      '--color-text-primary': '#E2E8F0',
      '--color-text-secondary': '#94A3B8',
      '--color-text-muted': '#64748B',
      '--color-primary': '#06B6D4',
      '--color-secondary': '#8B5CF6',
      '--color-success': '#10B981',
      '--color-warning': '#FACC15',
      '--color-error': '#F43F5E',
      '--color-hover': '#334155',
      '--color-border': '#475569',
      '--color-divider': '#334155',
    },
  },
  
  earth: {
    id: 'earth',
    name: 'Earth / Neutral Tones',
    description: 'For grounded, lifestyle, or coaching brands.',
    colors: {
      background: '#FAF7F5',
      cardBackground: '#FFFFFF',
      sidebarBackground: '#F7F3F0',
      headerBackground: '#FFFFFF',
      textPrimary: '#3F3F46',
      textSecondary: '#78716C',
      textMuted: '#A8A29E',
      primary: '#D97706',
      secondary: '#65A30D',
      success: '#22C55E',
      warning: '#FACC15',
      error: '#B91C1C',
      hover: '#FEF7ED',
      border: '#E7C2A0',
      divider: '#FEF7ED',
    },
    cssVars: {
      '--color-background': '#FAF7F5',
      '--color-card': '#FFFFFF',
      '--color-sidebar': '#F7F3F0',
      '--color-header': '#FFFFFF',
      '--color-text-primary': '#3F3F46',
      '--color-text-secondary': '#78716C',
      '--color-text-muted': '#A8A29E',
      '--color-primary': '#D97706',
      '--color-secondary': '#65A30D',
      '--color-success': '#22C55E',
      '--color-warning': '#FACC15',
      '--color-error': '#B91C1C',
      '--color-hover': '#FEF7ED',
      '--color-border': '#E7C2A0',
      '--color-divider': '#FEF7ED',
    },
  },
};

export const getTheme = (themeId: string): Theme => {
  return themes[themeId] || themes.light;
};

export const getAllThemes = (): Theme[] => {
  return Object.values(themes);
};