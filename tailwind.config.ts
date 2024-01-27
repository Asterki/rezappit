import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},

			colors: {
				"dark-1": "#1C1C1C",
				"dark-2": "#252525",
				"dark-3": "#B6B6B6",
				"accent-7": "#333",
				"primary": "#5B42DC",
				success: "#0070f3",
				cyan: "#79FFE1",
			},
		},
	},
	plugins: [],
};
export default config;
