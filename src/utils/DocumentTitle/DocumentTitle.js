import React from "react"

export function LayoutDocumentTitle(props) {
	React.useLayoutEffect(() => {
		document.title = props.title
	}, [props.title])
	return props.children
}

export function DocumentTitle(props) {
	React.useEffect(() => {
		document.title = props.title
	}, [props.title])
	return props.children
}
