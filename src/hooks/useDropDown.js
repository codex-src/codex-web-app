import React from "react"
import useClickAway from "./useClickAway"
import useEscape from "./useEscape"
import useTransition from "./useTransition"

import "./useDropDown.css"

const enterClass  = "drop-down-enter"  // eslint-disable-line no-multi-spaces
const activeClass = "drop-down-active" // eslint-disable-line no-multi-spaces
const durationMs  = 300                // eslint-disable-line no-multi-spaces

function useDropDown(ref) {
	const [dropDown, setDropDown] = React.useState(false)
	useEscape(dropDown, setDropDown)
	useClickAway(ref, dropDown, setDropDown)
	useTransition({ ref, state: dropDown, enterClass, activeClass, durationMs })
	return [dropDown, setDropDown]
}

export default useDropDown
