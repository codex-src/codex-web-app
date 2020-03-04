import React from "react"

export const LayoutEffect = props => {
	React.useLayoutEffect(() => {
		document.title = props.title
	}, [props.title])
	return props.children
}

export const Effect = props => {
	React.useEffect(() => {
		document.title = props.title
	}, [props.title])
	return props.children
}
