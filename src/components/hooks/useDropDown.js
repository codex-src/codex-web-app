import React from "react"
import useClickAway from "utils/hooks/useClickAway"
import useEscape from "utils/hooks/useEscape"
import useTransition from "utils/hooks/useTransition"

import "./useDropDown.css"

function useDropDown(ref) {
	const [dropDown, setDropDown] = React.useState(false)

	useEscape(dropDown, setDropDown)
	useClickAway(ref, dropDown, setDropDown)

	useTransition({
		ref,
		state: dropDown,
		enterClass: "drop-down-enter",
		activeClass: "drop-down-active",
		durationMs: 300,
	})

	return [dropDown, setDropDown]
}

export default useDropDown
