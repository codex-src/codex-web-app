import * as constants from "__constants"
import * as DarkMode from "components/DarkMode"
import * as DropDown from "./DropDown"
import * as Hero from "react-heroicons"
import * as Icons from "svgs"
import DarkModeIcon from "./DarkModeIcon"
import Icon from "utils/Icon"
import Link from "components/Link"
import React from "react"
import useDropDown from "hooks/useDropDown"

const NavLink = props => (
	<Link className="px-3 flex flex-row items-center" {...props}>
		<p className="font-medium text-gray-800 dark:text-gray-200">
			{props.children}
		</p>
	</Link>
)

const NavButtonDarkMode = props => {
	const [darkMode, setDarkMode] = DarkMode.useDarkMode()

	return (
		<button className="px-3 flex flex-row items-center" onPointerDown={e => e.preventDefault()} onClick={e => setDarkMode(!darkMode)}>
			<DarkModeIcon className="w-6 h-6 text-gray-800 dark:text-gray-200 transform scale-110" darkMode={darkMode} />
		</button>
	)
}

const NavLinkCTA = props => (
	<div className="mx-3 flex flex-row items-center">
		<Link className="px-4 py-3 bg-white dark:bg-md-blue-a400 rounded-md shadow-hero-md" {...props}>
			<p className="font-medium text-md-blue-a400 dark:text-gray-200">
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
					children="Demo"
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

				{/* Drop down */}
				<div className="px-3 relative flex flex-row items-center">

					{/* Menu */}
					<button onPointerDown={e => e.preventDefault()} onClick={e => setDropDown(!dropDown)}>
						<Hero.MenuOutlineMd className="w-8 h-8 dark:text-gray-100" />
					</button>

					{/* Items */}
					<DropDown.Base ref={ref}>
						<DropDown.Link
							to={constants.PATH_README}
							text="Readme"
						/>
						<DropDown.Link
							to={constants.PATH_DEMO}
							text="Demo"
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

	React.useLayoutEffect(() => {
		const handler = e => {
			if (!window.scrollY) {
				if (!darkMode) {
					ref.current.style.boxShadow = ""
				} else {
					ref.current.classList.replace("dark:bg-gray-875", "dark:bg-gray-900")
					ref.current.style.boxShadow = ""
				}
				// FIXME: Cannot have more than one box-shadow;
				// style takes precedence
				ref.current.classList.remove("shadow", "shadow-md")
			} else {
				if (!darkMode) {
					ref.current.style.boxShadow = ""
				} else if (darkMode) {
					ref.current.classList.replace("dark:bg-gray-900", "dark:bg-gray-875")
					ref.current.style.boxShadow = "0 0 0 1px var(--gray-800)"
				}
				// FIXME: Cannot have more than one box-shadow;
				// style takes precedence
				ref.current.classList.add(!darkMode ? "shadow" : "shadow-md")
			}
		}
		handler()
		window.addEventListener("scroll", handler, false)
		return () => {
			window.removeEventListener("scroll", handler, false)
		}
	}, [darkMode])

	return (
		<div ref={ref} className="fixed inset-x-0 top-0 flex flex-row justify-center bg-white dark:bg-gray-900 z-30 transition duration-300 ease-in-out">
			<div className="px-6 flex flex-row justify-between w-full max-w-screen-lg h-20">
				<Nav />
			</div>
		</div>
	)
}

export default UnauthNav
