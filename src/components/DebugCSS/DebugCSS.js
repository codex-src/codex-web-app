import React from "react"

// `detectCtrlKeyCode` detects whether control and a key
// code (from a key down event) were pressed.
function detectCtrlKeyCode(e, keyCode) {
	const ok = (
		e.ctrlKey &&          // Accept.
		!e.altKey &&          // Negate.
		!e.metaKey &&         // Negate.
		e.keyCode === keyCode // Accept.
	)
	return ok
}

function DebugCSS(props) {
	React.useEffect(() => {
		const handleKeyDown = e => {
			if (!detectCtrlKeyCode(e, props.keyCode)) {
				return
			}
			e.preventDefault()
			document.body.classList.toggle("debug-css")
		}
		document.addEventListener("keydown", handleKeyDown)
		return () => {
			document.removeEventListener("keydown", handleKeyDown)
		}
	}, [props.keyCode])
	return props.children
}

export default DebugCSS
