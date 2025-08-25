/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic Design Tokens
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        'surface-3': 'rgb(var(--surface-3) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        popover: 'rgb(var(--popover) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        
        // Text Colors
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        'text-tertiary': 'rgb(var(--text-tertiary) / <alpha-value>)',
        'text-inverse': 'rgb(var(--text-inverse) / <alpha-value>)',
        'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',
        
        // Action Colors
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--primary-foreground) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        'secondary-foreground': 'rgb(var(--secondary-foreground) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-foreground': 'rgb(var(--accent-foreground) / <alpha-value>)',
        
        // Status Colors
        info: 'rgb(var(--info) / <alpha-value>)',
        'info-foreground': 'rgb(var(--info-foreground) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        'success-foreground': 'rgb(var(--success-foreground) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        'warning-foreground': 'rgb(var(--warning-foreground) / <alpha-value>)',
        destructive: 'rgb(var(--destructive) / <alpha-value>)',
        'destructive-foreground': 'rgb(var(--destructive-foreground) / <alpha-value>)',
        
        // Form & Input Colors
        muted: 'rgb(var(--muted) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--muted-foreground) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        'input-placeholder': 'rgb(var(--input-placeholder) / <alpha-value>)',
        disabled: 'rgb(var(--disabled) / <alpha-value>)',
        'disabled-foreground': 'rgb(var(--disabled-foreground) / <alpha-value>)',

        // Page Canvas Colors
        'page-bg': 'rgb(var(--page-bg) / <alpha-value>)',
        'page-surface': 'rgb(var(--page-surface) / <alpha-value>)',
        'page-border': 'rgb(var(--page-border) / <alpha-value>)',
        'page-shadow-color': 'rgb(var(--page-shadow-color) / <alpha-value>)',

        // Legacy colors for compatibility (will be phased out)
        brand: {
          primary: 'rgb(var(--primary) / <alpha-value>)',
          secondary: 'rgb(var(--secondary) / <alpha-value>)',
        },
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(var(--shadow-color) / 0.18)',
        'md': '0 4px 6px -1px rgb(var(--shadow-color) / 0.18), 0 2px 4px -1px rgb(var(--shadow-color) / 0.12)',
        'lg': '0 10px 15px -3px rgb(var(--shadow-color) / 0.18), 0 4px 6px -2px rgb(var(--shadow-color) / 0.12)',
        'xl': '0 20px 25px -5px rgb(var(--shadow-color) / 0.18), 0 10px 10px -5px rgb(var(--shadow-color) / 0.08)',
        // Page Canvas Shadows
        'page-sm': '0 1px 2px 0 rgb(var(--page-shadow-color) / 0.1)',
        'page-md': '0 4px 6px -1px rgb(var(--page-shadow-color) / 0.1), 0 2px 4px -1px rgb(var(--page-shadow-color) / 0.06)',
        'page-lg': '0 10px 15px -3px rgb(var(--page-shadow-color) / 0.1), 0 4px 6px -2px rgb(var(--page-shadow-color) / 0.06)',
        'page-xl': '0 20px 25px -5px rgb(var(--page-shadow-color) / 0.15), 0 10px 10px -5px rgb(var(--page-shadow-color) / 0.08)',
      },
      borderRadius: {
        'xl': '12px',
      },
      fontSize: {
        'h1': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }], // 32px
        'h2': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '600' }], // 28px
        'h3': ['1.375rem', { lineHeight: '1.875rem', fontWeight: '600' }], // 22px
      },
      spacing: {
        'btn-sm': '0.5rem 0.75rem', // 8px 12px
        'btn-md': '0.625rem 1rem', // 10px 16px
        'btn-lg': '0.75rem 1.25rem', // 12px 20px
      },
      animation: {
        shimmer: 'shimmer 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}