import React from "react"

function useEscape(open, setOpen) {
	React.useEffect(() => {
		if (!open) {
			// No-op
			return
		}
		const h = e => {
			setOpen(e.keyCode !== 27)
		}
		document.addEventListener("keydown", h)
		return () => {
			document.removeEventListener("keydown", h)
		}
	}, [open, setOpen])
}

export default useEscape
