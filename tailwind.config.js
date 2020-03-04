const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
	theme: {
		extend: {
			borderRadius: {
				"lg-xl": "0.75rem",
				"xl":    "1rem",
				"2xl":   "2rem",
			},
			boxShadow: {
				"px": `
					0 0 0 1px rgba(0, 0, 0, 0.05)
				`,
				"2px": `
					0 0 0 2px rgba(0, 0, 0, 0.05)
				`,
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
					...defaultTheme.colors.gray,
					50: "#fbfdfe",
				},
				// https://material.io/design/color/the-color-system.html#tools-for-picking-colors
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
			},
			fontFamily: {
				"dm-sans":           "'DM Sans', sans-serif",
				"ia-writer-mono":    "'iA Writer Mono var', monospace",
				"ia-writer-duo":     "'iA Writer Duo var', monospace",
				"ia-writer-quattro": "'iA Writer Quattro var', sans-serif",
			},
			fontSize: {
				"sm-md": "0.9375rem",
				"md-lg": "1.0625rem",
			},
			inset: {
				"1/2":  "50%",
				"full": "100%",
			},
			letterSpacing: {
				"-px": "-0.0125em",
				"px":  "0.0125em",
			},
			opacity: {
				 5: "0.05",
				10: "0.10",
				15: "0.15",
				20: "0.20",
				25: "0.25",
				75: "0.75",
				80: "0.80",
				85: "0.85",
				90: "0.90",
				95: "0.95",
			},
			spacing: {
				// https://youtube.com/watch?v=jl_tdhBxc_Y
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
			// https://feathericons.com
			strokeWidth: {
				hairline:  1,    // 100
				thin:      1.33, // 200
				light:     1.67, // 300
				normal:    2,    // 400
				medium:    2.33, // 500
				semibold:  2.67, // 600
				bold:      3,    // 700
				extrabold: 3.33, // 800
				black:     4,    // 900
			},
		},
		screens: {
			xs: `${512 + 24 + 24}px`,
			// => @media (min+width: 560px) { ... }

			sm: `${640 + 24 + 24}px`,
			// => @media (min+width: 688px) { ... }

			md: `${768 + 24 + 24}px`,
			// => @media (min+width: 816px) { ... }

			lg: `${1024 + 24 + 24}px`,
			// => @media (min+width: 1072px) { ... }

			xl: `${1280 + 24 + 24}px`,
			// => @media (min-width: 1328px) { ... }
		},
	},
	variants: {
		textAlign: ["responsive"],

		backgroundColor: ["responsive", "disabled", "hover", "focus", "active"],
		boxShadow:       ["responsive", "disabled", "hover", "focus", "active"],
		textColor:       ["responsive", "disabled", "hover", "focus", "active"],
	},
	plugins: [],
}
