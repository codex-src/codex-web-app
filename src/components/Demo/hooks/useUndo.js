import React from "react"

function useUndo(state, dispatch) {
	const id = React.useRef()
	React.useEffect(
		React.useCallback(() => {
			if (state.prefs.readOnly || state.prefs.previewMode) {
				// No-op
				return
			}
			if (!state.shouldRender) {
				dispatch.storeUndo()
				return
			}
			id.current = setTimeout(() => {
				dispatch.storeUndo()
			}, 250)
			return () => {
				clearTimeout(id.current)
			}
		}, [state, dispatch]),
		[state.shouldRender], // state.data?
	)
}

export default useUndo
