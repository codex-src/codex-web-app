import * as Base from "./Base"
import * as constants from "__constants"
import * as Feather from "react-feather"
import * as User from "components/User"
import firebase from "__firebase"
import Link from "components/Link"
import React from "react"
import useDropDown from "hooks/useDropDown"

export const UnauthNav = props => {
	const ref = React.useRef()

	const [dropDown, setDropDown] = useDropDown(ref)

	return (
		<Base.Nav>

			{/* LHS */}
			<Base.NavLogo to={constants.PATH_HOME} />

			{/* RHS */}
			<div className="-mx-3 hidden md:flex md:flex-row">
				<Base.NavLink
					to={constants.TODO}
					children="TODO"
				/>
				<Base.NavLink
					to={constants.TODO}
					children="TODO"
				/>
				<Base.NavLinkCTA
					to={constants.PATH_AUTH}
					children="Open your Codex"
				/>
			</div>

			{/* RHS - drop down button */}
			<Link className="-mx-3 flex flex-row items-center md:hidden" onClick={e => setDropDown(!dropDown)}>
				<Feather.ChevronDown className="mx-3 w-6 h-6 stroke-medium text-gray-800" />
			</Link>

			{/* RHS - drop down */}
			<Base.DropDown ref={ref}>
				<Base.DropDownLink
					to={constants.TODO}
					children="TODO"
				/>
				<Base.DropDownLink
					to={constants.TODO}
					children="TODO"
				/>
				<Base.DropDownLink
					to={constants.PATH_AUTH}
					children="Open your Codex"
				/>
			</Base.DropDown>

		</Base.Nav>
	)
}

export const AuthNav = props => {
	const ref = React.useRef()

	const user = User.useUser()
	const [dropDown, setDropDown] = useDropDown(ref)

	const handleClickSignOut = e => {
		firebase.auth()
			.signOut()
			.catch(err => {
				console.warn(err)
			})
	}

	return (
		<Base.Nav>

			{/* LHS */}
			<Base.NavLogo to={constants.PATH_HOME} />

			{/* RHS - drop down button */}
			<Link className="-mx-3 flex flex-row items-center" onClick={e => setDropDown(!dropDown)}>
				<img className="mx-3 w-8 h-8 bg-gray-200 rounded-full" src={user.photoURL || constants.IMG_TRANS} />
			</Link>

			{/* RHS - drop down */}
			<Base.DropDown ref={ref}>
				<Base.DropDownLink
					to={constants.TODO}
					children="Create a new note"
				/>
				<Base.DropDownLink
					to={constants.TODO}
					children="My notes"
				/>
				<hr className="my-1" />
				<Base.DropDownLink
					to={constants.TODO}
					children="Settings"
				/>
				<Base.DropDownLink
					to={constants.TODO}
					children="Upgrade to unlimited"
				/>
				<hr className="my-1" />
				<Base.DropDownLinkWarn
					onClick={handleClickSignOut}
					children="Sign out"
				/>
			</Base.DropDown>

		</Base.Nav>
	)
}

const Nav = props => {
	const user = User.useUser()

	let Component = null
	if (!user) {
		Component = UnauthNav
	} else {
		Component = AuthNav
	}
	return <Component />
}

export default Nav
