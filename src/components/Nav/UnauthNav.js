import * as constants from "__constants"
import * as DarkMode from "components/DarkMode"
import * as DropDown from "./DropDown"
import * as Hero from "react-heroicons"
import * as Icons from "svgs"
import Icon from "utils/Icon"
import Link from "components/Link"
import React from "react"
import useDarkModeNav from "./useDarkModeNav"
import useDropDown from "hooks/useDropDown"

const NavLink = props => (
	// NOTE: Use hover:text-md-blue-a200 for light mode
	<Link className="px-3 text-black dark:text-white hover:text-md-blue-a400 hover:dark:text-md-blue-a200 flex flex-row items-center transition duration-75" {...props}>
		<p className="tracking-wide">
			{props.children}
		</p>
	</Link>
)

const NavButtonDarkMode = props => {
	const [darkMode, setDarkMode] = DarkMode.useDarkMode()

	return (
		<button className="px-3 flex flex-row items-center" onPointerDown={e => e.preventDefault()} onClick={e => setDarkMode(!darkMode)}>
			<Icon
				className="w-6 h-6 text-md-blue-a400 dark:text-md-blue-a100"
				svg={!darkMode
					? Hero.SunOutlineMd
					: Hero.SunSolidSm
				}
			/>
		</button>
	)
}

const NavLinkCTA = props => (
	<div className="mx-3 flex flex-row items-center">
		<Link className="px-4 py-3 bg-white dark:bg-gray-800 border border-transparent dark:border-gray-750 rounded-md focus:outline-none shadow-hero focus:shadow-outline transition duration-150" {...props}>
			<p className="font-medium text-md-blue-a400 dark:text-white">
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
					<Icon className="w-8 h-8 text-md-blue-a400" svg={Icons.CodexLogo} />
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
							to={constants.PATH_HOME}
							children="Home"
						/>
						<DropDown.HR />
						<DropDown.Link
							to={constants.PATH_README}
							children="Readme"
						/>
						<DropDown.Link
							to={constants.PATH_DEMO}
							children="Try the demo"
						/>
						<DropDown.Link
							to={constants.PATH_CHANGELOG}
							children="Changelog"
						/>
						<DropDown.HR />
						<DropDown.Link
							to={constants.PATH_AUTH}
							children="Open your Codex"
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
		<div ref={ref} className="fixed inset-x-0 top-0 flex flex-row justify-center bg-white dark:bg-gray-900 z-30 transition duration-300">
			<div className="px-6 flex flex-row justify-between w-full max-w-screen-lg h-20">
				<Nav />
			</div>
		</div>
	)
}

export default UnauthNav
