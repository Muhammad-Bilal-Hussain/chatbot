import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    // screens: {
  		'max-sm': {max: '480px'},
  	// 	// 'sm': '480px',
  	// 	// 'md': '640px',
  	// 	// 'lg': '780px',
  	// 	// 'xl': '892px',
  	// 	// '2xl': '1028px',
  	// 	// '3xl': '1248px'
    // },
  },
  plugins: [],
};
export default config;
