import * as constants from "__constants"
import * as DarkMode from "components/DarkMode"
import * as DropDown from "./DropDown"
import * as Icons from "svgs"
import * as User from "components/User"
import DarkModeIcon from "./DarkModeIcon"
import firebase from "__firebase"
import Icon from "utils/Icon"
import Link from "components/Link"
import React from "react"
import useDarkModeNav from "./useDarkModeNav"
import useDropDown from "hooks/useDropDown"

const NavButtonDarkMode = props => {
	const [darkMode, setDarkMode] = DarkMode.useDarkMode()

	return (
		<button className="px-3 flex flex-row items-center" onPointerDown={e => e.preventDefault()} onClick={e => setDarkMode(!darkMode)}>
			<DarkModeIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-300" darkMode={darkMode} />
		</button>
	)
}

const Nav = props => {
	const ref = React.useRef()

	const user = User.useUser()
	const [dropDown, setDropDown] = useDropDown(ref)

	// Force blur:
	React.useLayoutEffect(() => {
		ref.current.blur()
	}, [dropDown])

	const handleClickSignOut = e => {
		const ok = window.confirm("Are you sure you want logout?")
		if (!ok) {
			// No-op
			return
		}
		firebase.auth().signOut().catch(err => {
			console.warn(err)
		})
	}

	return (
		<React.Fragment>

			{/* LHS */}
			<div className="-mx-3 flex flex-row">
				<Link className="px-3 flex flex-row items-center" to={constants.PATH_HOME}>
					{/* NOTE: Do not use transform scale-110 because
					AuthNav is shorter */}
					<Icon className="w-8 h-8 text-md-blue-a400" svg={Icons.CodexLogo} />
				</Link>
			</div>

			{/* RHS */}
			<div className="-mx-3 flex flex-row">

				<NavButtonDarkMode />

				<div className="px-3 relative flex flex-row items-center">

					{/* Button */}
					<button className="bg-gray-100 rounded-full focus:outline-none focus:shadow-outline overflow-hidden transition duration-150 ease-in-out" onPointerDown={e => e.preventDefault()} onClick={e => setDropDown(!dropDown)}>
						<img className="w-8 h-8" src={user.photoURL || constants.TRANSPARENT_PX} alt="" />
					</button>

					{/* Drop down */}
					<DropDown.Base ref={ref}>
						<DropDown.Link
							to={constants.PATH_NEW_NOTE}
							text="Create a new note"
						/>
						<DropDown.Link
							to={constants.PATH_MY_NOTES}
							text="My notes"
						/>
						<DropDown.HR />
						<DropDown.Link
							to={constants.PATH_README}
							text="Readme"
						/>
						<DropDown.Link
							to={constants.PATH_CHANGELOG}
							text="Changelog"
						/>
						<DropDown.HR />
						<DropDown.Link
							onClick={handleClickSignOut}
							text="Logout"
						/>
					</DropDown.Base>

				</div>

			</div>

		</React.Fragment>
	)
}

const AuthNav = props => {
	const ref = React.useRef()

	const [darkMode] = DarkMode.useDarkMode()

	useDarkModeNav(ref, darkMode)

	return (
		<div ref={ref} className="fixed inset-x-0 top-0 flex flex-row justify-center bg-white dark:bg-gray-900 z-30 trans-300">
			<div className="px-6 flex flex-row justify-between w-full max-w-screen-lg h-16">
				<Nav />
			</div>
		</div>
	)
}

export default AuthNav
