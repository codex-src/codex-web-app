import EnumStylesheets from "../EnumStylesheets"
import platform from "utils/platform"
import React from "react"

function useShortcuts(state, dispatch) {
	React.useEffect(
		React.useCallback(() => {
			if (!state.prefs.shortcuts) {
				// No-op
				return
			}
			const onKeyDown = e => {
				switch (true) {
				// Stylesheet/type:
				case platform.detectKeyCode(e, 49, { shiftKey: true }):
					e.preventDefault()
					dispatch.toggleStylesheet(EnumStylesheets.TYPE)
					return
				// Stylesheet/mono:
				case platform.detectKeyCode(e, 50, { shiftKey: true }):
					e.preventDefault()
					dispatch.toggleStylesheet(EnumStylesheets.MONO)
					return
				// Text background:
				case platform.detectKeyCode(e, 80, { shiftKey: true }):
					e.preventDefault()
					dispatch.toggleTextBackground()
					return
				// Preview mode:
				case platform.detectKeyCode(e, 80, { shiftKey: false }):
					e.preventDefault()
					dispatch.togglePreviewMode()
					return
				default:
					// No-op
					break
				}
			}
			document.addEventListener("keydown", onKeyDown)
			return () => {
				document.removeEventListener("keydown", onKeyDown)
			}
		}, [state, dispatch]),
		[state.prefs.shortcuts],
	)
}

export default useShortcuts
