/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Base colors
                background: '#0a0f1c',
                surface: {
                    DEFAULT: '#131b2e',
                    elevated: '#1A2235',
                    hover: '#232d45',
                },
                
                // Brand colors
                gold: {
                    DEFAULT: '#D4AF37',
                    light: '#E5C76B',
                    dark: '#B8962E',
                    muted: '#9A8B5C',
                    glow: 'rgba(212, 175, 55, 0.3)',
                },
                silver: {
                    DEFAULT: '#C0C0C0',
                    warm: '#E8E4D9',
                    dark: '#8A8A8A',
                },
                
                // Accent colors
                primary: '#D81E1E',    // Brand Red
                secondary: '#008000',   // Action Green
                highlight: '#FFCA00',  // Brand Yellow
                
                // Navy variants
                navy: {
                    light: '#1A2B4A',
                    DEFAULT: '#151E35',
                    dark: '#0F1525',
                },
                
                // Text
                text: {
                    primary: '#F3F4F6',
                    secondary: '#9CA3AF',
                    muted: '#6B7280',
                },
                
                // Semantic
                success: '#10B981',
                warning: '#F59E0B',
                error: '#EF4444',
                info: '#3B82F6',
                
                // Gradients
                'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #E5C76B 50%, #D4AF37 100%)',
                'gradient-dark': 'linear-gradient(180deg, #1A2235 0%, #0F1525 100%)',
            },
            
            fontFamily: {
                sans: ['Inter', 'Montserrat', 'system-ui', 'sans-serif'],
                display: ['Montserrat', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
            },
            
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
                '72': '18rem',
                '84': '21rem',
                '96': '24rem',
            },
            
            boxShadow: {
                'gold': '0 0 20px rgba(212, 175, 55, 0.25)',
                'gold-lg': '0 0 40px rgba(212, 175, 55, 0.35)',
                'card': '0 4px 20px rgba(0, 0, 0, 0.4)',
                'elevated': '0 8px 30px rgba(0, 0, 0, 0.5)',
                'inset-gold': 'inset 0 0 20px rgba(212, 175, 55, 0.1)',
            },
            
            animation: {
                'shimmer': 'shimmer 2s infinite linear',
                'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'fade-in': 'fadeIn 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'pulse-gold': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)' },
                    '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.4)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 },
                },
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: 0 },
                    '100%': { transform: 'scale(1)', opacity: 1 },
                },
            },
            
            backdropBlur: {
                'xs': '2px',
            },
            
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
            
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #E5C76B 50%, #D4AF37 100%)',
                'dark-gradient': 'radial-gradient(circle at center, #1a1a1a 0%, #0d0d0d 100%)',
                'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            },
        },
    },
    plugins: [],
}