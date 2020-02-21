import React from "react"

function useUndo(state, dispatch) {
	const id = React.useRef()
	React.useEffect(
		React.useCallback(() => {
			const h = () => {
				dispatch.storeUndo()
			}
			id.current = setTimeout(h, 250)
			return () => {
				clearTimeout(id.current)
			}
		}, [dispatch]),
		[state.shouldRender],
	)
}

export default useUndo
