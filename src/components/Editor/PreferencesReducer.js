import EnumStylesheets from "./EnumStylesheets"

export const initialState = {
	darkMode:       false,
	paddingX:       0,
	paddingY:       0,
	placeholder:    "Hello, world! 👋",
	previewMode:    false,
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

// if (state.previewMode && state.textBackground) {
// 	state.previewMode = false // Reset
// 	return
// }
// state.previewMode = false // Reset
// state.textBackground = !state.textBackground

export const reducer = state => ({
	toggleStylesheet(stylesheet) {
		state.stylesheet = stylesheet
	},
	toggleTextBackground() {
		const { previewMode } = state
		state.previewMode = false // Reset
		if (previewMode) {
			// No-op
			return
		}
		state.textBackground = !state.textBackground
	},
	togglePreviewMode() {
		state.previewMode = !state.previewMode
	},
	toggleReadme() {
		state.readme = !state.readme
	},
})
