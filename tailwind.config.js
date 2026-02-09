/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                // 🌿 Soft Mint Learning Theme
                'mint': {
                    50: '#F0FDFA',   // Background
                    100: '#CCFBF1',
                    200: '#99F6E4',
                    300: '#5EEAD4',
                    400: '#2DD4BF',  // Accent
                    500: '#14B8A6',
                    600: '#0D9488',
                    700: '#0F766E',
                    800: '#115E59',
                    900: '#134E4A',
                },
                'deep-green': '#064E3B',  // Primary text
                'sky-active': '#0EA5E9',  // Active node
                'soft-green': '#22C55E',  // Visited/Success
                'warm-yellow': '#FBBF24', // Highlight/Path
                'soft-red': '#F87171',    // Error
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'fade-in-up': 'fadeInUp 0.4s ease-out',
                'pulse-slow': 'pulse 3s infinite',
                'pulse-active': 'pulseActive 0.8s ease-in-out infinite',
                'glow-fade': 'glowFade 0.6s ease-in-out infinite alternate',
                'shake-error': 'shakeError 0.3s ease-in-out',
                'ripple': 'ripple 1.5s ease-out infinite',
                'scale-in': 'scaleIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(3px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseActive: {
                    '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(14, 165, 233, 0.4)' },
                    '50%': { transform: 'scale(1.08)', boxShadow: '0 0 20px 4px rgba(14, 165, 233, 0.2)' },
                },
                glowFade: {
                    '0%': { boxShadow: '0 0 8px 2px rgba(14, 165, 233, 0.3)' },
                    '100%': { boxShadow: '0 0 16px 4px rgba(14, 165, 233, 0.15)' },
                },
                shakeError: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-4px)' },
                    '75%': { transform: 'translateX(4px)' },
                },
                ripple: {
                    '0%': { transform: 'scale(1)', opacity: '0.6' },
                    '100%': { transform: 'scale(2.5)', opacity: '0' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(148, 163, 184, 0.15)',
                'soft-md': '0 4px 12px rgba(148, 163, 184, 0.2)',
                'soft-lg': '0 8px 24px rgba(148, 163, 184, 0.2)',
                'active': '0 0 0 3px rgba(14, 165, 233, 0.2)',
                'success': '0 0 0 3px rgba(34, 197, 94, 0.2)',
                'error': '0 0 0 3px rgba(248, 113, 113, 0.2)',
            },
        },
    },
    plugins: [],
}
