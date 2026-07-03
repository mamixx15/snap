/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          'primary': '#3B82F6',
          'primary-dark': '#2563EB',
          'primary-light': '#60A5FA',
          'secondary': '#10B981',
          'background-dark': '#0F172A',
          'card-dark': '#1E293B',
          'border-dark': '#334155',
          'accent': '#8B5CF6',
        },
        animation: {
          'bounce-slow': 'bounce 3s infinite',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        typography: (theme) => ({
          dark: {
            css: {
              color: theme('colors.gray.100'),
              h1: {
                color: theme('colors.gray.100'),
              },
              h2: {
                color: theme('colors.gray.100'),
              },
              h3: {
                color: theme('colors.gray.100'),
              },
              h4: {
                color: theme('colors.gray.100'),
              },
              p: {
                color: theme('colors.gray.300'),
              },
              a: {
                color: theme('colors.blue.400'),
                '&:hover': {
                  color: theme('colors.blue.500'),
                },
              },
              code: {
                color: theme('colors.gray.300'),
                backgroundColor: theme('colors.gray.800'),
              },
              pre: {
                backgroundColor: theme('colors.gray.900'),
              },
            },
          },
        }),
      },
    },
    plugins: [],
    darkMode: 'class',
  };