import React from "react"
import ReactDOM from "react-dom"

function Overlay(props) {
	React.useLayoutEffect(() => {
		const root = document.getElementById("root")
		root.style.display = "none"
		return () => {
			root.style.display = ""
		}
	}, [])

	const root2 = document.getElementById("root2")
	return ReactDOM.createPortal(props.children, root2)
}

export default Overlay
