import React from "react"

const KEY_CODE_ESCAPE = 27

function useEscape(open, setOpen) {
	React.useEffect(() => {
		const handler = e => {
			if (e.keyCode !== KEY_CODE_ESCAPE) {
				// No-op
				return
			}
			setOpen(false)
		}
		document.addEventListener("keydown", handler)
		return () => {
			document.removeEventListener("keydown", handler)
		}
	}, [open, setOpen])
}

export default useEscape
