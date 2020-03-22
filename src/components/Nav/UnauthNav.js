import $NavLink from "components/Link/NavLink"
import * as constants from "__constants"
import * as DropDown from "./DropDown"
import * as Hero from "react-heroicons"
import * as Icons from "svgs"
import Icon from "utils/Icon"
import Link from "components/Link"
import NavButtonDarkMode from "./NavButtonDarkMode"
import React from "react"
import useDropDown from "hooks/useDropDown"
import useTransitionNav from "./useTransitionNav"

const NavLink = props => (
	// eslint-disable-next-line react/jsx-pascal-case
	<$NavLink className="px-3 text-black dark:text-white hover:text-md-blue-a400 hover:dark:text-md-blue-a200 flex flex-row items-center" activeClassName="text-md-blue-a400 dark:text-md-blue-a200" {...props}>
		<p className="tracking-wide">
			{props.children}
		</p>
	</$NavLink>
)

// const NavLinkCTA = props => (
// 	<div className="mx-3 flex flex-row items-center">
// 		{/* NOTE: Use flex flex-row items-center ...
// 		height: 3.3125rem to match <UserAuth> button aesthetic */}
// 		<Link className="px-4 flex flex-row items-center bg-white dark:bg-gray-800 border border-transparent dark:border-gray-750 rounded-lg focus:outline-none shadow-hero focus:shadow-outline transition duration-150" style={{ height: "3.3125rem" /* 53px */ }} {...props}>
// 			<p className="font-medium text-md-blue-a400 dark:text-white">
// 				{props.children}
// 			</p>
// 		</Link>
// 	</div>
// )

const NavLinkCTA = props => (
	<div className="mx-3 flex flex-row items-center">
		<Link className="px-4 py-3 bg-white dark:bg-gray-800 border border-transparent dark:border-gray-750 rounded-lg focus:outline-none shadow-hero focus:shadow-outline transition duration-150" {...props}>
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

				{/* Logo */}
				<Link className="px-3 flex flex-row items-center" to={constants.PATH_HOME}>
					<Icon className="w-8 h-8 text-md-blue-a400 dark:text-md-blue-a200" svg={Icons.CodexLogo} />
				</Link>

				{/* Save status -- for <Demo> */}
				<div className="px-3 flex flex-row items-center">
					{/* NOTE: Use tracking-px instead of tracking-wide */}
					<p id="note-save-status" className="text-md-gray-500 tracking-px" />
				</div>

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
				<NavLink
					to={constants.URL_GITHUB_REPO}
					children="GitHub"
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
							children="Readme"
						/>
						<DropDown.Link
							to={constants.PATH_DEMO}
							children="Demo"
						/>
						<DropDown.Separator />
						<DropDown.Link
							to={constants.PATH_CHANGELOG}
							children="Changelog"
						/>
						<DropDown.Link
							to={constants.URL_GITHUB_REPO}
							children="GitHub"
						/>
						<DropDown.Separator />
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

	useTransitionNav(ref)

	return (
		<div ref={ref} className="fixed inset-x-0 top-0 flex flex-row justify-center bg-white dark:bg-gray-900 border-b border-transparent dark:border-gray-750 shadow z-30 transition duration-300">
			<div className="px-6 flex flex-row justify-between w-full max-w-screen-lg h-20">
				<Nav />
			</div>
		</div>
	)
}

export default UnauthNav
