import React from "react"

function useClickAway(ref, open, setOpen) {
	React.useEffect(() => {
		if (!open) {
			// No-op
			return
		}
		const handler = e => {
			if (!ref.current || !e.target) {
				// No-op
				return
			}
			setOpen(ref.current === e.target || ref.current.contains(e.target))
		}
		document.addEventListener("click", handler)
		return () => {
			document.removeEventListener("click", handler)
		}
	}, [ref, open, setOpen])
}

export default useClickAway
