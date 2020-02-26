import * as constants from "__constants"
import * as Feather from "react-feather"
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

const Nav = props => (
	<div className={`px-6 fixed inset-x-0 top-0 flex flex-row justify-center h-20 z-30 ${props.className || ""}`.trimEnd()}>
		<div className="flex flex-row justify-between w-full max-w-screen-lg">

			{/* LHS: */}
			<div className="-mx-3 flex flex-row">
				<Link className="px-3 flex flex-row items-center" to={constants.PATH_HOME} data-e2e="nav-home">
					<div className="mr-3 text-md-blue-a400">
						<Feather.Layers className="w-6 h-6" />
					</div>
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

export default Nav
