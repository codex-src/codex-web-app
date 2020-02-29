import * as Base from "./Base"
import * as constants from "__constants"
import * as User from "components/User"
import firebase from "__firebase"
import Link from "components/Link"
import React from "react"
import useClickAway from "utils/hooks/useClickAway"
import useEscape from "utils/hooks/useEscape"
import useTransition from "utils/hooks/useTransition"

import "./DropDown.css"

// const Shortcut = props => (
// 	<span className="px-1 py-px font-mono text-xs tracking-widest text-gray-600 bg-gray-50 border rounded">
// 		{props.children}
// 	</span>
// )

const AuthNav = props => {
	const ref = React.useRef()

	const user = User.useUser()
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

	const handleClickSignOut = e => {
		firebase.auth()
			.signOut()
			.catch(err => {
				console.warn(err)
			})
	}

	return (
		<Base.Nav>

			{/* LHS: */}
			<Base.NavLogo to={constants.PATH_HOME} />

			{/* RHS - drop down menu: */}
			<Link className="-mx-3 flex flex-row items-center" onClick={e => setDropDown(!dropDown)}>
				<img className="mx-3 w-8 h-8 bg-gray-200 rounded-full" src={user.photoURL || constants.IMG_TRANS} alt="TODO" />
			</Link>

			{/* RHS - drop down: */}
			<div ref={ref} className="-mx-3 -mt-3 py-2 absolute right-0 top-full w-56 bg-white rounded-lg shadow-hero-lg">
				<Base.DropDownLink
					to={constants.PATH_TODO}
					text="Create a new note"
				/>
				<Base.DropDownLink
					to={constants.PATH_TODO}
					text="My notes"
				/>
				<hr className="my-1" />
				<Base.DropDownLink
					to={constants.PATH_TODO}
					text="Settings"
				/>
				<Base.DropDownLink
					to={constants.PATH_TODO}
					text="Upgrade to unlimited"
				/>
				<hr className="my-1" />
				<Link className="px-4 py-2 flex flex-row justify-between items-center text-gray-800 hover:text-red-600 hover:bg-red-100" onClick={handleClickSignOut}>
					<p className="font-medium -text-px">
						Sign out
					</p>
				</Link>
			</div>

		</Base.Nav>
	)
}

export default AuthNav
