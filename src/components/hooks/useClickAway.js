import React from "react"

// TODO: Change to "pointerdown"?
function useClickAway(ref, callback) {
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
			if (e.target !== ref.current && !ref.current.contains(e.target)) {
				callback()
			}
		}
		document.addEventListener("click", handler)
		return () => {
			document.removeEventListener("click", handler)
		}
	}, [ref, callback])
}

export default useClickAway
