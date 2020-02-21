// const [scrollPastEnd, setScrollPastEnd] = React.useState({})
//
// React.useLayoutEffect(() => {
// 	// React.useCallback(() => {
// 		if (!ref.current.childNodes.length) {
// 			// No-op
// 			return
// 		}
// 		// TODO: data-empty-node?
// 		let endNode = ref.current.lastChild
// 		if (!endNode.hasAttribute("data-node")) {
// 			endNode = endNode.querySelector("[data-node]")
// 		}
// 		const { height } = endNode.getBoundingClientRect()
// 		setScrollPastEnd({ paddingBottom: `calc(100vh - ${height}px - ${SCROLL_BUFFER}px)` })
// 	// }, [state]),
// }, [state.prefersMonoStylesheet, state.didRender])
