import React from "react"

// <CSSDebugger>
//   ...
// </CSSDebugger>
//
// or
//
// <CSSDebugger />
//
const CSSDebugger = props => {
	React.useEffect(() => {
		document.body.classList.toggle("debug-css")
	}, [])
	return props.children || null
}

export default CSSDebugger
