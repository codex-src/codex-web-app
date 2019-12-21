import Headers from "components/Headers"
import React from "react"
import stylex from "stylex"

function Note(props) {
	return (
		<div>
			<header>
				<Headers.H1 contentEditable>
					Hello
				</Headers.H1>
			</header>
			<p>
				hello, world!
			</p>
		</div>
	)
}

export default Note
