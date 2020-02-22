import EnumStylesheets from "./EnumStylesheets"

export const initialState = {
	// antialiased: true,
	classNames:     "",
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
	getClassNames() {
		const classNames = []
		if (prefs.stylesheet === EnumStylesheets.TYPE) {
			classNames.push("stylesheet-type")
		} else {
			classNames.push("stylesheet-mono")
		}
		if (prefs.previewMode && prefs.textBackground) {
			classNames.push("text-background")
		}
		if (prefs.previewMode) {
			classNames.push("preview-mode")
		}
		prefs.classNames = classNames
	},
	toggleStylesheet(stylesheet) {
		prefs.stylesheet = stylesheet
		this.getClassNames()
	},
	toggleTextBackground() {
		const { previewMode } = prefs
		prefs.previewMode = false // Reset
		if (previewMode) {
			// No-op
			return
		}
		prefs.textBackground = !prefs.textBackground
		this.getClassNames()
	},
	togglePreviewMode() {
		prefs.previewMode = !prefs.previewMode
		this.getClassNames()
	},
	toggleReadme() {
		prefs.readme = !prefs.readme
		this.getClassNames()
	},
})
