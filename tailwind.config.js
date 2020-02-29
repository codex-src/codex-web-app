const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
	theme: {
		extend: {
			borderRadius: {
				"xl": "1rem",
				"2xl": "2rem",
			},
			boxShadow: {
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
				"gray":   {
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
				"brand-sans": "'Inter var', sans-serif",
				"brand-sans-round": "'DM Sans', monospace",
				"brand-mono": "'iA Writer Mono var', monospace",
				"brand-duo": "'iA Writer Duo var', monospace",
				"brand-quattro": "'iA Writer Quattro var', sans-serif",
			},
			// fontSize: {
			// 	"xs":     "0.75rem",   // 12px
			// 	"sm":     "0.875rem",  // 14px
			// 	// "-px": "0.9375rem", // 15px
			// 	"base":   "1rem",      // 16px
			// 	"px":     "1.0625rem", // 17px
			// 	"lg":     "1.125rem",  // 18px
			// 	"xl":     "1.25rem",   // 20px
			// 	"1.5xl":  "1.375rem",  // 22px
			// 	"2xl":    "1.5rem",    // 24px
			// 	"2.5xl":  "1.6875rem", // 27px
			// 	"3xl":    "1.875rem",  // 30px
			// 	"3.5xl":  "2.0625rem", // 33px
			// 	"4xl":    "2.25rem",   // 36px
			// 	"4.5xl":  "2.625rem",  // 42px
			// 	"5xl":    "3rem",      // 48px
			// 	"5.5xl":  "3.5rem",    // 56px
			// 	"6xl":    "4rem",      // 64px
			// },
			inset: {
				"1/2":  "50%",
				"full": "100%",
			},
			letterSpacing: {
				"-px": "-0.0125em",
				"px":  "0.0125em",
			},
			lineHeight: {
				1.0: "1.0",
				1.1: "1.1",
				1.2: "1.2",
				1.3: "1.3",
				1.4: "1.4",
				1.5: "1.5",
				1.6: "1.6",
				1.7: "1.7",
				1.8: "1.8",
				1.9: "1.9",
				2.0: "2.0",
			},
			opacity: {
				 5: "0.05",
				10: "0.10",
				90: "0.90",
				95: "0.95",
			},
			spacing: {
				"72": "18rem",

				// https://youtube.com/watch?v=jl_tdhBxc_Y
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
	},
	variants: {
		backgroundColor: ["responsive", "disabled", "hover", "focus", "active"],
		textColor:       ["responsive", "disabled", "hover", "focus", "active"],
		boxShadow:       ["responsive", "disabled", "hover", "focus", "active"],
	},
	plugins: [],
}
