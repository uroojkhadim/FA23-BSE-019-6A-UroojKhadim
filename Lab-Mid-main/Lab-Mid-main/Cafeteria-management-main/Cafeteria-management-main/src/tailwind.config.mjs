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
                accent: '#1e40af',
                destructive: '#dc2626',
                'destructive-foreground': '#FFFFFF',
                background: '#f8fafc',
                secondary: '#cbd5e1',
                foreground: '#1e293b',
                'secondary-foreground': '#475569',
                'primary-foreground': '#FFFFFF',
                primary: '#0f172a',
                'blue-600': '#2563eb',
                'blue-700': '#1d4ed8',
                'slate-700': '#374151',
                'slate-800': '#1f2937',
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [containerQueries, typography],
}
