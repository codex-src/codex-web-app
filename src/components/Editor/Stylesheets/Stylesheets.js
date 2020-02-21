import raw from "raw.macro"
import React from "react"
import EnumStylesheet from "../EnumStylesheets"

const Core = props => (
	<style>{raw("./core.css")}</style>
)
const PreviewMode = props => (
	<style>{raw("./preview-mode.css")}</style>
)
const StylesheetMono = props => (
	<style>{raw("./mono.css")}</style>
)
const StylesheetType = props => (
	<style>{raw("./type.css")}</style>
)
const TextBackground = props => (
	<style>{raw("./text-background.css")}</style>
)

const Stylesheets = ({ state, ...props }) => (
	<React.Fragment>
		<Core />
		{state.prefs.previewMode && <PreviewMode />}
		{state.prefs.stylesheet === EnumStylesheet.TYPE ? (
			<StylesheetType />
		) : (
			<StylesheetMono />
		)}
		{!state.prefs.previewMode && state.prefs.textBackground && <TextBackground />}
	</React.Fragment>
)

export default Stylesheets
