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
				"md-blue-50":             { default: "#e3f2fd" },
				"md-blue-100":            { default: "#bbdefb" },
				"md-blue-200":            { default: "#90caf9" },
				"md-blue-300":            { default: "#64b5f6" },
				"md-blue-400":            { default: "#42a5f5" },
				"md-blue-500":            { default: "#2196f3" },
				"md-blue-600":            { default: "#1e88e5" },
				"md-blue-700":            { default: "#1976d2" },
				"md-blue-800":            { default: "#1565c0" },
				"md-blue-900":            { default: "#0d47a1" },
				"md-blue-a100":           { default: "#82b1ff" },
				"md-blue-a200":           { default: "#448aff" },
				"md-blue-a400":           { default: "#2979ff" },
				"md-blue-a700":           { default: "#2962ff" },
				"md-gray-50":             { default: "#fafafa" },
				"md-gray-100":            { default: "#f5f5f5" },
				"md-gray-200":            { default: "#eeeeee" },
				"md-gray-300":            { default: "#e0e0e0" },
				"md-gray-400":            { default: "#bdbdbd" },
				"md-gray-500":            { default: "#9e9e9e" },
				"md-gray-600":            { default: "#757575" },
				"md-gray-700":            { default: "#616161" },
				"md-gray-800":            { default: "#424242" },
				"md-gray-900":            { default: "#212121" },
			},
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
				"72":    "18rem",
				// https://youtube.com/watch?v=jl_tdhBxc_Y
				"9/16":  "56.25%",
				"10/16": "62.5%",
				"1/2":   "50%",
				"1/3":   "33.333333%",
				"2/3":   "66.666667%",
				"1/4":   "25%",
				"2/4":   "50%",
				"3/4":   "75%",
				"1/5":   "20%",
				"2/5":   "40%",
				"3/5":   "60%",
				"4/5":   "80%",
				"1/6":   "16.666667%",
				"2/6":   "33.333333%",
				"3/6":   "50%",
				"4/6":   "66.666667%",
				"5/6":   "83.333333%",
				"1/12":  "8.333333%",
				"2/12":  "16.666667%",
				"3/12":  "25%",
				"4/12":  "33.333333%",
				"5/12":  "41.666667%",
				"6/12":  "50%",
				"7/12":  "58.333333%",
				"8/12":  "66.666667%",
				"9/12":  "75%",
				"10/12": "83.333333%",
				"11/12": "91.666667%",
			},
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
		// borderColor:  ["responsive", "disabled", "hover", "focus", "active"],
		// borderWidth:  ["responsive", "disabled", "hover", "focus", "active"],
	},
	plugins: [],
}
