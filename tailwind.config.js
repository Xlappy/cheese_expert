/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                artisan: {
                    dark: '#1c1917',     // Stone-900
                    surface: '#292524',  // Stone-800
                    accent: '#eb9b34',   // Aged Cheddar / Amber
                    cream: '#f5f5f4',    // Cream White
                    olive: '#65a30d',    // Bio/Olive
                }
            },
            fontFamily: {
                serif: ['Merriweather', 'serif'],
                sans: ['Nunito', 'sans-serif'],
            },
            borderRadius: {
                '3xl': '1.5rem',
                '4xl': '2rem',
            },
            animation: {
                'split-open': 'split-open 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }
        },
    },
    plugins: [],
}
