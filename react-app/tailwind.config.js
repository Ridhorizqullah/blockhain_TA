/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            colors: {
                user: {
                    bg: '#F8FAFC', // Slate 50
                    surface: '#FFFFFF',
                    primary: '#059669', // Emerald 600
                    secondary: '#14B8A6', // Teal 500
                    accent: '#F59E0B', // Amber 500
                    text: '#0F172A', // Slate 900
                    muted: '#64748B', // Slate 500
                    border: '#E2E8F0' // Slate 200
                },
                admin: {
                    bg: '#0F172A', // Slate 900
                    surface: '#1E293B', // Slate 800
                    primary: '#7C3AED', // Violet 600
                    secondary: '#4F46E5', // Indigo 600
                    accent: '#10B981', // Emerald 500
                    text: '#F8FAFC', // Slate 50
                    muted: '#94A3B8', // Slate 400
                    border: '#334155' // Slate 700
                }
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
