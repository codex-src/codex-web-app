import EnumStylesheets from "./EnumStylesheets"

export const initialState = {
	// antialiased: true,
	darkMode:       false,
	paddingX:       0,
	paddingY:       0,
	placeholder:    "Hello, world! 👋",
	previewMode:    false,
	primary:        false,
	readme:         false,
	readOnly:       false,
	scrollPastEnd:  false,
	shortcuts:      false,
	statusBars:     false,
	stylesheet:     EnumStylesheets.TYPE,
	textBackground: false,
	toolbar:        false,
	whiteSpace:     false,
	wordWrap:       false,
}

export const reducer = ({ prefs }) => ({
	toggleStylesheet(stylesheet) {
		prefs.stylesheet = stylesheet
	},
	toggleTextBackground() {
		const { previewMode } = prefs
		prefs.previewMode = false // Reset
		if (previewMode) {
			// No-op
			return
		}
		prefs.textBackground = !prefs.textBackground
	},
	togglePreviewMode() {
		prefs.previewMode = !prefs.previewMode
	},
	toggleReadme() {
		prefs.readme = !prefs.readme
	},
})
