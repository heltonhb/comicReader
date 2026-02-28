/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0f1c', // Deep dark blue/gray
                surface: '#131b2e',    // Darker blue/gray for cards
                primary: '#D81E1E',    // Brand Red
                secondary: '#008000',  // Action Green
                highlight: '#FFCA00',  // Brand Yellow
                navy: '#1A2B4A',       // Deep Blue
                'text-primary': '#F3F4F6', // Light text for dark mode
                'text-secondary': '#9CA3AF',
            },
            fontFamily: {
                sans: ['Montserrat', 'Roboto', 'sans-serif'],
                display: ['Montserrat', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
