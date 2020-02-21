import React from "react"
import useEscape from "./useEscape"

function useFixed() {
	const [open, setOpen] = React.useState(false)
	useEscape(open, setOpen)

	const didMount = React.useRef()
	React.useEffect(() => {
		if (!didMount.current) {
			didMount.current = true
			return
		}
		/* eslint-disable no-multi-spaces */
		if (open) {
			const { scrollY } = window // Takes precedence
			document.body.style.position = "fixed"
			document.body.style.left     = 0
			document.body.style.right    = 0
			document.body.style.top      = `${-scrollY}px`
		} else {
			const { top } = document.body.style
			document.body.style.position = ""
			document.body.style.left     = ""
			document.body.style.right    = ""
			document.body.style.top      = ""
			window.scrollTo(0, -top.slice(0, -2))
		}
		/* eslint-enable no-multi-spaces */
	}, [open])

	return [open, setOpen]
}

export default useFixed
