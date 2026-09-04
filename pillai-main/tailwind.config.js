/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F7F5',
        surface: '#FFFFFF',
        'surface-subtle': '#F2F2EE',
        'surface-muted': '#EBEBE6',
        primary: '#171717',
        secondary: '#6B6B67',
        border: '#E4E4E0',
        'border-strong': '#D0D0C8',
        orbit: {
          DEFAULT: '#315CFF',
          hover: '#2547D0',
          subtle: '#EEF2FF',
          dark: '#1E3A8A'
        },
        safe: {
          DEFAULT: '#247A52',
          subtle: '#EBF6F0',
          text: '#1C5B3E'
        },
        warning: {
          DEFAULT: '#B7791F',
          subtle: '#FEF8EE',
          text: '#8D5B15'
        },
        high: {
          DEFAULT: '#C65D2E',
          subtle: '#FDF1EB',
          text: '#98431E'
        },
        critical: {
          DEFAULT: '#B83232',
          subtle: '#FCEDED',
          text: '#8E2323'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
      }
    },
  },
  plugins: [],
}
