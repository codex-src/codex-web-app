import React from "react"

export const LayoutDocumentTitle = props => {
	React.useLayoutEffect(() => {
		document.title = props.title
	}, [props.title])
	return props.children
}

export const DocumentTitle = props => {
	React.useEffect(() => {
		document.title = props.title
	}, [props.title])
	return props.children
}
