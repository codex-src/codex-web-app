import css from "./__css"
import React from "react"

const stylesheet = css`

.editor {
	-webkit-font-smoothing:  auto;
	-moz-osx-font-smoothing: auto;

	-moz-tab-size: 2;
	tab-size: 2;
	font: 16px/1.65 "iA Writer Duo", monospace;
}

.code-block,
.code {
	font: 1em/1.45 "iA Writer Mono";
}

`

const Stylesheet = React.forwardRef((props, ref) => (
	<style ref={ref}>
		{stylesheet}
	</style>
))

export default Stylesheet
