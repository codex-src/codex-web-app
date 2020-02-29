import * as Base from "./Base"
import * as constants from "__constants"
import * as Feather from "react-feather"
import Link from "components/Link"
import React from "react"
import useClickAway from "utils/hooks/useClickAway"
import useEscape from "utils/hooks/useEscape"
import useTransition from "utils/hooks/useTransition"

import "./DropDown.css"

const UnauthNav = props => {
	const ref = React.useRef()

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

	return (
		<Base.Nav>

			{/* LHS: */}
			<Base.NavLogo to={constants.PATH_HOME} />

			{/* RHS: */}
			<div className="-mx-3 hidden md:flex md:flex-row">
				<Base.NavLink
					to={constants.PATH_TODO}
					text="What’s Codex?"
				/>
				<Base.NavLink
					to={constants.PATH_TODO}
					text="Features"
				/>
				<Base.NavLink
					to={constants.PATH_TODO}
					text="Questions"
				/>
				<Base.NavLinkCTA
					to={constants.PATH_AUTH}
					text="Open your Codex"
				/>
			</div>

			{/* RHS - drop down menu: */}
			<Link className="-mx-3 flex flex-row items-center md:hidden" onClick={e => setDropDown(!dropDown)}>
				<Feather.ChevronDown className="mx-3 w-6 h-6 stroke-medium text-gray-800" />
			</Link>

			{/* RHS - drop down: */}
			<div ref={ref} className="-mt-3 py-2 absolute right-0 top-full w-56 bg-white rounded-lg shadow-hero-lg">
				<Base.DropDownLink
					to={constants.PATH_TODO}
					text="What’s Codex?"
				/>
				<Base.DropDownLink
					to={constants.PATH_TODO}
					text="Features"
				/>
				<Base.DropDownLink
					to={constants.PATH_TODO}
					text="Questions"
				/>
				<Base.DropDownLink
					to={constants.PATH_AUTH}
					text="Open your Codex"
				/>
			</div>

		</Base.Nav>
	)
}

export default UnauthNav
