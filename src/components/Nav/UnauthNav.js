import * as constants from "__constants"
import * as DropDown from "./DropDown"
import * as Hero from "react-heroicons"
import * as SVG from "svgs"
import DarkModeIcon from "./DarkModeIcon"
import Link from "components/Link"
import React from "react"
import useDarkMode from "./hooks/useDarkMode"
import useDropDown from "hooks/useDropDown"

const NavLink = props => (
	<Link className="px-3 flex flex-row items-center text-gray-800 dark:text-gray-200" {...props}>
		<p className="font-medium">
			{props.children}
		</p>
	</Link>
)

// NOTE: Does not accept props
const NavButtonDarkMode = ({ darkMode, setDarkMode }) => (
	<button className="px-3 flex flex-row items-center" onPointerDown={e => e.preventDefault()} onClick={e => setDarkMode(!darkMode)}>
		<DarkModeIcon className="w-6 h-6 text-indigo-700 dark:text-orange-300 transform scale-110" darkMode={darkMode} />
	</button>
)

const NavLinkCTA = props => (
	<div className="mx-3 flex flex-row items-center">
		<Link className="px-4 py-3 text-md-blue-a400 dark:text-gray-200 bg-white dark:bg-md-blue-a400 rounded-md shadow-hero-md" {...props}>
			<p className="font-medium">
				{props.children}
			</p>
		</Link>
	</div>
)

const Nav = props => {
	const ref = React.useRef()

	const [darkMode, setDarkMode] = useDarkMode()
	const [dropDown, setDropDown] = useDropDown(ref)

	return (
		<React.Fragment>

			{/* LHS */}
			<div className="-mx-3 flex flex-row">
				<Link className="px-3 flex flex-row items-center" to={constants.PATH_HOME}>
					<SVG.CodexLogo className="w-8 h-8 text-md-blue-a400 transform scale-110" />
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
				<NavButtonDarkMode
					darkMode={darkMode}
					setDarkMode={setDarkMode}
				/>
			</div>

			{/* RHS (2 of 2) */}
			<div className="-mx-3 flex flex-row md:hidden">

				{/* Dark mode */}
				<NavButtonDarkMode
					darkMode={darkMode}
					setDarkMode={setDarkMode}
				/>

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

	React.useLayoutEffect(() => {
		const handler = e => {
			if (!window.scrollY) {
				ref.current.classList.remove("shadow")
			} else {
				ref.current.classList.add("shadow")
			}
		}
		window.addEventListener("scroll", handler, false)
		return () => {
			window.removeEventListener("scroll", handler, false)
		}
	}, [])

	return (
		<div ref={ref} className="fixed inset-x-0 top-0 flex flex-row justify-center bg-white dark:bg-gray-900 z-30">
			<div className="px-6 flex flex-row justify-between w-full max-w-screen-lg h-20">
				<Nav />
			</div>
		</div>
	)
}

export default UnauthNav
