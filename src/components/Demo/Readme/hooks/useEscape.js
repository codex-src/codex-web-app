import React from "react"

function useEscape(open, setOpen) {
	React.useEffect(() => {
		const h = e => {
			if (e.keyCode !== 27) { // 27: Escape
				// No-op
				return
			}
			setOpen(!open)
		}
		document.addEventListener("keydown", h)
		return () => {
			document.removeEventListener("keydown", h)
		}
	}, [open, setOpen])
}

export default useEscape
