import * as constants from "__constants"
import * as DropDown from "./DropDown"
import * as Hero from "react-heroicons"
import * as SVG from "svgs"
import Link from "components/Link"
import React from "react"
import useDropDown from "hooks/useDropDown"

const NavLink = props => (
	<Link className="px-3 flex flex-row items-center text-gray-800 hover:text-md-blue-a400 trans-75" {...props}>
		<p className="font-medium">
			{props.text}
		</p>
	</Link>
)

const NavLinkCTA = props => (
	<div className="mx-3 flex flex-row items-center">
		<Link className="px-4 py-3 bg-white text-md-blue-a400 hover:bg-gray-100 active:bg-white rounded-md shadow-hero-md hover:shadow-hero-lg active:shadow-hero trans-150" {...props}>
			<p className="font-medium">
				{props.text}
			</p>
		</Link>
	</div>
)

const Content = props => {
	const ref = React.useRef()

	const [dropDown, setDropDown] = useDropDown(ref)

	return (
		<React.Fragment>

			{/* LHS */}
			<div className="-mx-3 flex flex-row">
				<Link className="px-3 flex flex-row items-center" to={constants.PATH_HOME}>
					<SVG.CodexLogo className="w-8 h-8 text-md-blue-a400" />
				</Link>
			</div>

			{/* RHS (1 of 2) */}
			<div className="-mx-3 hidden md:flex md:flex-row">
				{/* <NavLink */}
				{/* 	to={constants.TODO} */}
				{/* 	text="Write example" */}
				{/* /> */}
				<NavLink
					to={constants.PATH_README}
					text="Readme"
				/>
				<NavLink
					to={constants.PATH_DEMO}
					text="Demo"
				/>
				<NavLink
					to={constants.PATH_CHANGELOG}
					text="Changelog"
				/>
				<NavLinkCTA
					to={constants.PATH_AUTH}
					text="Open your Codex"
				/>
			</div>

			{/* RHS (2 of 2) */}
			<div className="-mx-3 flex flex-row md:hidden">
				<div className="px-3 relative flex flex-row items-center">

					<button onPointerDown={e => e.preventDefault()} onClick={e => setDropDown(!dropDown)}>
						<Hero.MenuOutlineMd className="w-8 h-8" />
					</button>

					<DropDown.Base ref={ref}>
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
		<div ref={ref} className="fixed inset-x-0 top-0 flex flex-row justify-center bg-white z-30 trans-300">
			<div className="px-6 flex flex-row justify-between w-full max-w-screen-lg h-20">
				<Content />
			</div>
		</div>
	)
}

export default UnauthNav
