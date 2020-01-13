import React from "react"

function DebugCSS(props) {
	React.useEffect(() => {
		document.body.classList.toggle("debug-css")
	}, [])
	return props.children
}

export default DebugCSS
