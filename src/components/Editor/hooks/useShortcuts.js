import EnumStylesheets from "../EnumStylesheets"
import React from "react"
import { detectKeyCode } from "utils/platform"

const KEY_CODE_1 = 49
const KEY_CODE_2 = 50
const KEY_CODE_P = 80

function useShortcuts(state, dispatch) {
	React.useEffect(
		React.useCallback(() => {
			if (!state.prefs.shortcuts) {
				// No-op
				return
			}
			const onKeyDown = e => {
				switch (true) {
				case detectKeyCode(e, KEY_CODE_1, { shiftKey: true }):
					e.preventDefault()
					dispatch.toggleStylesheet(EnumStylesheets.TYPE)
					return
				case detectKeyCode(e, KEY_CODE_2, { shiftKey: true }):
					e.preventDefault()
					dispatch.toggleStylesheet(EnumStylesheets.MONO)
					return
				// case detectKeyCode(e, KEY_CODE_P, { shiftKey: true }):
				// 	e.preventDefault()
				// 	dispatch.toggleTextBackground()
				// 	return
				case detectKeyCode(e, KEY_CODE_P):
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
