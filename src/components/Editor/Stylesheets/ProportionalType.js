import css from "./__css"
import React from "react"

const stylesheet = css`

.editor {
	-moz-tab-size: 4;
	tab-size: 4;
	font: 19px/1.65 system-ui;
}

.code-block,
.code {
	-webkit-font-smoothing:  auto;
	-moz-osx-font-smoothing: auto;

	-moz-tab-size: 2;
	tab-size: 2;
	font: calc(16/19 * 1em)/1.45 "iA Writer Mono", monospace;
}

`

const Stylesheet = React.forwardRef((props, ref) => (
	<style ref={ref}>
		{stylesheet}
	</style>
))

export default Stylesheet
