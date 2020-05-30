import React from "react"

function useEscape(ref, callback) {
	React.useEffect(() => {
		if (!ref.current) {
			// No-op
			return
		}
		const handler = e => {
 			if (!ref.current) {
				// No-op
				return
			}
			if (e.key === "Escape") {
				callback()
			}
		}
		document.addEventListener("keydown", handler)
		return () => {
			document.removeEventListener("keydown", handler)
		}
	}, [ref, callback])
}

export default useEscape
