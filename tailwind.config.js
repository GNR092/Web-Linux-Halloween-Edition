/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./**/*.php",
        '!./node_modules',
        "!./resources",
        "!./Ejemplos",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'halloweenbg': "url('../resource/halloweenbg.png')",
            },
            fontFamily: {
                'eater': ['Eater', 'serif'],
                'nosifer': ['Nosifer', 'sans-serif'],
                'amaticsc': ["Amatic SC", 'sans-serif'],
            },
            maxHeight: {
                '100': '25rem',
            },
        },
    },
    plugins: [],
}
  
  