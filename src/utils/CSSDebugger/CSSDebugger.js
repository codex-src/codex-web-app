import React from "react"

function CSSDebugger(props) {
	React.useEffect(() => {
		document.body.classList.toggle("debug-css")
	}, [])
	return props.children
}

export default CSSDebugger
