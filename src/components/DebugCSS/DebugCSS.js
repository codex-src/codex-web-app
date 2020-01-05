import platform from "lib/platform"
import React from "react"

const keyCodeBackslash = 220

function isBackslash(e) {
	const ok = (
		platform.isMetaOrCtrlKey(e) &&
		e.keyCode === 220
	)
	return ok
}

// https://freecodecamp.org/news/88529aa5a6a3
function DebugCSS(props) {
	// https://github.com/facebook/react/issues/4244#issuecomment-116406998
	const ref = React.useRef()
	React.useEffect(() => {
		const handleKeyDown = e => {
			if (!isBackslash(e)) {
				return
			}
			e.preventDefault()
			ref.current.classList.toggle("debug-css")
		}
		document.addEventListener("keydown", handleKeyDown)
		return () => {
			document.removeEventListener("keydown", handleKeyDown)
		}
	}, [props])
	return React.cloneElement(props.children, { ref })
}

export default DebugCSS
