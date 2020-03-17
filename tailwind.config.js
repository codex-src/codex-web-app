const defaultTheme = require("tailwindcss/defaultTheme")
const plugin = require("tailwindcss/plugin")

module.exports = {
	theme: {
		extend: {
			borderRadius: {
				"lg-xl": "0.75rem",
				"xl":    "1rem",
				"2xl":   "2rem",
			},
			boxShadow: {
				"outline-color": "0 0 0 3px currentColor",

				"hero-sm": `
					0 0 0 1px rgba(0, 0, 0, 0.05),
					0 1px 2px 0 rgba(0, 0, 0, 0.05)
				`,
				"hero": `
					0 0 0 1px rgba(0, 0, 0, 0.05),
					0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
				`,
				"hero-md": `
					0 0 0 1px rgba(0, 0, 0, 0.05),
					0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
				`,
				"hero-lg": `
					0 0 0 1px rgba(0, 0, 0, 0.05),
					0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
				`,
				"hero-xl": `
					0 0 0 1px rgba(0, 0, 0, 0.05),
					0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
				`,
				"hero-2xl": `
					0 0 0 1px rgba(0, 0, 0, 0.05),
					0 25px 50px -12px rgba(0, 0, 0, 0.25)
				`,
			},
			colors: {
				"gray": {
					// https://meyerweb.com/eric/tools/color-blend
					...defaultTheme.colors.gray,
					50:  "#fbfdfe",
					// 7XX:
					710: "#475265",
					720: "#444f62",
					725: "#434e60",
					730: "#414c5e",
					740: "#3e495b",
					750: "#3c4658",
					760: "#394355",
					770: "#364052",
					775: "#343f50",
					780: "#333d4e",
					790: "#303a4b",
					// 8XX:
					810: "#2b3545",
					820: "#293242",
					825: "#283141",
					830: "#273040",
					840: "#252e3d",
					850: "#242c3a",
					860: "#222937",
					870: "#202734",
					875: "#1f2633",
					880: "#1e2532",
					890: "#1c222f",
				},
				// https://gist.github.com/codex-zaydek/d3d1803f981fc8ed75fc0e4f481f6ecc
				"md-blue-50":   { default: "#e3f2fd" },
				"md-blue-100":  { default: "#bbdefb" },
				"md-blue-200":  { default: "#90caf9" },
				"md-blue-300":  { default: "#64b5f6" },
				"md-blue-400":  { default: "#42a5f5" },
				"md-blue-500":  { default: "#2196f3" },
				"md-blue-600":  { default: "#1e88e5" },
				"md-blue-700":  { default: "#1976d2" },
				"md-blue-800":  { default: "#1565c0" },
				"md-blue-900":  { default: "#0d47a1" },
				"md-blue-a100": { default: "#82b1ff" },
				"md-blue-a200": { default: "#448aff" },
				"md-blue-a400": { default: "#2979ff" },
				"md-blue-a700": { default: "#2962ff" },
				"md-gray-50":   { default: "#fafafa" },
				"md-gray-100":  { default: "#f5f5f5" },
				"md-gray-200":  { default: "#eeeeee" },
				"md-gray-300":  { default: "#e0e0e0" },
				"md-gray-400":  { default: "#bdbdbd" },
				"md-gray-500":  { default: "#9e9e9e" },
				"md-gray-600":  { default: "#757575" },
				"md-gray-700":  { default: "#616161" },
				"md-gray-800":  { default: "#424242" },
				"md-gray-900":  { default: "#212121" },
				// https://twitter.com
				"twitter-blue": "#1da1f2",
			},
			fontFamily: {
				...defaultTheme.fontFamily,
				"ia-writer-mono": ["'iA Writer Mono var'", "monospace"],
				"inter":          ["Inter", "sans-serif"],
			},
			inset: {
				"1/2":  "50%",
				"full": "100%",
			},
			letterSpacing: {
				"-px": "-0.0125em",
				"px":  "0.0125em",
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
			strokeWidth: {
				hairline:  1.25, // 100
				thin:      1.5,  // 200
				light:     1.75, // 300
				normal:    2,    // 400
				medium:    2.25, // 500
				semibold:  2.5,  // 600
				bold:      2.75, // 700
				extrabold: 3,    // 800
				black:     3.25, // 900
			},
		},
		// https://tailwindcss.com/docs/breakpoints
		screens: {
			xs: `${512 + (6 * 4) * 2}px`,
			// => @media (min+width: 560px) { ... }

			sm: `${640 + (6 * 4) * 2}px`,
			// => @media (min+width: 688px) { ... }

			md: `${768 + (6 * 4) * 2}px`,
			// => @media (min+width: 816px) { ... }

			lg: `${1024 + (6 * 4) * 2}px`,
			// => @media (min+width: 1072px) { ... }

			xl: `${1280 + (6 * 4) * 2}px`,
			// => @media (min-width: 1328px) { ... }
		},
	},
	// https://tailwindcss.com/docs/configuring-variants/#default-variants-reference
	variants: {
		textAlign: ["responsive"],

		textColor: [
			"responsive",
			"dark",
			"hover",
			"hover:dark",
			"focus",
			"focus:dark",
			"active",
			"active:dark",
			"disabled",
			"disabled:dark",
		],
		backgroundColor: [
			"responsive",
			"dark",
			"hover",
			"hover:dark",
			"focus",
			"focus:dark",
			"active",
			"active:dark",
			"disabled",
			"disabled:dark",
		],
		borderColor: [
			"dark",
		],
		boxShadow: [
			"responsive",
			"dark",
			"hover",
			"hover:dark",
			"focus",
			"focus:dark",
			"active",
			"active:dark",
			"disabled",
			"disabled:dark",
		],
	},
	plugins: [
		plugin(((flag = "dark-mode", prefix = "dark") => {
			return ({ addVariant, e }) => {
				addVariant(prefix, ({ modifySelectors }) => {
					modifySelectors(({ className }) => {
						return `.${flag} .${e(`${prefix}:${className}`)}`
					})
				})
				addVariant(`hover:${prefix}`, ({ modifySelectors }) => {
					modifySelectors(({ className }) => {
						return `.${flag} .${e(`hover:${prefix}:${className}`)}:hover`
					})
				})
				addVariant(`focus:${prefix}`, ({ modifySelectors }) => {
					modifySelectors(({ className }) => {
						return `.${flag} .${e(`focus:${prefix}:${className}`)}:focus`
					})
				})
				addVariant(`active:${prefix}`, ({ modifySelectors }) => {
					modifySelectors(({ className }) => {
						return `.${flag} .${e(`active:${prefix}:${className}`)}:active`
					})
				})
				addVariant(`disabled:${prefix}`, ({ modifySelectors }) => {
					modifySelectors(({ className }) => {
						return `.${flag} .${e(`disabled:${prefix}:${className}`)}:disabled`
					})
				})
			}
		})()),
	],
}
