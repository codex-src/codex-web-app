const defaultTheme = require("tailwindcss/defaultTheme")
const defaultVariants = require("./tailwind-variants")

module.exports = {
	purge: [
		"./public/**/*.html",
		"./src/**/*.js",
	],
	theme: {
		extend: {
			boxShadow: {
				"hero-sm":  "0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
				"hero":     "0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
				"hero-md":  "0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
				"hero-lg":  "0 0 0 1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
				"hero-xl":  "0 0 0 1px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
				"hero-2xl": "0 0 0 1px rgba(0, 0, 0, 0.05), 0 25px 50px -12px rgba(0, 0, 0, 0.25)",
			},
			colors: {
				// https://gist.github.com/codex-zaydek/d3d1803f981fc8ed75fc0e4f481f6ecc
				"md-blue-50":   "#e3f2fd",
				"md-blue-100":  "#bbdefb",
				"md-blue-200":  "#90caf9",
				"md-blue-300":  "#64b5f6",
				"md-blue-400":  "#42a5f5",
				"md-blue-500":  "#2196f3",
				"md-blue-600":  "#1e88e5",
				"md-blue-700":  "#1976d2",
				"md-blue-800":  "#1565c0",
				"md-blue-900":  "#0d47a1",
				"md-blue-a100": "#82b1ff",
				"md-blue-a200": "#448aff",
				"md-blue-a400": "#2979ff",
				"md-blue-a700": "#2962ff",

				"github-gray":  "#24292e",
				"twitter-blue": "#1da1f2",
			},
			fontFamily: {
				sans: [
					"Inter",
					...defaultTheme.fontFamily.sans,
				],
			},
			// TODO: Deprecate?
			letterSpacing: {
				"-px": "-0.0125em",
				px:  "0.0125em",
			},
			opacity: {
				90: "0.90",
				95: "0.95",
			},
			// https://youtube.com/watch?v=jl_tdhBxc_Y
			spacing: {
				"2/1":   "200%",
				"16/9":  "177.7778%",
				"16/10": "160%",
				"3/2":   "150%",
				"4/3":   "133.3333%",
				"5/4":   "125%",
				"1/1":   "100%",
				"4/5":   "80%",
				"3/4":   "75%",
				"2/3":   "66.6667%",
				"10/16": "62.5%",
				"9/16":  "56.25%",
				"1/2":   "50%",
			},
		},
		screens: {
			xs: `${24 + 512 + 24}px`,
			// => @media (min-width: 560px) { ... }

			sm: `${24 + 640 + 24}px`,
			// => @media (min-width: 688px) { ... }

			md: `${24 + 768 + 24}px`,
			// => @media (min-width: 816px) { ... }

			lg: `${24 + 1024 + 24}px`,
			// => @media (min-width: 1072px) { ... }

			xl: `${24 + 1280 + 24}px`,
			// => @media (min-width: 1328px) { ... }

			dark: { raw: "(prefers-color-scheme: dark)" },
			// => @media (prefers-color-scheme: dark) { ... }
		},
	},
	variants: {
		...defaultVariants,
		boxShadow: [...defaultVariants.boxShadow, "active"],
		opacity: [...defaultVariants.opacity, "active"],
	},
	plugins: [
		require("@tailwindcss/ui"),
	],
}
