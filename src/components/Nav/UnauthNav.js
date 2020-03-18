import * as constants from "__constants"
import * as DarkMode from "components/DarkMode"
import * as DropDown from "./DropDown"
import * as Hero from "react-heroicons"
import * as Icons from "svgs"
import DarkModeIcon from "./DarkModeIcon"
import Icon from "utils/Icon"
import Link from "components/Link"
import React from "react"
import useDarkModeNav from "./useDarkModeNav"
import useDropDown from "hooks/useDropDown"

const NavLink = props => (
	<Link className="px-3 flex flex-row items-center" {...props}>
		<p className="tracking-wide text-gray-900 dark:text-gray-100">
			{props.children}
		</p>
	</Link>
)

const NavButtonDarkMode = props => {
	const [darkMode, setDarkMode] = DarkMode.useDarkMode()

	return (
		<button className="px-3 flex flex-row items-center" onPointerDown={e => e.preventDefault()} onClick={e => setDarkMode(!darkMode)}>
			<DarkModeIcon darkMode={darkMode} />
		</button>
	)
}

// // Previous implementation:
// const NavLinkCTA = props => (
// 	<div className="mx-3 flex flex-row items-center">
// 		<Link className="px-4 py-3 bg-white text-md-blue-a400 hover:bg-gray-100 active:bg-white rounded-md shadow-hero-md hover:shadow-hero-lg active:shadow-hero trans-150" {...props}>
// 			<p className="font-medium">
// 				{props.children}
// 			</p>
// 		</Link>
// 	</div>
// )

const NavLinkCTA = props => (
	<div className="mx-3 flex flex-row items-center">
		<Link className="px-4 py-3 bg-white dark:bg-md-blue-a400 rounded-md shadow-hero-md" /* style={{ boxShadow: "0 8px 16px -8px hsla(210, 100%, 50%, 0.75)" }} */ {...props}>
			<p className="font-medium text-md-blue-a400 dark:text-gray-100">
				{props.children}
			</p>
		</Link>
	</div>
)

const Nav = props => {
	const ref = React.useRef()

	const [dropDown, setDropDown] = useDropDown(ref)

	return (
		<React.Fragment>

			{/* LHS */}
			<div className="-mx-3 flex flex-row">
				<Link className="px-3 flex flex-row items-center" to={constants.PATH_HOME}>
					<Icon className="w-8 h-8 text-md-blue-a400 transform scale-110" svg={Icons.CodexLogo} />
				</Link>
			</div>

			{/* RHS (1 of 2) */}
			<div className="-mx-3 hidden md:flex md:flex-row">
				<NavLink
					to={constants.PATH_README}
					children="Readme"
				/>
				<NavLink
					to={constants.PATH_DEMO}
					children="Try the demo"
				/>
				<NavLink
					to={constants.PATH_CHANGELOG}
					children="Changelog"
				/>
				<NavLinkCTA
					to={constants.PATH_AUTH}
					children="Open your Codex"
				/>
				<NavButtonDarkMode />
			</div>

			{/* RHS (2 of 2) */}
			<div className="-mx-3 flex flex-row md:hidden">

				<NavButtonDarkMode />

				<div className="px-3 relative flex flex-row items-center">

					{/* Button */}
					<button onPointerDown={e => e.preventDefault()} onClick={e => setDropDown(!dropDown)}>
						<Hero.MenuOutlineMd className="w-8 h-8 dark:text-gray-100" />
					</button>

					{/* Drop down */}
					<DropDown.Base ref={ref}>
						<DropDown.Link
							to={constants.PATH_README}
							text="Readme"
						/>
						<DropDown.Link
							to={constants.PATH_DEMO}
							text="Try the demo"
						/>
						<DropDown.Link
							to={constants.PATH_CHANGELOG}
							text="Changelog"
						/>
						<DropDown.Link
							to={constants.PATH_AUTH}
							text="Open your Codex"
						/>
					</DropDown.Base>

				</div>

			</div>

		</React.Fragment>
	)
}

const UnauthNav = props => {
	const ref = React.useRef()

	const [darkMode] = DarkMode.useDarkMode()

	useDarkModeNav(ref, darkMode)

	return (
		<div ref={ref} className="fixed inset-x-0 top-0 flex flex-row justify-center bg-white dark:bg-gray-900 z-30 transition duration-300 ease-in-out">
			<div className="px-6 flex flex-row justify-between w-full max-w-screen-lg h-20">
				<Nav />
			</div>
		</div>
	)
}

export default UnauthNav
