import * as constants from "__constants"
import * as Feather from "react-feather"
import * as Hero from "utils/heroicons"
import * as User from "components/User"
import CSSDebugger from "utils/CSSDebugger" // eslint-disable-line no-unused-vars
import Link from "components/Link"
import React from "react"
import useClickAway from "utils/hooks/useClickAway"
import useEscape from "utils/hooks/useEscape"
import { ReactComponent as CodexLogo } from "svg/codex_4x1.svg"

const UnauthNav = React.forwardRef(({ open, setOpen, ...props }, ref) => (
	<div className="px-6 fixed inset-x-0 top-0 flex flex-row justify-center h-20 bg-white z-30 select-none">
		<div className="relative flex flex-row justify-between w-full max-w-screen-lg">

			{/* LHS: */}
			<div className="-mx-3 flex flex-row">
				<Link className="px-3 flex flex-row items-center" to={constants.PATH_HOME} data-e2e="nav-home">
					<Feather.Layers className="mr-3 w-6 h-6 text-md-blue-a400" />
					<CodexLogo className="w-24 h-6" />
				</Link>
			</div>

			{/* RHS: */}
			<div className="-mx-3 flex flex-row md:hidden">
				<div className="p-3 flex flex-row items-center cursor-pointer" onClick={e => setOpen(!open)}>
					<Feather.Menu className="w-6 h-6 stroke-500" />
				</div>
			</div>

			{/* RHS - drop down: */}
			<div ref={ref} className={`-mx-3 -mt-4 md:mt-0 py-4 md:py-0 absolute right-0 top-full ${!open ? "hidden" : "block"} md:static md:flex md:flex-row bg-white rounded-lg shadow-hero-lg md:shadow-none`}>
				<Link to={constants.PATH_TODO} className="px-7 md:px-4 py-3 flex flex-row items-center text-gray-900 hover:text-md-blue-a400 hover:bg-gray-100 md:hover:bg-transparent active:bg-gray-200 tx-75">
					<p className="font-medium text-px">
						What is Codex?
					</p>
				</Link>
				<Link to={constants.PATH_DEMO} className="px-7 md:px-4 py-3 flex flex-row items-center text-gray-900 hover:text-md-blue-a400 hover:bg-gray-100 md:hover:bg-transparent active:bg-gray-200 tx-75">
					<p className="font-medium text-px">
						Try the editor
					</p>
				</Link>
				<div className="mx-3 md:ml-4 mt-4 md:mt-0 flex flex-row items-center">
					<Link className="px-4 py-3 !box-content flex flex-row items-center text-md-blue-a400 bg-white hover:bg-gray-100 active:bg-white rounded-md shadow-hero-md hover:shadow-hero-lg active:shadow-hero tx-150" to={constants.PATH_AUTH} data-e2e="nav-cta-btn">
						<p className="font-medium text-px">
							Open your Codex
						</p>
					</Link>
				</div>
			</div>

		</div>
	</div>
))

const AuthNav = React.forwardRef(({ user, open, setOpen, ...props }, ref) => (
	<div className="px-6 fixed inset-x-0 top-0 flex flex-row justify-center h-20 bg-white z-30 select-none">
		<div className="relative flex flex-row justify-between w-full max-w-screen-lg">

			{/* LHS: */}
			<div className="-mx-3 flex flex-row">
				<Link className="px-3 flex flex-row items-center" to={constants.PATH_HOME} data-e2e="nav-home">
					<Feather.Layers className="w-8 h-8 text-md-blue-a400" />
				</Link>
			</div>

			{/* RHS: */}
			<div className="-mx-3 flex flex-row">
				<div className="p-3 flex flex-row items-center cursor-pointer" onClick={e => setOpen(!open)}>
					<img className={`w-8 h-8 bg-gray-200 rounded-full outline-none ${!open ? "" : "shadow-outline"} tx-150`} src={user && user.photoURL} tabIndex="0" />
				</div>
			</div>

			{/* RHS - drop down: */}
			{open && (
				<div ref={ref} className={`-mx-3 -mt-4 py-2 absolute right-0 top-full w-56 bg-gray-50 rounded-lg shadow-hero-lg`}>
					<Link to={constants.PATH_TODO} className="px-4 py-2 flex flex-row justify-between items-center text-gray-800 hover:bg-md-gray-100 active:bg-md-gray-200 tx-75">
						<p className="font-medium -text-px">
							Create a new note
						</p>
						<div className="ml-2 px-1 py-px font-mono text-xs tracking-widest text-gray-600 border rounded">
							^+N
						</div>
					</Link>
					<Link to={constants.PATH_TODO} className="px-4 py-2 flex flex-row justify-between items-center text-gray-800 hover:bg-md-gray-100 active:bg-md-gray-200 tx-75">
						<p className="font-medium -text-px">
							My notes
						</p>
						<div className="ml-2 px-1 py-px font-mono text-xs tracking-widest text-gray-600 border rounded">
							^+M
						</div>
					</Link>
					{/* <div className="my-2 h-1 bg-md-gray-100" /> */}
					<hr className="my-2" />
					<Link to={constants.PATH_TODO} className="px-4 py-2 flex flex-row justify-between items-center text-gray-800 hover:bg-md-gray-100 active:bg-md-gray-200 tx-75">
						<p className="font-medium -text-px">
							Preferences
						</p>
					</Link>
					{/* <div className="my-2 h-1 bg-md-gray-100" /> */}
					<hr className="my-2" />
					<Link to={constants.PATH_TODO} className="px-4 py-2 flex flex-row justify-between items-center text-red-600 hover:bg-red-100 active:bg-red-200 tx-75">
						<p className="font-medium -text-px">
							Sign out
						</p>
					</Link>
					{/* <div className="mx-3 mt-4 flex flex-row items-center"> */}
					{/* 	<Link className="px-4 py-2 !box-content flex flex-row items-center text-md-blue-a400 hover:bg-gray-100 active:bg-gray-200 !border !border-md-blue-a400 rounded-md shadow-hero-md hover:shadow-hero-lg tx-150" to={constants.PATH_AUTH} data-e2e="nav-cta-btn"> */}
					{/* 		<p className="font-medium -text-px"> */}
					{/* 			Create a new note */}
					{/* 		</p> */}
					{/* 	</Link> */}
					{/* </div> */}
				</div>
			)}

		</div>
	</div>
))

const Nav = props => {
	const ref = React.useRef()

	const [user] = React.useContext(User.Context)

	const [open, setOpen] = React.useState(false)
	useEscape(open, setOpen)
	useClickAway(ref, open, setOpen)

	let Component = null
	if (!user) {
		Component = <UnauthNav ref={ref} {...props} open={open} setOpen={setOpen} />
	} else {
		Component = <AuthNav ref={ref} {...props} user={user} open={open} setOpen={setOpen} />
	}
	// return React.cloneElement(Component, { ...props, user, open, setOpen })
	return Component
}

export default Nav
