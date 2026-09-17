import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: ({theme}) => ({
        ...theme('colors'),
        'dark3': '#202124',
        'dark2': '#282C2F',
        'dark1': '#323639',
      }),
    },
  },
  plugins: [],
}

export default config
