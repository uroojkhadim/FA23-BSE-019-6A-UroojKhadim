import containerQueries from "@tailwindcss/container-queries";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{html,js,jsx,ts,tsx}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.02em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '400' }],
                base: ['1rem', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '400' }],
                lg: ['1.125rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '400' }],
                xl: ['1.25rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '600' }],
                '2xl': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0.01em', fontWeight: '600' }],
                '3xl': ['1.875rem', { lineHeight: '1.2', letterSpacing: '0.01em', fontWeight: '700' }],
                '4xl': ['2.25rem', { lineHeight: '1.15', letterSpacing: '0.005em', fontWeight: '700' }],
                '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '0.005em', fontWeight: '700' }],
                '6xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '0.002em', fontWeight: '700' }],
                '7xl': ['4.5rem', { lineHeight: '1.02', letterSpacing: '0.001em', fontWeight: '700' }],
                '8xl': ['6rem', { lineHeight: '1', letterSpacing: '0', fontWeight: '700' }],
                '9xl': ['8rem', { lineHeight: '1', letterSpacing: '0', fontWeight: '700' }],
            },
            fontFamily: {
                heading: "helvetica-w01-roman",
                paragraph: "open sans"
            },
            colors: {
                // COMSATS Primary Sky Blue Theme
                primary: '#0ea5e9',          // Sky 500
                'primary-light': '#38bdf8',  // Sky 400
                'primary-dark': '#0284c7',   // Sky 600
                
                accent: '#0ea5e9',           // Using sky blue as accent too
                'accent-light': '#38bdf8',
                'accent-dark': '#0284c7',
                
                // Supporting colors
                destructive: '#dc2626',
                'destructive-foreground': '#FFFFFF',
                background: '#F8FAFC',       // Slightly off-white for modern SaaS feel
                secondary: '#E2E8F0',        // Clean slate gray for secondary
                foreground: '#0F172A',       // Dark slate for text
                'secondary-foreground': '#64748B',
                'primary-foreground': '#FFFFFF',
                
                // SaaS specific palette
                'sidebar-bg': '#0c4a6e',     // Sky 900 for sidebar
                'card-bg': '#FFFFFF',
                'border-color': '#E2E8F0',
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [containerQueries, typography],
}
