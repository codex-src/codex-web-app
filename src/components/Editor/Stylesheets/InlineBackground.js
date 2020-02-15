import css from "./__css"
import React from "react"

const stylesheet = css`

.em,
.strong {
	/* color: hsl(var(--blue-a400)); */
	background: hsla(var(--blue-a400), 0.05);
}

.strikethrough,
.comment .em,
.comment .strong,
.comment .strikethrough {
	background: hsla(var(--gray), 0.1);
}

.em *,
.strong *,
.strikethrough * {
	background: none;
}

.code {
	background: hsl(var(--white)) !important;
}

`

const Stylesheet = React.forwardRef((props, ref) => (
	<style ref={ref}>
		{stylesheet}
	</style>
))

export default Stylesheet
