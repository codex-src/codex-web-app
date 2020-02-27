import React from "react"

function useClickAway(ref, open, setOpen) {
	React.useEffect(() => {
		if (!open) {
			// No-op
			return
		}
		const h = e => {
			// if (ref.current === e.target || ref.current.contains(e.target)) {
			// 	// No-op
			// 	return
			// }
			// setOpen(false)
			setOpen(ref.current === e.target || ref.current.contains(e.target))
		}
		document.addEventListener("click", h)
		return () => {
			document.removeEventListener("click", h)
		}
	}, [ref, open, setOpen])
}

export default useClickAway
