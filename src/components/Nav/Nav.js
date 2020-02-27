import * as constants from "__constants"
import * as Feather from "react-feather"
import * as User from "components/User"
import CSSDebugger from "utils/CSSDebugger"
import Link from "components/Link"
import React from "react"
import { ReactComponent as CodexLogo } from "svg/codex_4x1.svg"

const NavLink = ({ text, ...props }) => (
	<Link className="px-3 flex flex-row items-center text-gray-800 hover:text-md-blue-a400 tx-75" {...props}>
		<p className="font-medium">
			{text}
		</p>
	</Link>
)

const UnauthNav = props => (
	<div className={`px-6 fixed inset-x-0 top-0 flex flex-row justify-center h-20 z-30 ${props.className || ""}`}>
		<div className="flex flex-row justify-between w-full max-w-screen-lg">

			{/* LHS: */}
			<div className="-mx-3 flex flex-row">
				<Link className="px-3 flex flex-row items-center" to={constants.PATH_HOME} data-e2e="nav-home">
					<Feather.Layers className="mr-3 w-6 h-6 text-md-blue-a400" />
					<CodexLogo className="w-24 h-6" />
				</Link>
			</div>

			{/* RHS: */}
			<div className="-mx-3 flex flex-row">
				<NavLink
					to={constants.PATH_TODO}
					text="What is Codex?"
					// data-e2e="nav-a" // TODO
				/>
				<NavLink
					to={constants.PATH_DEMO}
					text="Try the editor"
					// data-e2e="nav-b" // TODO
				/>
				{/* CTA: */}
				<div className="ml-6 mr-3 flex flex-row items-center">
					<Link className="px-4 py-3 flex flex-row items-center text-md-blue-a400 hover:bg-gray-100 border border-md-blue-a400 rounded-md tx-75" to={constants.PATH_AUTH} data-e2e="nav-cta-btn">
						<p className="font-medium text-px">
							Open your Codex
						</p>
					</Link>
				</div>
			</div>

		</div>
	</div>
)

const AuthNav = props => {
	const [open, setOpen] = React.useState(false)

	return (
		<div className="px-6 fixed inset-x-0 top-0 flex flex-row justify-center h-20 bg-gray-50 z-30 select-none">
			<div className="relative flex flex-row justify-between w-full max-w-screen-lg">

				{/* LHS: */}
				<div className="-mx-3 flex flex-row">
					<Link className="px-3 flex flex-row items-center" to={constants.PATH_HOME} data-e2e="nav-home">
						<Feather.Layers className="mr-3 w-6 h-6 text-md-blue-a400" />
						<CodexLogo className="w-24 h-6" />
					</Link>
				</div>

				<div className="-mx-3 flex flex-row md:hidden">
					<div className="p-3 flex flex-row items-center cursor-pointer" onClick={e => setOpen(!open)}>
						<Feather.Menu className="w-6 h-6 stroke-500" />
					</div>
				</div>

				{/* RHS: */}
				<div className={`-mx-3 -mt-4 md:mt-0 py-4 md:py-0 absolute right-0 top-full ${!open ? "hidden" : "block"} md:static md:flex md:flex-row bg-gray-50 rounded-lg shadow-hero-lg md:shadow-none`}>
					<Link to={constants.PATH_TODO} className="px-7 md:px-4 py-3 flex flex-row items-center text-gray-900 hover:text-md-blue-a400 hover:bg-gray-100 md:hover:bg-transparent active:bg-gray-200 tx-75">
						<p className="font-medium text-px">
							What is Codex?
						</p>
					</Link>
					<Link to={constants.PATH_TODO} className="px-7 md:px-4 py-3 flex flex-row items-center text-gray-900 hover:text-md-blue-a400 hover:bg-gray-100 md:hover:bg-transparent active:bg-gray-200 tx-75">
						<p className="font-medium text-px">
							Try the editor
						</p>
					</Link>
					{/* CTA: */}
					<div className="mx-3 md:ml-4 mt-4 md:mt-0 flex flex-row items-center">
						<Link className="px-4 py-3 box-content flex flex-row items-center text-md-blue-a400 hover:bg-gray-100 active:bg-gray-200 border border-md-blue-a400 rounded-md tx-75" to={constants.PATH_AUTH} data-e2e="nav-cta-btn">
							<p className="font-medium text-px">
								Open your Codex
							</p>
						</Link>
					</div>
				</div>

			</div>
			{/* <CSSDebugger /> */}
		</div>
	)
}

const Nav = props => {
	const [user] = React.useContext(User.Context)

	let Component = null
	if (!!user) {
		Component = <UnauthNav {...props} />
	} else {
		Component = <AuthNav {...props} />
	}
	return Component
}

export default Nav
